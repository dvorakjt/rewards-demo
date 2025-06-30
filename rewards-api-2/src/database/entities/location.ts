import { BigIntType, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { PointType } from "../types/point-type";
import { IPoint } from "../../model/i-point";

@Entity({ tableName: "locations" })
export class Location {
  @PrimaryKey({ type: BigIntType })
  id!: bigint;

  @Property()
  partnerId!: string;

  @Property({ type: PointType })
  coordinates!: IPoint;

  @Property()
  lastModifiedAt!: Date;
}
