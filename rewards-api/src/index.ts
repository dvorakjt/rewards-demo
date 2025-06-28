import { db } from "./database/db";
import { compareDBWithFSAndUpdateDB } from "./database/functions/compare-db-with-fs-and-update-db";
import { changeSetSchema } from "./model/changeset-schema";
import changeSet from "./changeset.json";

main();

async function main() {
  const validatedChangeSet = changeSetSchema.parse(changeSet);
  await compareDBWithFSAndUpdateDB(validatedChangeSet);
  db.orm.close();
}
