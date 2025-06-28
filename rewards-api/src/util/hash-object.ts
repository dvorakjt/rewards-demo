import { hashString } from "./hash-string";

export function hashObject(obj: object) {
  const stringified = JSON.stringify(obj);
  const hashed = hashString(stringified);
  return hashed;
}
