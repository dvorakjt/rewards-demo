import { useState, type ReactNode } from 'react';
import { PartnersContext } from './partners-context';
import { generateDummyPartners } from '@renderer/util/generate-dummy-partners';
import type { Partner } from '@renderer/model/partner';

interface PartnersContextProviderProps {
  children?: ReactNode;
}

export function PartnersContextProvider({
  children
}: PartnersContextProviderProps) {
  const [partners, setPartners] = useState<Partner[]>(
    generateDummyPartners(100)
  );
  function deletePartnersById(ids: string[]) {
    setPartners((prev) => prev.filter((p) => !ids.includes(p.id)));
  }

  return (
    <PartnersContext.Provider value={{ partners, deletePartnersById }}>
      {children}
    </PartnersContext.Provider>
  );
}
