import fs from "node:fs";

export function updateChangeSet(pathToChangeSet: string, changeSet: object) {
  const stringified = JSON.stringify(changeSet, null, 2);
  fs.writeFileSync(pathToChangeSet, stringified, "utf-8");
}
