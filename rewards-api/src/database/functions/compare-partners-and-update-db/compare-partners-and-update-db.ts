import { addNewPartners } from "./add-new-partners";
import { deleteRemovedPartners } from "./delete-removed-partners";
import { updateModifiedPartners } from "./update-modified-partners";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";

export async function comparePartnersAndUpdateDB(
  em: EntityManager,
  changeSet: ChangeSet
) {
  await deleteRemovedPartners(em, changeSet);
  await updateModifiedPartners(em, changeSet);
  await addNewPartners(em, changeSet);
}
