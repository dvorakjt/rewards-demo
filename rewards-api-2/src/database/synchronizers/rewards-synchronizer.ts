import { Reward } from "../entities/reward";
import type { EntityManager } from "@mikro-orm/postgresql";
import type { IRewardsSynchronizer } from "./i-rewards-synchronizer";
import type { IChangeSetReader } from "../../io/i-changeset-reader";
import type { IRewardReader } from "../../io/i-reward-reader";

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
    const existingRewardIds = await this.getExistingRewardIds(em);

    for (const rewardId of existingRewardIds) {
      const rewardData = this.rewardReader.readRewardData(rewardId);
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
                {
                  partnerId: {
                    $ne: rewardData.partnerId,
                  },
                },
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
          ...rewardData,
          lastModifiedAt,
        }
      );
    }

    const allRewardIds = this.changeSetReader.readRewardIds();
    const newRewardIds = allRewardIds.filter(
      (id) => !existingRewardIds.includes(id)
    );

    for (const rewardId of newRewardIds) {
      const rewardData = this.rewardReader.readRewardData(rewardId);
      const lastModifiedAt =
        this.changeSetReader.readRewardLastModifiedAt(rewardId);
      const reward = new Reward();
      reward.id = rewardId;
      reward.partnerId = rewardData.partnerId;
      reward.shortDescription = rewardData.shortDescription;
      reward.redemptionForums = rewardData.redemptionForums;
      reward.longDescription = rewardData.longDescription;
      reward.expirationDate = rewardData.expirationDate;
      reward.lastModifiedAt = lastModifiedAt;
      em.persist(reward);
    }

    await em.flush();
    em.clear();
  }

  async getExistingRewardIds(em: EntityManager): Promise<string[]> {
    const queryResults = await em.findAll(Reward, { fields: ["id"] });
    const rewardIds = queryResults.map((r) => r.id);
    return rewardIds;
  }
}
