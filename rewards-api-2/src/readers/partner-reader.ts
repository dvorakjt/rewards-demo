import fs from "fs";
import path from "node:path";
import { PartnerDefinitionFiles } from "../constants/partner-definition-files";
import { z } from "zod";
import type { IPartnerReader } from "./i-partner-reader";
import type { IPartner } from "../model/i-partner";

export class PartnerReader implements IPartnerReader {
  private partnerDataSchema = z.object({
    name: z.string(),
    website: z.string().optional(),
  });

  constructor(private readonly pathToPartners: string) {}

  partnerHasRequiredData(partnerId: string): boolean {
    const pathToPartnerDataFile = this.getPathToPartnerDataFile(partnerId);
    const pathToPartnerDescriptionFile =
      this.getPathToPartnerDescriptionFile(partnerId);

    if (
      fs.existsSync(pathToPartnerDataFile) &&
      fs.existsSync(pathToPartnerDescriptionFile)
    ) {
      delete require.cache[require.resolve(pathToPartnerDataFile)];
      const data = require(pathToPartnerDataFile).default;
      const isDataValid = this.partnerDataSchema.safeParse(data).success;
      return isDataValid;
    }

    return false;
  }

  readPartnerData(partnerId: string): Omit<IPartner, "id" | "lastModifiedAt"> {
    const pathToPartnerDataFile = this.getPathToPartnerDataFile(partnerId);
    delete require.cache[require.resolve(pathToPartnerDataFile)];
    const data = require(pathToPartnerDataFile).default;
    const parsedData = this.partnerDataSchema.parse(data);

    const pathToPartnerDescriptionFile =
      this.getPathToPartnerDescriptionFile(partnerId);
    const description = fs.readFileSync(pathToPartnerDescriptionFile, "utf-8");

    const partnerData: Omit<IPartner, "id" | "lastModifiedAt"> = {
      ...parsedData,
      description,
    };

    const pathToPartnerWhy8by8 = this.getPathToPartnerWhy8by8(partnerId);
    if (fs.existsSync(pathToPartnerWhy8by8)) {
      const why8by8 = fs.readFileSync(pathToPartnerWhy8by8, "utf-8");
      partnerData.why8by8 = why8by8;
    }

    return partnerData;
  }

  private getPathToPartnerDataFile(partnerId: string) {
    return this.getPathToPartnerFile(
      partnerId,
      PartnerDefinitionFiles.DataFile
    );
  }

  private getPathToPartnerDescriptionFile(partnerId: string) {
    return this.getPathToPartnerFile(
      partnerId,
      PartnerDefinitionFiles.DescriptionFile
    );
  }

  private getPathToPartnerWhy8by8(partnerId: string) {
    return this.getPathToPartnerFile(
      partnerId,
      PartnerDefinitionFiles.Why8By8File
    );
  }

  private getPathToPartnerFile(
    partnerId: string,
    file: PartnerDefinitionFiles
  ) {
    return path.join(this.pathToPartners, partnerId, file);
  }
}
