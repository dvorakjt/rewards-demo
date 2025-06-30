import { IPartner } from "../model/i-partner";

export interface IPartnerReader {
  partnerHasRequiredData(partnerId: string): boolean;
  readPartnerData(partnerId: string): Omit<IPartner, "id" | "lastModifiedAt">;
}
