import crypto from "crypto";

export function hashString(str: string) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  const hashed = hash.digest("base64");
  return hashed;
}
