import type { IReward } from "./i-reward";
import type { IPoint } from "./i-point";

export interface IContextualizedReward extends Omit<IReward, "hash"> {
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
