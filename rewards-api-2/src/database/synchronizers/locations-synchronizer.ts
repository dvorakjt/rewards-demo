import { EntityManager } from "@mikro-orm/postgresql";
import { Location } from "../entities/location";
import type { ILocationsSynchronizer } from "./i-locations-synchronizer";
import type { ILocationsReader } from "../../io/i-locations-reader";
import type { IChangeSetReader } from "../../io/i-changeset-reader";

export class LocationsSynchronizer implements ILocationsSynchronizer {
  constructor(
    private readonly changeSetReader: IChangeSetReader,
    private readonly locationsReader: ILocationsReader,
    private readonly batchSize: number
  ) {}

  public async synchronizeLocations(entityManager: EntityManager) {
    await entityManager.transactional(async (em) => {
      for (const partnerId of this.changeSetReader.readPartnerIds()) {
        if (this.locationsReader.partnerHasLocations(partnerId)) {
          const createOrUpdateRequired =
            await this.partnerLocationsRequireCreationOrUpdate(em, partnerId);

          if (createOrUpdateRequired) {
            await this.createOrUpdatePartnerLocations(em, partnerId);
          }
        } else {
          await this.removeAllPartnerLocations(em, partnerId);
        }
      }
    });
  }

  private async partnerLocationsRequireCreationOrUpdate(
    em: EntityManager,
    partnerId: string
  ): Promise<boolean> {
    const queryBuilder = em.createQueryBuilder(Location);
    const lastModifiedAt =
      this.changeSetReader.readPartnerLocationsLastModifiedAt(partnerId);
    const distinctModificationTimestamps = (
      await queryBuilder
        .select("lastModifiedAt", true)
        .where({
          partnerId,
        })
        .execute()
    ).map((l) => l.lastModifiedAt);

    const updateRequired =
      distinctModificationTimestamps.length === 0 ||
      distinctModificationTimestamps.some(
        (t) => t.getTime() !== lastModifiedAt.getTime()
      );

    return updateRequired;
  }

  private createOrUpdatePartnerLocations(em: EntityManager, partnerId: string) {
    return new Promise<void>((resolve) => {
      const locationsLastModifiedAt =
        this.changeSetReader.readPartnerLocationsLastModifiedAt(partnerId);

      const coordinatesStream =
        this.locationsReader.readLocationsCoordinates(partnerId);

      let locationsToUpsert: Location[] = [];

      const upsertLocationsAndClearBuffer = async () => {
        const copyOfLocationsToUpsert = [...locationsToUpsert];
        locationsToUpsert = [];
        await em.upsertMany(Location, copyOfLocationsToUpsert, {
          onConflictFields: ["partnerId", "coordinates"],
          onConflictAction: "merge",
        });
        em.clear();
      };

      coordinatesStream.on("data", async (coordinates) => {
        const location = em.create(Location, {
          partnerId,
          coordinates,
          lastModifiedAt: locationsLastModifiedAt,
        });

        locationsToUpsert.push(location);

        if (locationsToUpsert.length >= this.batchSize) {
          await upsertLocationsAndClearBuffer();
        }
      });

      coordinatesStream.on("end", async () => {
        // insert any locations still in the buffer
        await upsertLocationsAndClearBuffer();

        // remove locations whose lastModifiedAt was not updated
        await em.nativeDelete(Location, {
          $and: [
            {
              partnerId: {
                $eq: partnerId,
              },
            },
            {
              lastModifiedAt: {
                $ne: locationsLastModifiedAt,
              },
            },
          ],
        });

        resolve();
      });
    });
  }

  private async removeAllPartnerLocations(
    em: EntityManager,
    partnerId: string
  ) {
    await em.nativeDelete(Location, {
      partnerId: {
        $eq: partnerId,
      },
    });
  }
}
