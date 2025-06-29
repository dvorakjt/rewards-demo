import path from "node:path";
import { streamLocations } from "../../../util/stream-locations";
import { PartnerDefinitionFiles } from "../../../constants/partner-definition-files";
import { getPartnerIdsFromChangeSet } from "../../../util/get-partner-ids-from-changeset";
import { Location } from "../../entities/location";
import { LocationsHash } from "../../entities/locations-hash";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";
import type { IPoint } from "../../../model/i-point";

export async function updateModifiedLocations(
  em: EntityManager,
  changeSet: ChangeSet
) {
  const partnerIds = getPartnerIdsFromChangeSet(changeSet);
  for (const partnerId of partnerIds) {
    const newLocationsHash = changeSet.partners[partnerId].locationsHash;
    if (newLocationsHash) {
      const persistedLocationsHash = await em.findOne(LocationsHash, {
        partnerId,
      });
      if (
        persistedLocationsHash &&
        persistedLocationsHash.hash !== newLocationsHash
      ) {
        persistedLocationsHash.hash = newLocationsHash;
        await em.persistAndFlush(persistedLocationsHash);
        updateModifiedPartnerLocations(em, partnerId);
      }
    }
  }
}

function updateModifiedPartnerLocations(em: EntityManager, partnerId: string) {
  return new Promise<void>(async (resolve) => {
    const pathToLocationsFile = path.join(
      __dirname,
      `../../../partners${partnerId}/${PartnerDefinitionFiles.LocationsFile}`
    );

    const locationIds: bigint[] = [];
    const locationsStream = streamLocations(pathToLocationsFile);
    locationsStream.on("data", async (data) => {
      const point = data as unknown as IPoint;
      const location = await em.upsert(Location, {
        partnerId,
        coordinates: point,
      });
      locationIds.push(location.id);
    });
    locationsStream.on("end", async () => {
      await em.nativeDelete(Location, {
        $and: [
          {
            id: {
              $nin: locationIds,
            },
          },
          {
            partnerId: {
              $eq: partnerId,
            },
          },
        ],
      });
      resolve();
    });
  });
}
