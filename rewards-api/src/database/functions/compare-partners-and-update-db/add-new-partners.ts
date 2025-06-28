import path from "node:path";
import { Partner } from "../../entities/partner";
import { getPartnerIdsFromChangeSet } from "../../../util/get-partner-ids-from-changeset";
import { readPartnerData } from "../../../util/read-partner-data";
import type { EntityManager } from "@mikro-orm/core";
import type { ChangeSet } from "../../../model/changeset";

export async function addNewPartners(em: EntityManager, changeSet: ChangeSet) {
  const partnerIds = getPartnerIdsFromChangeSet(changeSet);
  const existingPartners = await em.findAll(Partner, {
    fields: ["id"],
  });
  const existingPartnerIds = new Set(existingPartners.map((p) => p.id));
  const newPartnersIds = partnerIds.filter((id) => !existingPartnerIds.has(id));

  for (const newPartnerId of newPartnersIds) {
    const pathToPartnerDirectory = path.join(
      __dirname,
      `../../../partners/${newPartnerId}`
    );

    const partnerData = readPartnerData(pathToPartnerDirectory);

    if (!partnerData) {
      throw new Error(
        "Failed to read partner data for partner with id " + newPartnerId
      );
    }

    const newPartner = new Partner();
    newPartner.id = newPartnerId;
    (newPartner.name = partnerData.name),
      (newPartner.description = partnerData.description);
    newPartner.website = partnerData.website;
    newPartner.why8by8 = partnerData.why8by8;
    newPartner.hash = changeSet.partners[newPartner.id].hash;
    em.persist(newPartner);
  }

  await em.flush();
}
