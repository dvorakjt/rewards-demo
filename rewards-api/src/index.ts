import { db } from "./database/db";
import { IPoint } from "./model/i-point";
import { ContextualizedReward } from "./database/entities/contextualized-reward";

async function tryQuery({ latitude, longitude }: IPoint) {
  const results = await db.em.execute(
    `SELECT * FROM get_contextualized_rewards(
      redemption_forum_filter => 'all',
      cursor_position => null,
      sort_order => 'a-z',≈
      latitude => ${latitude}, 
      longitude => ${longitude},
      max_distance => 'infinity',
      ignore_max_distance_for_online_rewards => TRUE,
      max_num_results => null
    )`
  );

  console.log(results);

  const mappedResults = results.map((result) =>
    db.em.map(ContextualizedReward, result)
  );

  console.log(mappedResults);
}
