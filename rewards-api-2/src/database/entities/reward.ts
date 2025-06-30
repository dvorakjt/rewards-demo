import {
  Entity,
  PrimaryKey,
  Property,
  UuidType,
  Enum,
  TextType,
} from "@mikro-orm/core";
import { RedemptionForum } from "../../constants/redemption-forum";

@Entity({ tableName: "rewards" })
export class Reward {
  @PrimaryKey({ type: UuidType })
  id!: string;

  @Property()
  partnerId!: string;

  @Property()
  shortDescription!: string;

  @Enum({ items: () => RedemptionForum, array: true })
  redemptionForums!: RedemptionForum[];

  @Property({ type: TextType, nullable: true })
  longDescription?: string;

  @Property({ nullable: true })
  expirationDate?: Date;

  @Property()
  lastModifiedAt!: Date;
}
