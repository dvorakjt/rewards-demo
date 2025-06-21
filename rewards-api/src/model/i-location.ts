import type { IPoint } from "./i-point";

export interface ILocation {
  id: number;
  partnerId: string;
  coordinates: IPoint;
}
