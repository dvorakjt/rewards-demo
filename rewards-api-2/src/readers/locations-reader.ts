import fs from "fs";
import path from "node:path";
import { streamPointsFromFile } from "../util/stream-points-from-file";
import { PartnerDefinitionFiles } from "../constants/partner-definition-files";
import type { ILocationsReader } from "../readers/i-locations-reader";
import type { IPointStream } from "../model/i-point-stream";

export class LocationsReader implements ILocationsReader {
  constructor(private readonly pathToPartners: string) {}

  partnerHasLocations(partnerId: string): boolean {
    const pathToLocationsFile = this.getPathToLocationsFiles(partnerId);
    const partnerHasLocations = fs.existsSync(pathToLocationsFile);
    return partnerHasLocations;
  }

  readLocationsCoordinates(partnerId: string): IPointStream {
    const pathToLocationsFile = this.getPathToLocationsFiles(partnerId);
    const coordinatesStream = streamPointsFromFile(pathToLocationsFile);
    return coordinatesStream;
  }

  private getPathToLocationsFiles(partnerId: string) {
    return path.join(
      this.pathToPartners,
      partnerId,
      PartnerDefinitionFiles.LocationsFile
    );
  }
}
