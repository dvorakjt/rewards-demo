import { kebabToPascal, type KebabCaseToPascalCase } from "./kebab-to-pascal";

type EnumFromValues<T extends readonly string[]> = {
  [K in T[number] as KebabCaseToPascalCase<K>]: K;
};

export function valuesToEnum<T extends readonly string[]>(
  values: T
): EnumFromValues<T> {
  const enumFromValues = values.reduce((previousValue, currentValue) => {
    previousValue[kebabToPascal(currentValue)] = currentValue;
    return previousValue;
  }, {} as Record<string, string>);
  return enumFromValues as EnumFromValues<T>;
}
