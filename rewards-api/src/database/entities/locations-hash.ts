import { Entity, PrimaryKey, Property, TextType } from "@mikro-orm/core";

@Entity({ tableName: "locations_hashes" })
export class LocationsHash {
  @PrimaryKey()
  id!: number;

  @Property()
  partnerId!: string;

  @Property({ type: TextType })
  hash!: string;
}
