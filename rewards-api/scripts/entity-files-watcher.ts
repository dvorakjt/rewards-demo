import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { z } from "zod";
import { watch } from "./watch";
import type { IPartner } from "../src/model/i-partner";

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
    this.watchRewardsDirectory();
  }

  private watchPartnersDirectory() {
    watch(
      this.pathToPartnersDirectory,
      (eventType, sourcePath, destinationPath) => {
        const relativePath = sourcePath.slice(
          this.pathToPartnersDirectory.length
        );
        if (!relativePath) return;

        switch (eventType) {
          case "modified":
          case "moved":
          case "deleted":
            console.log(eventType, relativePath, typeof destinationPath);
        }
      }
    );

    function getPartnerIdFromFileName(filename: string) {
      const separatorIndex = filename.indexOf(path.sep);
      if (separatorIndex > 0) {
        return filename.slice(0, separatorIndex);
      }

      return filename;
    }
  }

  private watchRewardsDirectory() {}

  // must discover rewards
  private readPartnerData(partnerId: string) {
    const pathToPartnerDirectory = path.join(
      this.pathToPartnersDirectory,
      partnerId
    );

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
        const { partnerData: rawPartnerData } = require(pathToPartnerData);
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

  private handlePartnerCreationOrUpdate(
    partnerId: string,
    partnerData: Partial<IPartner>
  ) {
    const changeSet = this.readChangeSet();
    const partnerDataHash = this.hashEntity(partnerData);
    changeSet.partners[partnerId] = {
      hash: partnerDataHash,
    };

    const pathToPartnerLocations = path.join(
      this.pathToPartnersDirectory,
      partnerId,
      "locations.csv"
    );

    if (fs.existsSync(pathToPartnerLocations)) {
      const locationsFileContents = fs.readFileSync(
        pathToPartnerLocations,
        "utf-8"
      );
      changeSet.partners[partnerId].locationsHash = this.hashString(
        locationsFileContents
      );
    }

    this.updateChangeSet(changeSet);
  }

  private handlePartnerRemoval(partnerId: string) {
    const changeSet = this.readChangeSet();
    delete changeSet.partners[partnerId];
    this.updateChangeSet(changeSet);
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
