import { z } from "zod";

export const changeSetSchema = z.object({
  partners: z.record(
    z.string(),
    z.object({
      hash: z.string(),
      locationsHash: z.string().optional(),
      rewards: z.record(z.string(), z.string()).optional(),
    })
  ),
});
