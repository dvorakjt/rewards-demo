import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { RedemptionForum } from "../model/redemption-forum";
import { RewardDefinitionFiles } from "../constants/reward-definition-files";
import type { IReward } from "../model/i-reward";

const rewardDataSchema = z.object({
  shortDescription: z.string(),
  redemptionForums: z.array(z.nativeEnum(RedemptionForum)),
  expirationDate: z.date().optional(),
});

export function readRewardData(pathToRewardDirectory: string) {
  const pathToRewardData = path.join(
    pathToRewardDirectory,
    RewardDefinitionFiles.DataFile
  );

  if (fs.existsSync(pathToRewardData)) {
    try {
      delete require.cache[require.resolve(pathToRewardData)];
      const { default: rawRewardData } = require(pathToRewardData);
      const parsedRewardData = rewardDataSchema.parse(
        rawRewardData
      ) as Partial<IReward>;

      const pathToLongDescription = path.join(
        pathToRewardDirectory,
        RewardDefinitionFiles.LongDescriptionFile
      );
      if (fs.existsSync(pathToLongDescription)) {
        const longDescription = fs.readFileSync(pathToLongDescription, "utf-8");
        parsedRewardData.longDescription = longDescription;
      }

      return parsedRewardData;
    } catch (e) {}
  }

  return null;
}
