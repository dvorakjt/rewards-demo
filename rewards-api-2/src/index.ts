import path from "node:path";
import { database } from "./database/database";
import { DatabaseSynchronizer } from "./database/synchronizers/database-synchronizer";
import { PartnersSynchronizer } from "./database/synchronizers/partners-synchronizer";
import { LocationsSynchronizer } from "./database/synchronizers/locations-synchronizer";
import { RewardsSynchronizer } from "./database/synchronizers/rewards-synchronizer";
import { ChangeSetReaderWriter } from "./io/changeset-reader-writer";
import { PartnerReader } from "./io/partner-reader";
import { LocationsReader } from "./io/locations-reader";
import { RewardReader } from "./io/reward-reader";
import { watchFileOrDirectory } from "./change-detection/watch-file-or-directory";
import { PartnerFilesWatcher } from "./change-detection/partner-files-watcher";
import { RewardFilesWatcher } from "./change-detection/reward-files-watcher";

main();

async function main() {
  const pathToPartnersDirectory = path.join(__dirname, "partners");
  const pathToRewardsDirectory = path.join(__dirname, "rewards");
  const pathToChangeSet = path.join(__dirname, "changeset.json");

  const changeSetReader = new ChangeSetReaderWriter(pathToChangeSet);
  const partnerReader = new PartnerReader(pathToPartnersDirectory);
  const locationsReader = new LocationsReader(pathToPartnersDirectory);
  const rewardReader = new RewardReader(pathToRewardsDirectory);

  // const partnersSynchronizer = new PartnersSynchronizer(
  //   changeSetReader,
  //   partnerReader
  // );
  // const locationsSynchronizer = new LocationsSynchronizer(
  //   changeSetReader,
  //   locationsReader,
  //   10
  // );
  // const rewardsSynchronizer = new RewardsSynchronizer(
  //   changeSetReader,
  //   rewardReader
  // );

  // const databaseSynchronizer = new DatabaseSynchronizer(
  //   partnersSynchronizer,
  //   locationsSynchronizer,
  //   rewardsSynchronizer
  // );

  // const entityManager = database.entityManager.fork();

  // await databaseSynchronizer.synchronizeDatabase(entityManager);

  // database.orm.close();

  const partnersWatcher = new PartnerFilesWatcher(
    pathToChangeSet,
    pathToPartnersDirectory,
    pathToRewardsDirectory
  );

  const rewardsWatcher = new RewardFilesWatcher(
    pathToChangeSet,
    pathToRewardsDirectory
  );

  partnersWatcher.watchPartnersDirectory();
  rewardsWatcher.watchRewardsDirectory();
}
