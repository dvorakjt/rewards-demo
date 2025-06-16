import { Entity, PrimaryKey, Property, UuidType, Enum } from "@mikro-orm/core";
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

  @Property()
  longDescription?: string;

  @Property()
  partnerId!: string;

  @Property()
  partnerName!: string;

  @Property()
  partnerDescription!: string;

  @Property()
  partnerWebsite?: string;

  @Property()
  partnerWhy8by8?: string;

  @Property({ type: PointType })
  nearestPartnerLocation?: IPoint;
}
