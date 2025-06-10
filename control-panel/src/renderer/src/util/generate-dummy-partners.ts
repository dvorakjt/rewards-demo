import { v4 as uuid } from 'uuid';
import type { Partner } from '@renderer/model/partner';

export function generateDummyPartners(count: number) {
  const partners: Partner[] = [];
  for (let i = 1; i <= count; i++) {
    partners.push({
      id: uuid(),
      name: `Partner ${i.toString().padStart(count.toString().length, '0')}`,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quis purus placerat, mattis ante eget, tincidunt nisl. Curabitur sed viverra velit. Integer ornare, nisl malesuada elementum fermentum, urna sem sodales sem, quis porttitor eros purus sollicitudin elit. Sed sed tincidunt ligula. Curabitur libero nunc, malesuada eu ante vitae, ullamcorper tempus odio. Ut ornare eros ut risus hendrerit hendrerit. Ut rhoncus tristique ex a porta. Fusce id posuere metus. Pellentesque velit lorem, pharetra eget tellus a, interdum euismod turpis. Ut at scelerisque mi. Nullam cursus tristique nulla eget ullamcorper. Praesent malesuada eros at augue dignissim, quis consectetur risus volutpat. Mauris tincidunt lorem id pretium euismod. Sed tincidunt massa vitae aliquet finibus.`,
      website: 'https://example.com'
    });
  }
  return partners;
}
