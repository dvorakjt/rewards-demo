import type { IPartner } from "./i-partner";

export type PartnerData = Omit<
  IPartner,
  "id" | "description" | "why8by8" | "hash"
>;
