import { createContext } from 'react';
import type { Partner } from '@renderer/model/partner';
import type { NewPartnerData } from '@renderer/model/new-partner-data';

interface PartnersContextType {
  partners: Partner[];
  deletePartnersById: (ids: string[]) => void;
  addPartner: (partnerData: NewPartnerData) => Promise<void>;
}

export const PartnersContext = createContext<PartnersContextType | null>(null);
