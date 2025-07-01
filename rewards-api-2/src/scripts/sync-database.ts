import path from "node:path";
import { ChangeSetReaderWriter } from "../io/changeset-reader-writer";
import { PartnerReader } from "../io/partner-reader";
import { LocationsReader } from "../io/locations-reader";
import { RewardReader } from "../io/reward-reader";
import { DatabaseSynchronizer } from "../database/synchronizers/database-synchronizer";
import { PartnersSynchronizer } from "../database/synchronizers/partners-synchronizer";
import { LocationsSynchronizer } from "../database/synchronizers/locations-synchronizer";
import { RewardsSynchronizer } from "../database/synchronizers/rewards-synchronizer";
import { connectToDatabase } from "../database/connect-to-database";

const pathToPartnersDirectory = path.join(__dirname, "../partners");
const pathToRewardsDirectory = path.join(__dirname, "../rewards");
const pathToChangeSet = path.join(__dirname, "../changeset.json");

const changeSetReader = new ChangeSetReaderWriter(pathToChangeSet);
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
  100
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

const database = connectToDatabase();
const entityManager = database.entityManager.fork();
databaseSynchronizer
  .synchronizeDatabase(entityManager)
  .finally(() => database.orm.close());
