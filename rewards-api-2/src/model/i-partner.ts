/**
 * A business that has teamed up with 8by8 to offer rewards winners of the 8by8
 * challenge.
 */
export interface IPartner {
  /**
   * A unique identifier for the partner.
   */
  id: string;
  /**
   * The business name of the partner, e.g. 8by8, Inc.
   */
  name: string;
  /**
   * A description of the partner. Required.
   */
  description: string;
  /**
   * The URL of the partner's website. Optional.
   */
  website?: string;
  /**
   * A description of why the partner supports the 8by8 cause. Optional.
   */
  why8by8?: string;
  lastModifiedAt: Date;
}
