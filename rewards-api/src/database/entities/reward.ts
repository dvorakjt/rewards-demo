import { Entity, PrimaryKey, Property, UuidType, Enum } from "@mikro-orm/core";
import { RedemptionForum } from "../../model/redemption-forum";
import type { IReward } from "../../model/i-reward";

@Entity({ tableName: "rewards" })
export class Reward implements IReward {
  @PrimaryKey({ type: UuidType })
  id!: string;

  @Property()
  partnerId!: string;

  @Property()
  shortDescription!: string;

  @Enum({ items: () => RedemptionForum, array: true })
  redemptionForums!: RedemptionForum[];

  @Property()
  longDescription?: string;

  @Property()
  hash!: string;
}
