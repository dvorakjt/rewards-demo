import { Type } from "@mikro-orm/core";
import type { IPoint } from "../../model/i-point";

/**
 * A class that converts points from their format within the database into
 * instances of {@link IPoint} and vice versa.
 *
 * @remarks
 * It is important to note that when represented as Well-Known Text (WKT), the
 * format used by the database for representing points as text, longitude comes
 * before latitude.
 */
export class PointType extends Type<IPoint, string> {
  /**
   * The Spatial Reference Identifier for latitude and longitude coordinates.
   */
  private static readonly SRID = 4326;

  convertToDatabaseValue(value: IPoint): string {
    return `point(${value.longitude} ${value.latitude})`;
  }

  convertToJSValue(value: string): IPoint {
    const m = value.match(/point\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)/i)!;
    return {
      longitude: Number(m[1]),
      latitude: Number(m[3]),
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
