import type { IReward } from "../model/i-reward";

export interface IRewardReader {
  rewardHasRequiredData(partnerId: string, rewardId: string): boolean;
  readPartnerRewardIds(partnerId: string): string[];
  readRewardData(
    partnerId: string,
    rewardId: string
  ): Omit<IReward, "id" | "partnerId" | "lastModifiedAt">;
}
