import {
  Entity,
  PrimaryKey,
  Property,
  UuidType,
  Enum,
  TextType,
} from "@mikro-orm/core";
import { PointType } from "../types/point-type";
import { RedemptionForum } from "../../constants/redemption-forum";
import type { IPoint } from "../../model/i-point";

@Entity()
export class ContextualizedReward {
  @PrimaryKey({ type: UuidType })
  id!: string;

  @Property()
  shortDescription!: string;

  @Enum({ items: () => RedemptionForum, array: true })
  redemptionForums!: RedemptionForum[];

  @Property({ type: TextType, nullable: true })
  longDescription?: string;

  @Property({ nullable: true })
  expirationDate?: Date;

  @Property()
  partnerId!: string;

  @Property()
  partnerName!: string;

  @Property({ type: TextType })
  partnerDescription!: string;

  @Property({ nullable: true })
  partnerWebsite?: string;

  @Property({ type: TextType, nullable: true })
  partnerWhy8by8?: string;

  @Property({ type: PointType, nullable: true })
  nearestLocationCoordinates?: IPoint;

  @Property({ nullable: true })
  distanceToNearestLocation?: number;
}
