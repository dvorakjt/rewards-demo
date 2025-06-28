import { Entity, PrimaryKey, Property, TextType } from "@mikro-orm/postgresql";
import type { IPartner } from "../../model/i-partner";

@Entity({ tableName: "partners" })
export class Partner implements IPartner {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property({ type: TextType })
  description!: string;

  @Property({ nullable: true })
  website?: string;

  @Property({ type: TextType, nullable: true })
  why8by8?: string;

  @Property({ type: TextType })
  hash!: string;
}
