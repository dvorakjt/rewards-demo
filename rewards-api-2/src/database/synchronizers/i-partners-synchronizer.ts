import type { EntityManager } from "@mikro-orm/postgresql";

export interface IPartnersSynchronizer {
  synchronizePartners(entityManager: EntityManager): Promise<void>;
}
