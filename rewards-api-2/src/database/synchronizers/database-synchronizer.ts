import type { EntityManager } from "@mikro-orm/postgresql";
import type { IDatabaseSynchronizer } from "./i-database-synchronizer";
import type { IPartnersSynchronizer } from "./i-partners-synchronizer";
import type { ILocationsSynchronizer } from "./i-locations-synchronizer";
import type { IRewardsSynchronizer } from "./i-rewards-synchronizer";

export class DatabaseSynchronizer implements IDatabaseSynchronizer {
  constructor(
    private readonly partnersSynchronizer: IPartnersSynchronizer,
    private readonly locationsSynchronizer: ILocationsSynchronizer,
    private readonly rewardsSynchronizer: IRewardsSynchronizer
  ) {}

  async synchronizeDatabase(entityManager: EntityManager): Promise<void> {
    await entityManager.transactional(async (em) => {
      await this.partnersSynchronizer.synchronizePartners(em);
      await this.locationsSynchronizer.synchronizeLocations(em);
      await this.rewardsSynchronizer.synchronizeRewards(em);
    });
  }
}
