import type { ChangeSet } from "../model/changeset";

export function getPartnerIdsFromChangeSet(changeSet: ChangeSet) {
  const partnerIds = Object.keys(changeSet.partners);
  return partnerIds;
}
