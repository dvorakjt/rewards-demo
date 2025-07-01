import "dotenv/config";
import fs from "fs";
import path from "path";
import express, { Request, Response } from "express";
import { z } from "zod";
import { RewardReader } from "./io/reward-reader";
import { connectToDatabase } from "./database/connect-to-database";
import { ContextualizedReward } from "./database/entities/contextualized-reward";
import { RedemptionForumFilter } from "./constants/redemption-forum-filter";
import { SortOrder } from "./constants/sort-order";

const db = connectToDatabase();
const app = express();
const port = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, "../public")));

app.get("/rewards", async (req, res) => {
  const maybeString = z
    .string()
    .optional()
    .transform((v) => (typeof v === "string" ? v : null));

  const maybeNumberLikeString = z
    .string()
    .optional()
    .transform((v) => {
      if (typeof v === "string") {
        const asNumber = Number(v);
        if (!isNaN(asNumber)) {
          return asNumber;
        }
      }

      return null;
    });

  const maybeIntegerLikeString = z
    .string()
    .optional()
    .transform((v) => {
      if (typeof v === "string") {
        const asInteger = parseInt(v);
        if (!isNaN(asInteger)) {
          return asInteger;
        }
      }

      return null;
    });

  const queryParamsSchema = z.object({
    filter: z
      .nativeEnum(RedemptionForumFilter)
      .catch(RedemptionForumFilter.All),
    sortOrder: z.nativeEnum(SortOrder).catch(SortOrder.AtoZ),
    lat: maybeNumberLikeString,
    lng: maybeNumberLikeString,
    partnerNameToStartAfter: maybeString,
    rewardIdToStartAfter: maybeString,
    maxDistance: maybeNumberLikeString,
    ignoreMaxDistanceForOnlineRewards: z
      .string()
      .optional()
      .transform((v) => {
        return typeof v === "string" ? true : false;
      }),
    maxNumResults: maybeIntegerLikeString,
  });

  const params = queryParamsSchema.parse(req.query);
  const cursor_position =
    !!params.partnerNameToStartAfter && !!params.rewardIdToStartAfter
      ? [params.partnerNameToStartAfter, params.rewardIdToStartAfter]
      : null;

  // could parameterize this with a custom type for cursor_position, for
  // now this will have to do
  const results = await db.entityManager.execute(
    `SELECT * FROM get_contextualized_rewards(
      redemption_forum_filter => ${asSQLStr(params.filter)},
      cursor_position => ${
        cursor_position
          ? `(${asSQLStr(cursor_position[0])}, ${asSQLStr(cursor_position[1])})`
          : cursor_position
      },
      sort_order => ${asSQLStr(params.sortOrder)},
      latitude => ${params.lat},
      longitude => ${params.lng},
      max_distance => ${params.maxDistance ?? asSQLStr("infinity")},
      ignore_max_distance_for_online_rewards => ${
        params.ignoreMaxDistanceForOnlineRewards
      },
      max_num_results => ${params.maxNumResults}
    )`
  );

  const baseLogoPath = req.protocol + "://" + req.get("host") + "/logos";

  // need to add base logo path
  const mappedResults = results.map((result) => {
    // find the logo file
    const logoFiles = fs.readdirSync(path.join(__dirname, "../public/logos"));

    const logoFile = logoFiles.find((filename) =>
      new RegExp(`^${result.partner_id}\\.[a-z]+$`).test(filename)
    );

    return {
      pathToLogo: logoFile ? baseLogoPath + "/" + logoFile : "",
      ...db.entityManager.map(ContextualizedReward, result),
    };
  });

  // const allowedOrigins = readAllowedOrigins();

  // for (const origin of allowedOrigins) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  res.status(200).json(mappedResults);
});

app.get("/claim/:rewardId", async (req: Request, res: Response) => {
  // const allowedOrigins = readAllowedOrigins();

  // for (const origin of allowedOrigins) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const id = req.params.rewardId;
  const pathToRewards = path.join(__dirname, "rewards");
  const rewardReader = new RewardReader(pathToRewards);

  try {
    const claim = rewardReader.readClaimMethod(id);
    const vouchers = await claim();
    res.status(200).json({
      vouchers,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Rewards API listening on port ${port}`);
});

function asSQLStr(str: string) {
  return `'${str}'`;
}
