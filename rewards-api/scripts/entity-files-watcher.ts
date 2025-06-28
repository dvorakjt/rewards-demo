import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { z } from "zod";
import { watch } from "./watch";
import { RedemptionForum } from "../src/model/redemption-forum";
import type { IPartner } from "../src/model/i-partner";
import type { IReward } from "../src/model/i-reward";

/*
  Notes:
  1. filepaths should be configurable for testing
  2. things to test:
     - creating a partner directory
     - creating files within the partner directory
     - renaming a partner directory (with valid files)
     - renaming a partner directory (with invalid files)
     - modifying files in a partner directory
     - moving a partner directory out of the partners folder
     - moving a partner directory into another partner directory
     - moving a valid partner directory into partners from outside
     - moving an invalid partner directory into partners from outside
     - deleting a valid partner directory
     - deleting an invalid partner directory
     - deleting files from a valid partner directory
     - deleting files from an invalid partner directory
  3. Kind of want this to live in src
*/
export class EntityFilesWatcher {
  pathToPartnersDirectory = path.join(__dirname, "../src/partners");
  pathToRewardsDirectory = path.join(__dirname, "../src/rewards");
  pathToChangeSet = path.join(__dirname, "../changeset.json");

  partnerDataSchema = z.object({
    name: z.string(),
    website: z.string().optional(),
  });

  rewardDataSchema = z.object({
    shortDescription: z.string(),
    redemptionForums: z.array(z.nativeEnum(RedemptionForum)),
    expirationDate: z.date().optional(),
  });

  watchEntityFiles() {
    this.watchPartnersDirectory();
    this.watchRewardsDirectory();
  }

  private watchPartnersDirectory() {
    watch(this.pathToPartnersDirectory, (_, sourcePath, destinationPath) => {
      if (sourcePath.startsWith(this.pathToPartnersDirectory)) {
        this.processPartner(sourcePath);
      }

      if (destinationPath.startsWith(this.pathToPartnersDirectory)) {
        this.processPartner(destinationPath);
      }
    });
  }

  private watchRewardsDirectory() {
    watch(this.pathToRewardsDirectory, (_, sourcePath, destinationPath) => {
      if (sourcePath.startsWith(this.pathToRewardsDirectory)) {
        this.processReward(sourcePath);
      }

      if (destinationPath.startsWith(this.pathToRewardsDirectory)) {
        this.processReward(destinationPath);
      }
    });
  }

  private processPartner(filepath: string) {
    const changeSet = this.readChangeSet();
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

    if (!partnerId) {
      return;
    }

    const pathToPartnerDirectory = path.join(
      this.pathToPartnersDirectory,
      partnerId
    );

    const partnerData = this.readPartnerData(pathToPartnerDirectory);

    if (partnerData) {
      changeSet.partners[partnerId] = {};
      const partnerHash = this.hashEntity(partnerData);
      changeSet.partners[partnerId].hash = partnerHash;
      const pathToLocationsFile = path.join(
        pathToPartnerDirectory,
        "locations.csv"
      );
      if (fs.existsSync(pathToLocationsFile)) {
        const locations = fs.readFileSync(pathToLocationsFile, "utf-8");
        const locationsHash = this.hashString(locations);
        changeSet.partners[partnerId].locationsHash = locationsHash;
      }
      this.updateChangeSet(changeSet);
      this.discoverRewards(partnerId);
    } else {
      delete changeSet.partners[partnerId];
      this.updateChangeSet(changeSet);
    }
  }

  private readPartnerData(pathToPartnerDirectory: string) {
    const pathToPartnerData = path.join(pathToPartnerDirectory, "data.ts");

    const pathToPartnerDescription = path.join(
      pathToPartnerDirectory,
      "description.md"
    );

    if (
      fs.existsSync(pathToPartnerData) &&
      fs.existsSync(pathToPartnerDescription)
    ) {
      try {
        delete require.cache[require.resolve(pathToPartnerData)];
        const { default: rawPartnerData } = require(pathToPartnerData);
        const parsedPartnerData = this.partnerDataSchema.parse(
          rawPartnerData
        ) as Partial<IPartner>;
        const description = fs.readFileSync(pathToPartnerDescription, "utf-8");
        parsedPartnerData.description = description;

        const pathToWhy8by8 = path.join(pathToPartnerDirectory, "why8by8.md");
        if (fs.existsSync(pathToWhy8by8)) {
          const why8by8 = fs.readFileSync(pathToWhy8by8, "utf-8");
          parsedPartnerData.why8by8 = why8by8;
        }

        return parsedPartnerData;
      } catch (e) {}
    }

    return null;
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
    const changeSet = this.readChangeSet();
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

    if (!partnerId || !(partnerId in changeSet.partners)) return;

    const pathToPartnerRewardsDirectory = path.join(
      this.pathToRewardsDirectory,
      partnerId
    );

    if (!fs.existsSync(pathToPartnerRewardsDirectory)) {
      if (partnerId in changeSet.partners) {
        delete changeSet.partners[partnerId].rewards;
        this.updateChangeSet(changeSet);
      }
    } else {
      const pathToPartnerRewardsDirectoryWithTrailingSep =
        pathToPartnerRewardsDirectory + path.sep;

      indexOfNextSeparator = filepath.indexOf(
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

      if (!rewardId) return;

      const pathToRewardDirectory = path.join(
        pathToPartnerRewardsDirectory,
        rewardId
      );

      const partnerChangeSet = changeSet.partners[partnerId];
      const rewardData = this.readRewardData(pathToRewardDirectory);

      if (rewardData) {
        if (!("rewards" in partnerChangeSet)) {
          partnerChangeSet.rewards = {};
        }
        const rewardHash = this.hashEntity(rewardData);
        partnerChangeSet.rewards[rewardId] = rewardHash;
      } else if ("rewards" in partnerChangeSet) {
        delete partnerChangeSet.rewards[rewardId];
      }

      this.updateChangeSet(changeSet);
    }
  }

  private readRewardData(pathToRewardDirectory: string) {
    const pathToRewardData = path.join(pathToRewardDirectory, "data.ts");

    if (fs.existsSync(pathToRewardData)) {
      try {
        delete require.cache[require.resolve(pathToRewardData)];
        const { default: rawRewardData } = require(pathToRewardData);
        const parsedRewardData = this.rewardDataSchema.parse(
          rawRewardData
        ) as Partial<IReward>;

        const pathToLongDescription = path.join(
          pathToRewardDirectory,
          "long-description.md"
        );
        if (fs.existsSync(pathToLongDescription)) {
          const longDescription = fs.readFileSync(
            pathToLongDescription,
            "utf-8"
          );
          parsedRewardData.longDescription = longDescription;
        }

        return parsedRewardData;
      } catch (e) {}
    }

    return null;
  }

  private readChangeSet() {
    const changeSetFileContents = fs.readFileSync(
      this.pathToChangeSet,
      "utf-8"
    );
    const changeSet = JSON.parse(changeSetFileContents);
    return changeSet;
  }

  private updateChangeSet(changeSet: object) {
    const stringifiedChangeSet = JSON.stringify(changeSet, null, 2);
    fs.writeFileSync(this.pathToChangeSet, stringifiedChangeSet, "utf-8");
  }

  private hashEntity(entity: object) {
    const stringified = JSON.stringify(entity);
    const hashed = this.hashString(stringified);
    return hashed;
  }

  private hashString(str: string) {
    const hash = crypto.createHash("sha1");
    const hashed = hash.update(str).digest("base64");
    return hashed;
  }
}
