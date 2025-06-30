import type { EntityManager } from "@mikro-orm/postgresql";

export interface IRewardsSynchronizer {
  synchronizeRewards(entityManager: EntityManager): Promise<void>;
}
