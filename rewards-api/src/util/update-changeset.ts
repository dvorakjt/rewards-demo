import fs from "node:fs";
import type { ChangeSet } from "../model/changeset";

export function updateChangeSet(pathToChangeSet: string, changeSet: ChangeSet) {
  const stringified = JSON.stringify(changeSet, null, 2);
  fs.writeFileSync(pathToChangeSet, stringified, "utf-8");
}
