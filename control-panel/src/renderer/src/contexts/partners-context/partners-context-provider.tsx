import { useState, type ReactNode } from 'react';
import { PartnersContext } from './partners-context';
import { generateDummyPartners } from '@renderer/util/generate-dummy-partners';
import type { Partner } from '@renderer/model/partner';
import type { NewPartnerData } from '@renderer/model/new-partner-data';

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
  function addPartner(data: NewPartnerData) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPartners([
          ...partners,
          {
            id: data.id,
            name: data.name,
            description: data.description,
            website: data.website
          }
        ]);
        resolve();
      }, 1000);
    });
  }

  return (
    <PartnersContext.Provider
      value={{ partners, deletePartnersById, addPartner }}
    >
      {children}
    </PartnersContext.Provider>
  );
}
