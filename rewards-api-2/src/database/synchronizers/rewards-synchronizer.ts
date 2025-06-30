import { Reward } from "../entities/reward";
import type { EntityManager } from "@mikro-orm/postgresql";
import type { IRewardsSynchronizer } from "./i-rewards-synchronizer";
import type { IChangeSetReader } from "../../readers/i-change-set-reader";
import type { IRewardReader } from "../../readers/i-reward-reader";

export class RewardsSynchronizer implements IRewardsSynchronizer {
  constructor(
    private readonly changeSetReader: IChangeSetReader,
    private readonly rewardReader: IRewardReader
  ) {}

  async synchronizeRewards(entityManager: EntityManager): Promise<void> {
    await entityManager.transactional(async (em) => {
      await this.deleteRemovedRewards(em);
      await this.createOrUpdateRewards(em);
    });
  }

  async deleteRemovedRewards(em: EntityManager) {
    await em.nativeDelete(Reward, {
      id: {
        $nin: this.changeSetReader.readRewardIds(),
      },
    });
  }

  async createOrUpdateRewards(em: EntityManager) {
    const existingRewardsByPartnerId =
      await this.getExistingRewardsGroupedByPartnerId(em);

    for (const [partnerId, rewardIds] of Object.entries(
      existingRewardsByPartnerId
    )) {
      for (const rewardId of rewardIds) {
        const rewardData = this.rewardReader.readRewardData(
          partnerId,
          rewardId
        );

        const lastModifiedAt =
          this.changeSetReader.readRewardLastModifiedAt(rewardId);

        await em.nativeUpdate(
          Reward,
          {
            $and: [
              {
                id: {
                  $eq: rewardId,
                },
              },
              {
                $or: [
                  // I don't think this is actually necessary, last modified
                  // should be updated if the reward's partner changed
                  // {
                  //   partnerId: {
                  //     $ne: partnerId,
                  //   },
                  // },
                  {
                    lastModifiedAt: {
                      $ne: lastModifiedAt,
                    },
                  },
                ],
              },
            ],
          },
          {
            partnerId,
            ...rewardData,
            lastModifiedAt,
          }
        );
      }
    }

    const rewardIdsToCreateByPartnerId =
      this.changeSetReader.readRewardIdsGroupedByPartnerId();

    for (const [partnerId, rewardIds] of Object.entries(
      rewardIdsToCreateByPartnerId
    )) {
      for (const rewardId of rewardIds) {
        const rewardData = this.rewardReader.readRewardData(
          partnerId,
          rewardId
        );

        const lastModifiedAt =
          this.changeSetReader.readRewardLastModifiedAt(rewardId);

        const reward = new Reward();
        reward.id = rewardId;
        reward.partnerId = partnerId;
        reward.shortDescription = rewardData.shortDescription;
        reward.redemptionForums = rewardData.redemptionForums;
        reward.longDescription = rewardData.longDescription;
        reward.expirationDate = rewardData.expirationDate;
        reward.lastModifiedAt = lastModifiedAt;
        em.persist(reward);
      }
    }

    await em.flush();
    em.clear();
  }

  private async getExistingRewardsGroupedByPartnerId(
    em: EntityManager
  ): Promise<Record<string, string[]>> {
    const queryBuilder = em.createQueryBuilder(Reward).select("id");
    const queryResults = await queryBuilder.execute();
    const existingRewardIdsByPartnerId: Record<string, string[]> = {};

    for (const { id, partnerId } of queryResults) {
      if (!(partnerId in existingRewardIdsByPartnerId)) {
        existingRewardIdsByPartnerId[partnerId] = [];
      }

      existingRewardIdsByPartnerId[partnerId].push(id);
    }

    return existingRewardIdsByPartnerId;
  }
}
