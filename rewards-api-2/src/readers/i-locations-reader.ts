import { IPointStream } from "../model/i-point-stream";

export interface ILocationsReader {
  partnerHasLocations(partnerId: string): boolean;
  readLocationsCoordinates(partnerId: string): IPointStream;
}
