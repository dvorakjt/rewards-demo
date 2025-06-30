import type { EntityManager } from "@mikro-orm/postgresql";

export interface IDatabaseSynchronizer {
  synchronizeDatabase(entityManager: EntityManager): Promise<void>;
}
