import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { z } from "zod";
import { watch } from "./watch";
import type { IPartner } from "../src/model/i-partner";

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
*/
export class EntityFilesWatcher {
  pathToPartnersDirectory = path.join(__dirname, "../src/partners");
  pathToRewardsDirectory = path.join(__dirname, "../src/rewards");
  pathToChangeSet = path.join(__dirname, "../changeset.json");
  partnerDataSchema = z.object({
    name: z.string(),
    website: z.string().optional(),
  });

  watchEntityFiles() {
    this.watchPartnersDirectory();
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
    } else {
      delete changeSet.partners[partnerId];
    }

    this.updateChangeSet(changeSet);
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
