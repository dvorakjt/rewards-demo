// read changeset
// delete partners whose ids don't exist in changeset
// update partners that exist in the database but whose hash is different
// add partners that didn't exist previously

// compare partner locations hashes with hashes in the db
// if the locations hash does not exist in the db, but does exist in the changeset, both locations and locationsHash must be added
// if the locations hash exists in the db, but not locally, all locations + the locations hash must be removed from the db
// if the locations hash exists in the db and locally, but they are different, locations must be updated
// if the locations hash exists in both places and is the same or does not exist in both places, no action is taken

// delete rewards whose ids don't exist in changeset
// update rewards whose hashes OR partner ids are different (possible to move a reward from one partner to another)
// add new rewards

// remember, deletion of partners cascades to locations, location hashes, and rewards
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
