import { db } from "./database/db";
import { Location } from "./database/entities/location";
import { IPoint } from "./model/i-point";
import { ContextualizedReward } from "./database/entities/contextualized-reward";

async function tryQuery({ latitude, longitude }: IPoint) {
  const oneLocation = await db.em.findOne(Location, { id: 1 });
  console.log(oneLocation);

  const results = await db.em.execute(
    `SELECT * FROM get_contextualized_rewards(
      'all',
      null,
      'a-z',
      ${longitude}, 
      ${latitude},
      ${8000},
      FALSE,
      null
    )`
  );

  console.log(results);

  const mappedResults = results.map((result) =>
    db.em.map(ContextualizedReward, result)
  );

  console.log(mappedResults);
}
