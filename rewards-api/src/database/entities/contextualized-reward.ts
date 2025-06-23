import {
  Entity,
  PrimaryKey,
  Property,
  UuidType,
  Enum,
  TextType,
} from "@mikro-orm/core";
import { PointType } from "../types/point-type";
import { RedemptionForum } from "../../model/redemption-forum";
import type { IContextualizedReward } from "../../model/i-contextualized-reward";
import type { IPoint } from "../../model/i-point";

@Entity()
export class ContextualizedReward implements IContextualizedReward {
  @PrimaryKey({ type: UuidType })
  id!: string;

  @Property()
  shortDescription!: string;

  @Enum({ items: () => RedemptionForum, array: true })
  redemptionForums!: RedemptionForum[];

  @Property({ type: TextType })
  longDescription?: string;

  @Property()
  expirationDate?: Date;

  @Property()
  partnerId!: string;

  @Property()
  partnerName!: string;

  @Property({ type: TextType })
  partnerDescription!: string;

  @Property()
  partnerWebsite?: string;

  @Property({ type: TextType })
  partnerWhy8by8?: string;

  @Property({ type: PointType })
  nearestLocationCoordinates?: IPoint;

  @Property()
  distanceToNearestLocation?: number;
}
