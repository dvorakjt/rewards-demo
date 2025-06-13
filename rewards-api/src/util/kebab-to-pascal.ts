export type KebabCaseToPascalCase<T extends string> =
  T extends `${infer Word}-${infer Rest}`
    ? `${Capitalize<Word>}${KebabCaseToPascalCase<Rest>}`
    : Capitalize<T>;

export function kebabToPascal<T extends string>(
  str: T
): KebabCaseToPascalCase<T> {
  return str
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("") as KebabCaseToPascalCase<T>;
}
