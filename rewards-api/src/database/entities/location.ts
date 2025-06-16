import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { PointType } from "../types/point-type";
import { IPoint } from "../../model/i-point";
import type { ILocation } from "../../model/i-location";

@Entity({ tableName: "locations" })
export class Location implements ILocation {
  @PrimaryKey()
  id!: number;

  @Property()
  partnerId!: string;

  @Property({ type: PointType })
  coordinates!: IPoint;
}
