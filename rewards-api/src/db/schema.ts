import {
  pgTable,
  varchar,
  text,
  uuid,
  geometry,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { LAT_LNG_SRID } from "../constants/lat-lng-srid";

export const partnersTable = pgTable("partners", {
  id: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  why8by8: text("why_8by8"),
  website: varchar({ length: 255 }),
});

export const partnerLocationsTable = pgTable("partner_locations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  partnerId: varchar("partner_id", { length: 255 })
    .notNull()
    .references(() => partnersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  /*
    The config object passed to `geometry()` can contain an `srid` property for 
    setting the SRID of the resultant geometry type, but at the time of writing, 
    there is a bug in Drizzle that causes the SRID to be ignored. A custom 
    migration has been created to address this issue.
  */
  coordinates: geometry({ type: "point" }),
});

export const redemptionMethods = pgEnum("redemption_methods", [
  "text-code",
  "qr-code",
  "link",
  "manual",
]);

export const redemptionForums = pgEnum("redemption_forums", [
  "online",
  "in-store",
]);

export const rewardsTable = pgTable("rewards", {
  id: uuid().primaryKey(),
  partner_id: varchar({ length: 255 })
    .notNull()
    .references(() => partnersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  shortDescription: varchar("short_description", { length: 255 }).notNull(),
  redemptionForums: redemptionForums("redemption_forums").array().notNull(),
  redemptionMethods: redemptionMethods("redemption_methods").array().notNull(),
  longDescription: text("long_description"),
  termsAndConditionsLink: varchar("terms_and_conditions_link", { length: 255 }),
});

export const redemptionInstructionsTable = pgTable("redemption_instructions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reward_id: uuid()
    .notNull()
    .references(() => rewardsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  redemptionMethod: redemptionMethods("redemption_method").notNull(),
  instructions: text().notNull(),
});
