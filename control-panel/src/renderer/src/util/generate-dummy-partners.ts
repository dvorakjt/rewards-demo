import { v4 as uuid } from 'uuid';
import type { Partner } from '@renderer/model/partner';

export function generateDummyPartners(count: number) {
  const partners: Partner[] = [];
  for (let i = 1; i <= count; i++) {
    partners.push({
      id: uuid(),
      name: `Partner ${i.toString().padStart(count.toString().length, '0')}`
    });
  }
  return partners;
}
