import { deleteRemovedLocations } from "./delete-removed-locations";
import { updateModifiedLocations } from "./update-modified-locations";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";

export async function compareLocationsAndUpdateDB(
  em: EntityManager,
  changeSet: ChangeSet
) {
  await deleteRemovedLocations(em, changeSet);
  await updateModifiedLocations(em, changeSet);
  // if the locations hash exists in the db and locally, but they are different, locations must be updated
  // if the locations hash does not exist in the db, but does exist in the changeset, both locations and locationsHash must be added
}
