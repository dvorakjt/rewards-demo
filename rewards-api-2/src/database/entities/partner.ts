import { Entity, PrimaryKey, Property, TextType } from "@mikro-orm/postgresql";

@Entity({ tableName: "partners" })
export class Partner {
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

  @Property()
  lastModifiedAt!: Date;
}
