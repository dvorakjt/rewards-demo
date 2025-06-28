import path from "node:path";
import { EntityFilesWatcher } from "./entity-files-watcher";

const pathToPartnersDirectory = path.join(__dirname, "../partners");

const pathToRewardsDirectory = path.join(__dirname, "../rewards");

const pathToChangeSet = path.join(__dirname, "../changeset.json");

const watcher = new EntityFilesWatcher(
  pathToPartnersDirectory,
  pathToRewardsDirectory,
  pathToChangeSet
);

watcher.watchEntityFiles();
