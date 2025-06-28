import fs from "node:fs";
import { changeSetSchema } from "../model/changeset-schema";
import type { ChangeSet } from "../model/changeset";

export function readChangeSet(pathToChangeSet: string): ChangeSet {
  const changeSetFileContents = fs.readFileSync(pathToChangeSet, "utf-8");
  const changeSet = JSON.parse(changeSetFileContents);
  const validatedChangeSet = changeSetSchema.parse(changeSet);
  return validatedChangeSet as ChangeSet;
}
