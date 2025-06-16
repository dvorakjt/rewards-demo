import { Type } from "@mikro-orm/core";
import type { IPoint } from "../../model/i-point";

export class PointType extends Type<IPoint, string> {
  /**
   * The Spatial Reference Identifier for latitude and longitude coordinates.
   */
  private static readonly SRID = 4326;

  convertToDatabaseValue(value: IPoint): string {
    return `point(${value.latitude} ${value.longitude})`;
  }

  convertToJSValue(value: string): IPoint {
    const m = value.match(/point\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)/i)!;
    return {
      latitude: Number(m[1]),
      longitude: Number(m[3]),
    };
  }

  convertToJSValueSQL(key: string) {
    return `ST_AsText(${key})`;
  }

  convertToDatabaseValueSQL(key: string) {
    return `ST_PointFromText(${key}, ${PointType.SRID})`;
  }

  getColumnType(): string {
    return `geometry(Point, ${PointType.SRID})`;
  }
}
