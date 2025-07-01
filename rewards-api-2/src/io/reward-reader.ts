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

  rewardHasRequiredData(rewardId: string): boolean {
    const pathToRewardDirectory = this.getPathToRewardDirectory(rewardId);
    const pathToRewardDataFile = path.join(
      pathToRewardDirectory,
      RewardDefinitionFiles.DataFile
    );

    if (fs.existsSync(pathToRewardDataFile)) {
      delete require.cache[require.resolve(pathToRewardDataFile)];
      const data = require(pathToRewardDataFile).default;
      const isDataValid = this.rewardDataSchema.safeParse(data).success;
      return isDataValid;
    }

    return false;
  }

  readPartnerRewardIds(partnerId: string): string[] {
    const pathToPartnerRewardsDirectory = path.join(
      this.pathToRewards,
      partnerId
    );
    if (fs.existsSync(pathToPartnerRewardsDirectory)) {
      const rewardIds = fs.readdirSync(pathToPartnerRewardsDirectory);
      return rewardIds;
    }

    return [];
  }

  readRewardData(rewardId: string): Omit<IReward, "id" | "lastModifiedAt"> {
    const partnerId = this.findOwningPartnerId(rewardId);
    const pathToRewardDirectory = path.join(
      this.pathToRewards,
      partnerId,
      rewardId
    );

    const pathToRewardDataFile = path.join(
      pathToRewardDirectory,
      RewardDefinitionFiles.DataFile
    );

    delete require.cache[require.resolve(pathToRewardDataFile)];
    const data = require(pathToRewardDataFile).default;
    const rewardData = {
      partnerId,
      ...this.rewardDataSchema.parse(data),
    } as Omit<IReward, "id" | "lastModifiedAt">;

    const pathToRewardLongDescription = path.join(
      pathToRewardDirectory,
      RewardDefinitionFiles.LongDescriptionFile
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

  private getPathToRewardDirectory(rewardId: string) {
    const owningPartnerId = this.findOwningPartnerId(rewardId);
    return path.join(this.pathToRewards, owningPartnerId, rewardId);
  }

  private findOwningPartnerId(rewardId: string) {
    const partnerIds = fs.readdirSync(this.pathToRewards);
    for (const partnerId of partnerIds) {
      const pathToPartnerDir = path.join(this.pathToRewards, partnerId);

      const partnerRewards = fs.readdirSync(pathToPartnerDir);

      if (partnerRewards.includes(rewardId)) {
        return partnerId;
      }
    }

    throw new Error("No partner owns this reward");
  }
}
