// delete rewards whose ids don't exist in changeset
// update rewards whose hashes OR partner ids are different (possible to move a reward from one partner to another)
// add new rewards
import { db } from "../db";
import { comparePartnersAndUpdateDB } from "./compare-partners-and-update-db";
import { compareLocationsAndUpdateDB } from "./compare-locations-and-update-db";
import { compareRewardsAndUpdateDB } from "./compare-rewards-and-update-db";
import { ChangeSet } from "../../model/changeset";

export async function compareDBWithFSAndUpdateDB(changeSet: ChangeSet) {
  await db.em.transactional(async (em) => {
    await comparePartnersAndUpdateDB(em, changeSet);
    // await Promise.all([
    //   compareLocationsAndUpdateDB(),
    //   compareRewardsAndUpdateDB(),
    // ]);
  });
}
