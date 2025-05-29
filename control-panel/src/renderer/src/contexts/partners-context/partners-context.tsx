import { createContext } from 'react';
import type { Partner } from '@renderer/model/partner';

interface PartnersContextType {
  partners: Partner[];
  deletePartnersById: (ids: string[]) => void;
}

export const PartnersContext = createContext<PartnersContextType | null>(null);
