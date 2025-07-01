import { Partner } from "../entities/partner";
import type { EntityManager } from "@mikro-orm/postgresql";
import type { IPartnersSynchronizer } from "./i-partners-synchronizer";
import type { IPartnerReader } from "../../io/i-partner-reader";
import type { IChangeSetReader } from "../../io/i-changeset-reader";

export class PartnersSynchronizer implements IPartnersSynchronizer {
  constructor(
    private readonly changeSetReader: IChangeSetReader,
    private readonly partnerReader: IPartnerReader
  ) {}

  async synchronizePartners(entityManager: EntityManager): Promise<void> {
    await entityManager.transactional(async (em) => {
      await this.deleteRemovedPartners(em);
      await this.createOrUpdatePartners(em);
    });
  }

  async deleteRemovedPartners(em: EntityManager) {
    await em.nativeDelete(Partner, {
      id: {
        $nin: this.changeSetReader.readPartnerIds(),
      },
    });
  }

  async createOrUpdatePartners(em: EntityManager) {
    const queryBuilder = em.createQueryBuilder(Partner).select("id");
    const existingPartnerIds = (await queryBuilder.execute()).map((p) => p.id);

    for (const partnerId of existingPartnerIds) {
      const partnerData = this.partnerReader.readPartnerData(partnerId);
      const lastModifiedAt =
        this.changeSetReader.readPartnerLastModifiedAt(partnerId);

      await em.nativeUpdate(
        Partner,
        {
          $and: [
            {
              id: {
                $eq: partnerId,
              },
            },
            {
              lastModifiedAt: {
                $ne: lastModifiedAt,
              },
            },
          ],
        },
        {
          ...partnerData,
          lastModifiedAt,
        }
      );
    }

    const partnerIdsToCreate = this.changeSetReader
      .readPartnerIds()
      .filter((id) => !existingPartnerIds.includes(id));

    for (const partnerId of partnerIdsToCreate) {
      const partnerData = this.partnerReader.readPartnerData(partnerId);
      const lastModifiedAt =
        this.changeSetReader.readPartnerLastModifiedAt(partnerId);
      const partner = new Partner();
      partner.id = partnerId;
      partner.name = partnerData.name;
      partner.description = partnerData.description;
      partner.website = partnerData.website;
      partner.why8by8 = partnerData.why8by8;
      partner.lastModifiedAt = lastModifiedAt;
      em.persist(partner);
    }

    await em.flush();
    em.clear();
  }
}
