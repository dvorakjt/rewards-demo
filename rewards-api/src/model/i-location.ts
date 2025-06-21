import type { IPoint } from "./i-point";

/**
 * Represents a physical location belonging to a partner.
 */
export interface ILocation {
  /**
   * A unique identifier for the location.
   */
  id: number;
  /**
   * The id of the partner to whom the location belongs.
   */
  partnerId: string;
  /**
   * The geographic coordinates of the location.
   */
  coordinates: IPoint;
}
