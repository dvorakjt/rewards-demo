import path from "node:path";
import { PartnerFilesWatcher } from "../change-detection/partner-files-watcher";
import { RewardFilesWatcher } from "../change-detection/reward-files-watcher";

const pathToChangeSet = path.join(__dirname, "../changeset.json");
const pathToPartnersDirectory = path.join(__dirname, "../partners");
const pathToRewardsDirectory = path.join(__dirname, "../rewards");

const partnerFilesWatcher = new PartnerFilesWatcher(
  pathToChangeSet,
  pathToPartnersDirectory,
  pathToRewardsDirectory
);

partnerFilesWatcher.watchPartnersDirectory();

const rewardFilesWatcher = new RewardFilesWatcher(
  pathToChangeSet,
  pathToRewardsDirectory
);

rewardFilesWatcher.watchRewardsDirectory();
