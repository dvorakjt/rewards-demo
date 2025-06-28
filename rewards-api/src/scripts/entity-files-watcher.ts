import path from "node:path";
import fs from "node:fs";
import { watchFileOrDirectory } from "./watch-file-or-directory";
import { readChangeSet } from "../util/read-changeset";
import { updateChangeSet } from "../util/update-changeset";
import { readPartnerData } from "../util/read-partner-data";
import { readRewardData } from "../util/read-reward-data";
import { hashString } from "../util/hash-string";
import { hashObject } from "../util/hash-object";
import { PartnerDefinitionFiles } from "../constants/partner-definition-files";
import type { IPartner } from "../model/i-partner";
import type { IReward } from "../model/i-reward";

export class EntityFilesWatcher {
  constructor(
    private pathToPartnersDirectory: string,
    private pathToRewardsDirectory: string,
    private pathToChangeSet: string
  ) {}

  public watchEntityFiles() {
    this.watchPartnersDirectory();
    this.watchRewardsDirectory();
  }

  private watchPartnersDirectory() {
    watchFileOrDirectory(
      this.pathToPartnersDirectory,
      (_, sourcePath, destinationPath) => {
        if (sourcePath.startsWith(this.pathToPartnersDirectory)) {
          this.processPartner(sourcePath);
        }

        if (destinationPath.startsWith(this.pathToPartnersDirectory)) {
          this.processPartner(destinationPath);
        }
      }
    );
  }

  private watchRewardsDirectory() {
    watchFileOrDirectory(
      this.pathToRewardsDirectory,
      (_, sourcePath, destinationPath) => {
        if (sourcePath.startsWith(this.pathToRewardsDirectory)) {
          this.processReward(sourcePath);
        }

        if (destinationPath.startsWith(this.pathToRewardsDirectory)) {
          this.processReward(destinationPath);
        }
      }
    );
  }

  private processPartner(filepath: string) {
    const partnerId = this.extractPartnerIdFromPartnersPath(filepath);
    if (partnerId) {
      const pathToPartnerDirectory = this.getPathToPartnerDirectory(partnerId);
      const partnerData = readPartnerData(pathToPartnerDirectory);

      if (partnerData) {
        this.hashPartnerAndUpdateChangeSet(partnerId, partnerData);
        this.discoverRewards(partnerId);
      } else {
        this.removePartnerFromChangeSet(partnerId);
      }
    }
  }

  private extractPartnerIdFromPartnersPath(filepath: string) {
    const pathToPartnersDirectoryWithTrailingSeparator =
      this.pathToPartnersDirectory + path.sep;

    let indexOfNextSeparator = filepath.indexOf(
      path.sep,
      pathToPartnersDirectoryWithTrailingSeparator.length
    );

    if (indexOfNextSeparator === -1) {
      indexOfNextSeparator = filepath.length;
    }

    const partnerId = filepath.slice(
      pathToPartnersDirectoryWithTrailingSeparator.length,
      indexOfNextSeparator
    );

    return partnerId;
  }

  private hashPartnerAndUpdateChangeSet(
    partnerId: string,
    partnerData: Partial<IPartner>
  ) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    changeSet.partners[partnerId] = {};
    const partnerHash = hashObject(partnerData);
    changeSet.partners[partnerId].hash = partnerHash;

    const pathToPartnerDirectory = this.getPathToPartnerDirectory(partnerId);
    const pathToLocationsFile = path.join(
      pathToPartnerDirectory,
      PartnerDefinitionFiles.LocationsFile
    );
    if (fs.existsSync(pathToLocationsFile)) {
      const locations = fs.readFileSync(pathToLocationsFile, "utf-8");
      const locationsHash = hashString(locations);
      changeSet.partners[partnerId].locationsHash = locationsHash;
    }
    updateChangeSet(this.pathToChangeSet, changeSet);
  }

  private removePartnerFromChangeSet(partnerId: string) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    delete changeSet.partners[partnerId];
    updateChangeSet(this.pathToChangeSet, changeSet);
  }

  private getPathToPartnerDirectory(partnerId: string) {
    return path.join(this.pathToPartnersDirectory, partnerId);
  }

  private discoverRewards(partnerId: string) {
    const pathToPartnerRewardsDirectory = path.join(
      this.pathToRewardsDirectory,
      partnerId
    );

    if (fs.existsSync(pathToPartnerRewardsDirectory)) {
      const rewardIds = fs.readdirSync(pathToPartnerRewardsDirectory);

      for (const rewardId of rewardIds) {
        const pathToReward = path.join(pathToPartnerRewardsDirectory, rewardId);
        this.processReward(pathToReward);
      }
    }
  }

  private processReward(filepath: string) {
    const partnerId = this.extractPartnerIdFromRewardsPath(filepath);
    if (this.partnerExistsInChangeSet(partnerId)) {
      if (this.partnerRewardsDirectoryExists(partnerId)) {
        const rewardId = this.extractRewardIdFromFilePathWithPartnerId(
          filepath,
          partnerId
        );

        const pathToRewardDirectory = this.getPathToRewardDirectory(
          partnerId,
          rewardId
        );

        const rewardData = readRewardData(pathToRewardDirectory);

        if (rewardData) {
          this.hashRewardAndUpdateChangeSet(partnerId, rewardId, rewardData);
        } else if (this.partnerHasRewardsInChangeSet(partnerId)) {
          this.removeRewardFromChangeSet(partnerId, rewardId);
        }
      } else {
        this.removeAllPartnerRewardsFromChangeSet(partnerId);
      }
    }
  }

  private extractPartnerIdFromRewardsPath(filepath: string) {
    const pathToRewardsDirectoryWithTrailingSeparator =
      this.pathToRewardsDirectory + path.sep;

    let indexOfNextSeparator = filepath.indexOf(
      path.sep,
      pathToRewardsDirectoryWithTrailingSeparator.length
    );

    if (indexOfNextSeparator === -1) {
      indexOfNextSeparator = filepath.length;
    }

    const partnerId = filepath.slice(
      pathToRewardsDirectoryWithTrailingSeparator.length,
      indexOfNextSeparator
    );

    return partnerId;
  }

  private partnerExistsInChangeSet(partnerId: string) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    return partnerId in changeSet.partners;
  }

  private partnerRewardsDirectoryExists(partnerId: string) {
    const pathToPartnerRewardsDirectory =
      this.getPathToPartnerRewardsDirectory(partnerId);
    const partnerRewardsDirectoryExists = fs.existsSync(
      pathToPartnerRewardsDirectory
    );
    return partnerRewardsDirectoryExists;
  }

  private extractRewardIdFromFilePathWithPartnerId(
    filepath: string,
    partnerId: string
  ) {
    const pathToPartnerRewardsDirectoryWithTrailingSep =
      this.getPathToPartnerRewardsDirectory(partnerId) + path.sep;

    let indexOfNextSeparator = filepath.indexOf(
      path.sep,
      pathToPartnerRewardsDirectoryWithTrailingSep.length
    );

    if (indexOfNextSeparator === -1) {
      indexOfNextSeparator = filepath.length;
    }

    const rewardId = filepath.slice(
      pathToPartnerRewardsDirectoryWithTrailingSep.length,
      indexOfNextSeparator
    );

    return rewardId;
  }

  private getPathToRewardDirectory(partnerId: string, rewardId: string) {
    const pathToPartnerRewardsDirectory =
      this.getPathToPartnerRewardsDirectory(partnerId);
    const pathToRewardDirectory = path.join(
      pathToPartnerRewardsDirectory,
      rewardId
    );
    return pathToRewardDirectory;
  }

  private getPathToPartnerRewardsDirectory(partnerId: string) {
    return path.join(this.pathToRewardsDirectory, partnerId);
  }

  private hashRewardAndUpdateChangeSet(
    partnerId: string,
    rewardId: string,
    rewardData: Partial<IReward>
  ) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    if (!this.partnerHasRewardsInChangeSet(partnerId)) {
      changeSet.partners[partnerId].rewards = {};
    }
    const hashedReward = hashObject(rewardData);
    changeSet.partners[partnerId].rewards[rewardId] = hashedReward;
    updateChangeSet(this.pathToChangeSet, changeSet);
  }

  private removeRewardFromChangeSet(partnerId: string, rewardId: string) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    delete changeSet.partners[partnerId].rewards[rewardId];
    updateChangeSet(this.pathToChangeSet, changeSet);
  }

  private removeAllPartnerRewardsFromChangeSet(partnerId: string) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    delete changeSet.partners[partnerId].rewards;
    updateChangeSet(this.pathToChangeSet, changeSet);
  }

  private partnerHasRewardsInChangeSet(partnerId: string) {
    const changeSet = readChangeSet(this.pathToChangeSet);
    return "rewards" in changeSet.partners[partnerId];
  }
}
