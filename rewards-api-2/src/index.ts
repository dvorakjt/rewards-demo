import path from "node:path";
import { database } from "./database/database";
import { DatabaseSynchronizer } from "./database/synchronizers/database-synchronizer";
import { PartnersSynchronizer } from "./database/synchronizers/partners-synchronizer";
import { LocationsSynchronizer } from "./database/synchronizers/locations-synchronizer";
import { RewardsSynchronizer } from "./database/synchronizers/rewards-synchronizer";
import { ChangeSetReader } from "./readers/change-set-reader";
import { PartnerReader } from "./readers/partner-reader";
import { LocationsReader } from "./readers/locations-reader";
import { RewardReader } from "./readers/reward-reader";

main();

async function main() {
  const pathToPartnersDirectory = path.join(__dirname, "partners");
  const pathToRewardsDirectory = path.join(__dirname, "rewards");
  const pathToChangeSet = path.join(__dirname, "changeset.json");

  const changeSetReader = new ChangeSetReader(pathToChangeSet);
  const partnerReader = new PartnerReader(pathToPartnersDirectory);
  const locationsReader = new LocationsReader(pathToPartnersDirectory);
  const rewardReader = new RewardReader(pathToRewardsDirectory);

  const partnersSynchronizer = new PartnersSynchronizer(
    changeSetReader,
    partnerReader
  );
  const locationsSynchronizer = new LocationsSynchronizer(
    changeSetReader,
    locationsReader,
    10
  );
  const rewardsSynchronizer = new RewardsSynchronizer(
    changeSetReader,
    rewardReader
  );

  const databaseSynchronizer = new DatabaseSynchronizer(
    partnersSynchronizer,
    locationsSynchronizer,
    rewardsSynchronizer
  );

  const entityManager = database.entityManager.fork();

  await databaseSynchronizer.synchronizeDatabase(entityManager);

  database.orm.close();
}
