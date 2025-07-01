import type { IReward } from "../model/i-reward";

export interface IRewardReader {
  rewardHasRequiredData(rewardId: string): boolean;
  readPartnerRewardIds(partnerId: string): string[];
  readRewardData(rewardId: string): Omit<IReward, "id" | "lastModifiedAt">;
}
