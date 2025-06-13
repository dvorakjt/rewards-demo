import { RedemptionMethods } from "../constants/redemption-methods";

export type RedemptionMethod =
  (typeof RedemptionMethods)[keyof typeof RedemptionMethods];
