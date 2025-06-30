export interface IChangeSetReader {
  readPartnerIds(): string[];
  readPartnerLastModifiedAt(partnerId: string): Date;
  readPartnerLocationsLastModifiedAt(partnerId: string): Date;
  readRewardIds(): string[];
  readRewardIdsGroupedByPartnerId(): Record<string, string[]>;
  readRewardLastModifiedAt(rewardId: string): Date;
}
