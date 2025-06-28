import fs from "node:fs";

export function readChangeSet(pathToChangeSet: string) {
  const changeSetFileContents = fs.readFileSync(pathToChangeSet, "utf-8");
  const changeSet = JSON.parse(changeSetFileContents);
  return changeSet;
}
