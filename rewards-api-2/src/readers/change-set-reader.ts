import fs from "fs";
import { z } from "zod";
import type { IChangeSetReader } from "./i-change-set-reader";
import { IChangeSet } from "../model/i-changeset";

export class ChangeSetReader implements IChangeSetReader {
  private readonly changeSet: IChangeSet;

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

  constructor(pathToChangeSet: string) {
    this.changeSet = this.readChangeSet(pathToChangeSet);
  }

  public readPartnerIds(): string[] {
    return Object.keys(this.changeSet.partners);
  }

  public readPartnerLastModifiedAt(partnerId: string): Date {
    const lastModifiedAtDateStr =
      this.changeSet.partners[partnerId].lastModifiedAt;
    const partnerLastModifiedAt = new Date(lastModifiedAtDateStr);
    return partnerLastModifiedAt;
  }

  public readPartnerLocationsLastModifiedAt(partnerId: string): Date {
    const lastModifiedAtDateStr =
      this.changeSet.partners[partnerId].locationsLastModifiedAt;
    const locationsLastModifiedAt = new Date(lastModifiedAtDateStr);
    return locationsLastModifiedAt;
  }

  public readRewardIds(): string[] {
    const rewardIds: string[] = [];

    for (const { rewards } of Object.values(this.changeSet.partners)) {
      rewardIds.push(...Object.keys(rewards));
    }

    return rewardIds;
  }

  public readRewardIdsGroupedByPartnerId(): Record<string, string[]> {
    const rewardIdsGroupedByPartnerId: Record<string, string[]> = {};

    for (const partnerId of this.readPartnerIds()) {
      const partnerRewardIds = Object.keys(
        this.changeSet.partners[partnerId].rewards
      );
      rewardIdsGroupedByPartnerId[partnerId] = partnerRewardIds;
    }

    return rewardIdsGroupedByPartnerId;
  }

  public readRewardLastModifiedAt(rewardId: string): Date {
    const rewardIdsGroupedByPartnerId = this.readRewardIdsGroupedByPartnerId();

    for (const [partnerId, rewardIds] of Object.entries(
      rewardIdsGroupedByPartnerId
    )) {
      for (const id of rewardIds) {
        if (id === rewardId) {
          const lastModifiedAtDateStr =
            this.changeSet.partners[partnerId].rewards[rewardId].lastModifiedAt;
          const lastModifiedAt = new Date(lastModifiedAtDateStr);
          return lastModifiedAt;
        }
      }
    }

    throw new Error(
      "No reward with the provided ID was found in the changeset."
    );
  }

  private readChangeSet(pathToChangeSet: string): IChangeSet {
    const changeSetFileContents = fs.readFileSync(pathToChangeSet, "utf-8");
    const changeSet = JSON.parse(changeSetFileContents);
    const validatedChangeSet = this.changeSetSchema.parse(changeSet);
    return validatedChangeSet;
  }
}
