import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { PartnerDefinitionFiles } from "../constants/partner-definition-files";
import type { IPartner } from "../model/i-partner";

const partnerDataSchema = z.object({
  name: z.string(),
  website: z.string().optional(),
});

export function readPartnerData(
  pathToPartnerDirectory: string
): Omit<IPartner, "id" | "hash"> | null {
  const pathToPartnerData = path.join(
    pathToPartnerDirectory,
    PartnerDefinitionFiles.DataFile
  );

  const pathToPartnerDescription = path.join(
    pathToPartnerDirectory,
    PartnerDefinitionFiles.DescriptionFile
  );

  if (
    fs.existsSync(pathToPartnerData) &&
    fs.existsSync(pathToPartnerDescription)
  ) {
    try {
      delete require.cache[require.resolve(pathToPartnerData)];
      const { default: rawPartnerData } = require(pathToPartnerData);
      const parsedPartnerData = partnerDataSchema.parse(rawPartnerData) as Omit<
        IPartner,
        "id" | "hash"
      >;

      const description = fs.readFileSync(pathToPartnerDescription, "utf-8");
      parsedPartnerData.description = description;

      const pathToWhy8by8 = path.join(
        pathToPartnerDirectory,
        PartnerDefinitionFiles.Why8By8File
      );
      if (fs.existsSync(pathToWhy8by8)) {
        const why8by8 = fs.readFileSync(pathToWhy8by8, "utf-8");
        parsedPartnerData.why8by8 = why8by8;
      }

      return parsedPartnerData;
    } catch (e) {}
  }

  return null;
}
