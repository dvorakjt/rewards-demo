import path from "node:path";
import { getPartnerIdsFromChangeSet } from "../../../util/get-partner-ids-from-changeset";
import { Partner } from "../../entities/partner";
import { readPartnerData } from "../../../util/read-partner-data";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";

export async function updateModifiedPartners(
  em: EntityManager,
  changeSet: ChangeSet
) {
  const partnerIds = getPartnerIdsFromChangeSet(changeSet);
  const partners = await em.find(Partner, {
    $and: [
      {
        id: { $in: partnerIds },
      },
    ],
  });

  const partnersToUpdate = partners.filter(
    (p) => p.hash !== changeSet.partners[p.id].hash
  );

  for (const partner of partnersToUpdate) {
    const pathToPartnerDirectory = path.join(
      __dirname,
      `../../../partners/${partner.id}`
    );

    const partnerData = readPartnerData(pathToPartnerDirectory);

    if (!partnerData) {
      throw new Error(
        "Failed to read partner data for partner with id " + partner.id
      );
    }

    partner.name = partnerData.name;
    partner.description = partnerData.description;
    partner.website = partnerData.website;
    partner.why8by8 = partnerData.why8by8;
    partner.hash = changeSet.partners[partner.id].hash;
    em.persist(partner);
  }

  await em.flush();
}
