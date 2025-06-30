import type { EntityManager } from "@mikro-orm/postgresql";

export interface ILocationsSynchronizer {
  synchronizeLocations(entityManager: EntityManager): Promise<void>;
}
