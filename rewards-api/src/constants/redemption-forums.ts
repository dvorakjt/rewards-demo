import { redemptionForums } from "../db/schema";
import { valuesToEnum } from "../util/values-to-enum";

export const RedemptionForums = valuesToEnum(redemptionForums.enumValues);
