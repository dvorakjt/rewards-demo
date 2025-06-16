import { db } from "./database/db";
import { IPoint } from "./model/i-point";
import { Location } from "./database/entities/location";
import { Reward } from "./database/entities/reward";

trySelect();

async function trySelect() {
  const locations = await db.em.findAll(Reward);
  console.log(locations);
  db.orm.close();
}
