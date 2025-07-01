import fs from "fs";
import { z } from "zod";
import type { IChangeSetReader } from "./i-changeset-reader";
import type { IChangeSetWriter } from "./i-changeset-writer";
import type { IChangeSet } from "../model/i-changeset";

export class ChangeSetReaderWriter
  implements IChangeSetReader, IChangeSetWriter
{
  private changeSetSchema = z.object({
    partners: z.record(
      z.string(),
      z.object({
        lastModifiedAt: z.string(),
        locationsLastModifiedAt: z.string(),
        rewards: z.record(
          z.string(),
          z.object({
            lastModifiedAt: z.string(),
          })
        ),
      })
    ),
  });

  constructor(private pathToChangeSet: string) {}

  public readPartnerIds(): string[] {
    const changeSet = this.readChangeSet();
    return Object.keys(changeSet.partners);
  }

  public hasPartner(partnerId: string): boolean {
    const changeSet = this.readChangeSet();
    return partnerId in changeSet.partners;
  }

  public readPartnerLastModifiedAt(partnerId: string): Date {
    const changeSet = this.readChangeSet();
    const lastModifiedAtDateStr = changeSet.partners[partnerId].lastModifiedAt;
    const partnerLastModifiedAt = new Date(lastModifiedAtDateStr);
    return partnerLastModifiedAt;
  }

  public readPartnerLocationsLastModifiedAt(partnerId: string): Date {
    const changeSet = this.readChangeSet();
    const lastModifiedAtDateStr =
      changeSet.partners[partnerId].locationsLastModifiedAt;
    const locationsLastModifiedAt = new Date(lastModifiedAtDateStr);
    return locationsLastModifiedAt;
  }

  public readRewardIds(): string[] {
    const changeSet = this.readChangeSet();
    const rewardIds: string[] = [];

    for (const { rewards } of Object.values(changeSet.partners)) {
      rewardIds.push(...Object.keys(rewards));
    }

    return rewardIds;
  }

  public readRewardIdsGroupedByPartnerId(): Record<string, string[]> {
    const changeSet = this.readChangeSet();
    const rewardIdsGroupedByPartnerId: Record<string, string[]> = {};

    for (const partnerId of this.readPartnerIds()) {
      const partnerRewardIds = Object.keys(
        changeSet.partners[partnerId].rewards
      );
      rewardIdsGroupedByPartnerId[partnerId] = partnerRewardIds;
    }

    return rewardIdsGroupedByPartnerId;
  }

  public readRewardLastModifiedAt(rewardId: string): Date {
    const changeSet = this.readChangeSet();
    const rewardIdsGroupedByPartnerId = this.readRewardIdsGroupedByPartnerId();

    for (const [partnerId, rewardIds] of Object.entries(
      rewardIdsGroupedByPartnerId
    )) {
      for (const id of rewardIds) {
        if (id === rewardId) {
          const lastModifiedAtDateStr =
            changeSet.partners[partnerId].rewards[rewardId].lastModifiedAt;
          const lastModifiedAt = new Date(lastModifiedAtDateStr);
          return lastModifiedAt;
        }
      }
    }

    throw new Error(
      "No reward with the provided ID was found in the changeset."
    );
  }

  public recordNewPartner(partnerId: string, lastModifiedAt: Date): void {
    const lastModifiedAtString = lastModifiedAt.toISOString();

    const partner: IChangeSet["partners"][string] = {
      locationsLastModifiedAt: lastModifiedAtString,
      lastModifiedAt: lastModifiedAtString,
      rewards: {},
    };

    const changeSet = this.readChangeSet();
    changeSet.partners[partnerId] = partner;
    this.writeChangeSet(changeSet);
  }

  public updatePartnerLastModifiedAt(
    partnerId: string,
    lastModifiedAt: Date
  ): void {
    const changeSet = this.readChangeSet();
    const lastModifiedAtString = lastModifiedAt.toISOString();
    changeSet.partners[partnerId].lastModifiedAt = lastModifiedAtString;
    this.writeChangeSet(changeSet);
  }

  public updatePartnerLocationsLastModifiedAt(
    partnerId: string,
    lastModifiedAt: Date
  ): void {
    const changeSet = this.readChangeSet();
    const lastModifiedAtString = lastModifiedAt.toISOString();
    changeSet.partners[partnerId].locationsLastModifiedAt =
      lastModifiedAtString;
    this.writeChangeSet(changeSet);
  }

  public removePartner(partnerId: string): void {
    const changeSet = this.readChangeSet();
    delete changeSet.partners[partnerId];
    this.writeChangeSet(changeSet);
  }

  public recordOrUpdateReward(
    partnerId: string,
    rewardId: string,
    lastModifiedAt: Date
  ): void {
    const lastModifiedAtString = lastModifiedAt.toISOString();
    const changeSet = this.readChangeSet();
    changeSet.partners[partnerId].rewards[rewardId] = {
      lastModifiedAt: lastModifiedAtString,
    };
    this.writeChangeSet(changeSet);
  }

  public removeReward(partnerId: string, rewardId: string): void {
    const changeSet = this.readChangeSet();
    delete changeSet.partners[partnerId].rewards[rewardId];
    this.writeChangeSet(changeSet);
  }

  public removeAllPartnerRewards(partnerId: string): void {
    const changeSet = this.readChangeSet();
    changeSet.partners[partnerId].rewards = {};
    this.writeChangeSet(changeSet);
  }

  private readChangeSet(): IChangeSet {
    const changeSetFileContents = fs.readFileSync(
      this.pathToChangeSet,
      "utf-8"
    );
    const changeSet = JSON.parse(changeSetFileContents);
    const validatedChangeSet = this.changeSetSchema.parse(changeSet);
    return validatedChangeSet;
  }

  private writeChangeSet(changeSet: IChangeSet) {
    const stringified = JSON.stringify(changeSet, null, 2);
    fs.writeFileSync(this.pathToChangeSet, stringified, { encoding: "utf-8" });
  }
}
