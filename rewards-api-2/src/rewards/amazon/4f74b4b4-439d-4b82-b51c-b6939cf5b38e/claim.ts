import { RedemptionMethod } from "../../../constants/redemption-methods";
import type { ClaimReward } from "../../../model/claim-reward";
import type { IVoucher } from "../../../model/i-voucher";

const claimReward: ClaimReward = () => {
  const vouchers: IVoucher[] = [
    {
      instructions: "",
      redemptionMethod: RedemptionMethod.Code,
      value: "",
    },
    {
      instructions: "",
      redemptionMethod: RedemptionMethod.QRCode,
      value: "",
    },
    {
      instructions: "",
      redemptionMethod: RedemptionMethod.Link,
      href: "",
    },
    {
      instructions: "",
      redemptionMethod: RedemptionMethod.Manual,
    },
  ];

  return Promise.resolve(vouchers);
};

export default claimReward;
