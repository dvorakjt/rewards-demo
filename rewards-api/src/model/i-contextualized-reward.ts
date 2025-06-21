import { RedemptionForum } from "./redemption-forum";
import type { IPoint } from "./i-point";

export interface IContextualizedReward {
  /**
   * A UUID, unique to each reward.
   */
  id: string;
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
  /**
   * The id of the partner offering this reward.
   */
  partnerId: string;
  /**
   * The name of the partner offering this reward.
   */
  partnerName: string;
  /**
   * The description of the partner offering this reward.
   */
  partnerDescription: string;
  /**
   * The website of the partner offering this reward. Optional.
   */
  partnerWebsite?: string;
  /**
   * A description of why the partner offering this reward supports the 8by8
   * cause. Optional.
   */
  partnerWhy8by8?: string;
  /**
   * The geographic coordinates of the nearest location (relative to the user's
   * location) that belongs to the partner offering this reward.
   *
   * May be undefined if the user's location is null (such as if they did not
   * agree to share location information) or if the partner has no physical
   * locations.
   */
  nearestLocationCoordinates?: IPoint;
  /**
   * The distance in meters from the user's location to the nearest location
   * belonging to the partner who is offering this reward.
   *
   * May be undefined if the user's location is null (such as if they did not
   * agree to share location information) or if the partner has no physical
   * locations.
   */
  distanceToNearestLocation?: number;
}
