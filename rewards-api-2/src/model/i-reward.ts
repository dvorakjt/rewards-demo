import type { RedemptionForum } from "../constants/redemption-forum";

export interface IReward {
  /**
   * A UUID, unique to each reward.
   */
  id: string;
  /**
   * The id of the partner offering this reward.
   */
  partnerId: string;
  /**
   * A short description of the reward, e.g. "One Free Coffee"
   */
  shortDescription: string;
  /**
   * A list indicating whether the reward can be redeemed in-store, online,
   * or both.
   */
  redemptionForums: RedemptionForum[];
  /**
   * A more complete description of the reward, which could include details
   * such as terms and conditions, etc.
   */
  longDescription?: string;
  /**
   * The date from which the reward will no longer be offered. If undefined,
   * the reward will be available indefinitely, unless otherwise instructed by
   * the partner.
   */
  expirationDate?: Date;
  lastModifiedAt: Date;
}
