import { IReward } from "./i-reward";

export type RewardData = Omit<
  IReward,
  "id" | "partnerId" | "longDescription" | "hash"
>;
