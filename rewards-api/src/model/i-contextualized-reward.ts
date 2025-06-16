import { RedemptionForum } from "./redemption-forum";
import type { IPoint } from "./i-point";

export interface IContextualizedReward {
  id: string;
  shortDescription: string;
  redemptionForums: RedemptionForum[];
  longDescription?: string;
  partnerId: string;
  partnerName: string;
  partnerDescription: string;
  partnerWebsite?: string;
  partnerWhy8by8?: string;
  nearestPartnerLocation?: IPoint;
}
