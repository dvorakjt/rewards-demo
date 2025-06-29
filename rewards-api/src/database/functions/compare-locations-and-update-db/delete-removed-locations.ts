import { getPartnerIdsFromChangeSet } from "../../../util/get-partner-ids-from-changeset";
import { LocationsHash } from "../../entities/locations-hash";
import { Location } from "../../entities/location";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";

export async function deleteRemovedLocations(
  em: EntityManager,
  changeSet: ChangeSet
) {
  const partnerIds = getPartnerIdsFromChangeSet(changeSet);
  const partnerIdsWithoutLocationsHashes = partnerIds.filter((id) => {
    return !!changeSet.partners[id].locationsHash;
  });

  await em.nativeDelete(LocationsHash, {
    partnerId: {
      $in: partnerIdsWithoutLocationsHashes,
    },
  });

  await em.nativeDelete(Location, {
    partnerId: {
      $in: partnerIdsWithoutLocationsHashes,
    },
  });
}
