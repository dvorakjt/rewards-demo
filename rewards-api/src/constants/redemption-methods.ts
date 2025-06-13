import { valuesToEnum } from "../util/values-to-enum";
import { redemptionMethods } from "../db/schema";

export const RedemptionMethods = valuesToEnum(redemptionMethods.enumValues);
