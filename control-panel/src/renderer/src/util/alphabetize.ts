import { SortOrder } from '@renderer/model/sort-order';

export function alphabetize<T extends { [K in V]: string }, V extends string>(
  items: T[],
  sortOrder: SortOrder,
  key: V
): T[] {
  return items.toSorted((itemA, itemB) => {
    let result: number;
    const a = itemA[key].toLowerCase();
    const b = itemB[key].toLowerCase();

    if (a < b) {
      result = -1;
    } else if (a > b) {
      result = 1;
    } else {
      result = 0;
    }

    if (sortOrder === SortOrder.Descending) {
      result *= -1;
    }

    return result;
  });
}
