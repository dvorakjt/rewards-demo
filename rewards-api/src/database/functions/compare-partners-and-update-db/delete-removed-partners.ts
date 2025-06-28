import { getPartnerIdsFromChangeSet } from "../../../util/get-partner-ids-from-changeset";
import { Partner } from "../../entities/partner";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";

export async function deleteRemovedPartners(
  em: EntityManager,
  changeSet: ChangeSet
) {
  const partnerIds = getPartnerIdsFromChangeSet(changeSet);
  await em.nativeDelete(Partner, {
    id: {
      $nin: partnerIds,
    },
  });
}
