import { Entity, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { IPartner } from "../../model/i-partner";

@Entity({ tableName: "partners" })
export class Partner implements IPartner {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property()
  website?: string;

  @Property()
  why8by8?: string;

  @Property()
  hash!: string;
}
