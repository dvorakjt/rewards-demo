export interface NewPartnerData {
  id: string;
  name: string;
  logo: File;
  description: string;
  website?: string;
  locations?: File | null;
}
