import type { IReward } from "../model/i-reward";
import type { ClaimReward } from "../model/claim-reward";

export interface IRewardReader {
  rewardHasRequiredData(rewardId: string): boolean;
  readPartnerRewardIds(partnerId: string): string[];
  readRewardData(rewardId: string): Omit<IReward, "id" | "lastModifiedAt">;
  readClaimMethod(rewardId: string): ClaimReward;
}
