export interface IChangeSetWriter {
  recordNewPartner(partnerId: string, lastModifiedAt: Date): void;
  updatePartnerLastModifiedAt(partnerId: string, lastModifiedAt: Date): void;
  updatePartnerLocationsLastModifiedAt(
    partnerId: string,
    lastModifiedAt: Date
  ): void;
  removePartner(partnerId: string): void;
  recordOrUpdateReward(
    partnerId: string,
    rewardId: string,
    lastModifiedAt: Date
  ): void;
  removeReward(partnerId: string, rewardId: string): void;
  removeAllPartnerRewards(partnerId: string): void;
}
