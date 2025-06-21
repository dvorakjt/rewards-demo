/**
 * A business that has teamed up with 8by8 to offer rewards winners of the 8by8
 * challenge.
 */
export interface IPartner {
  id: string;
  name: string;
  description: string;
  website?: string;
  why8by8?: string;
  hash: string;
}
