import fs from "fs";
import path from "node:path";
import { z } from "zod";
import { RewardDefinitionFiles } from "../constants/reward-definition-files";
import { RedemptionForum } from "../constants/redemption-forum";
import type { IRewardReader } from "./i-reward-reader";
import type { IReward } from "../model/i-reward";

export class RewardReader implements IRewardReader {
  private rewardDataSchema = z.object({
    shortDescription: z.string(),
    redemptionForums: z.array(z.nativeEnum(RedemptionForum)),
    expirationDate: z.date().optional(),
  });

  constructor(private readonly pathToRewards: string) {}

  rewardHasRequiredData(partnerId: string, rewardId: string): boolean {
    const pathToRewardDataFile = this.getPathToRewardDataFile(
      partnerId,
      rewardId
    );

    if (fs.existsSync(pathToRewardDataFile)) {
      delete require.cache[require.resolve(pathToRewardDataFile)];
      const data = require(pathToRewardDataFile).default;
      const isDataValid = this.rewardDataSchema.safeParse(data).success;
      return isDataValid;
    }

    return false;
  }

  readRewardData(
    partnerId: string,
    rewardId: string
  ): Omit<IReward, "id" | "partnerId" | "lastModifiedAt"> {
    const pathToRewardDataFile = this.getPathToRewardDataFile(
      partnerId,
      rewardId
    );
    delete require.cache[require.resolve(pathToRewardDataFile)];
    const data = require(pathToRewardDataFile).default;
    const rewardData = this.rewardDataSchema.parse(data) as Omit<
      IReward,
      "id" | "partnerId" | "lastModifiedAt"
    >;

    const pathToRewardLongDescription = this.getPathToRewardLongDescription(
      partnerId,
      rewardId
    );

    if (fs.existsSync(pathToRewardLongDescription)) {
      const longDescription = fs.readFileSync(
        pathToRewardLongDescription,
        "utf-8"
      );

      rewardData.longDescription = longDescription;
    }

    return rewardData;
  }

  private getPathToRewardDataFile(partnerId: string, rewardId: string) {
    return this.getPathToRewardFile(
      partnerId,
      rewardId,
      RewardDefinitionFiles.DataFile
    );
  }

  private getPathToRewardLongDescription(partnerId: string, rewardId: string) {
    return this.getPathToRewardFile(
      partnerId,
      rewardId,
      RewardDefinitionFiles.LongDescriptionFile
    );
  }

  private getPathToRewardFile(
    partnerId: string,
    rewardId: string,
    file: RewardDefinitionFiles
  ) {
    return path.join(this.pathToRewards, partnerId, rewardId, file);
  }
}
