import type { RedemptionForums } from "../constants/redemption-forums";

export type RedemptionForum =
  (typeof RedemptionForums)[keyof typeof RedemptionForums];
