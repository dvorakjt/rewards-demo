import { IReward } from "./i-reward";

export type IRewardData = Omit<
  IReward,
  "id" | "partnerId" | "longDescription" | "hash"
>;
