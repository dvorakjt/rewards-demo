CREATE TYPE "public"."redemption_forums" AS ENUM('online', 'in-store');--> statement-breakpoint
CREATE TYPE "public"."redemption_methods" AS ENUM('text-code', 'qr-code', 'link', 'manual');--> statement-breakpoint
CREATE TABLE "partner_locations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "partner_locations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"partner_id" varchar(255) NOT NULL,
	"coordinates" geometry(point)
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"why_8by8" text,
	"website" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "redemption_instructions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "redemption_instructions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reward_id" uuid NOT NULL,
	"redemption_method" "redemption_methods" NOT NULL,
	"instructions" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"partner_id" varchar(255) NOT NULL,
	"short_description" varchar(255) NOT NULL,
	"redemption_forums" "redemption_forums"[] NOT NULL,
	"redemption_methods" "redemption_methods"[] NOT NULL,
	"long_description" text,
	"terms_and_conditions_link" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "redemption_instructions" ADD CONSTRAINT "redemption_instructions_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE cascade;