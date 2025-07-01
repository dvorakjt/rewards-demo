export interface IChangeSetReader {
  readPartnerIds(): string[];
  hasPartner(partnerId: string): boolean;
  readPartnerLastModifiedAt(partnerId: string): Date;
  readPartnerLocationsLastModifiedAt(partnerId: string): Date;
  readRewardIds(): string[];
  readRewardIdsGroupedByPartnerId(): Record<string, string[]>;
  readRewardLastModifiedAt(rewardId: string): Date;
}
