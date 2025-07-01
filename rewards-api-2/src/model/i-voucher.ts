import type { RedemptionMethod } from "../constants/redemption-methods";

interface IGenericVoucher {
  redemptionMethod: RedemptionMethod;
  instructions: string;
}

interface ICodeVoucher extends IGenericVoucher {
  redemptionMethod: RedemptionMethod.Code | RedemptionMethod.QRCode;
  value: string;
}

interface ILinkVoucher extends IGenericVoucher {
  redemptionMethod: RedemptionMethod.Link;
  href: string;
  linkText?: string;
}

interface IManualVoucher extends IGenericVoucher {
  redemptionMethod: RedemptionMethod.Manual;
}

export type IVoucher = ICodeVoucher | ILinkVoucher | IManualVoucher;
