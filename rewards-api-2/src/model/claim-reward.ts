import type { IVoucher } from "./i-voucher";

export type ClaimReward = () => Promise<IVoucher[]>;
