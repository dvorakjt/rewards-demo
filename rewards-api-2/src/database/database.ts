import "dotenv/config";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Partner } from "./entities/partner";
import { Location } from "./entities/location";
import { Reward } from "./entities/reward";
import { ContextualizedReward } from "./entities/contextualized-reward";

const orm = MikroORM.initSync({
  entities: [Partner, Location, Reward, ContextualizedReward],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  driver: PostgreSqlDriver,
  allowGlobalContext: true,
  forceUndefined: true,
});

export const database = {
  orm,
  entityManager: orm.em,
};
