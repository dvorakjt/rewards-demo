main();

async function main() {
  await syncDatabase();
  startServer();
}

async function syncDatabase() {
  await syncPartners();
  await Promise.all([syncLocations(), syncRewards()]);
  // how to leverage parallelization?
}

async function syncPartners() {
  await deleteRemovedPartners();
  await updateExistingPartners(); // more efficient to do this first
  await createNewPartners();
}

async function deleteRemovedPartners() {}

async function createNewPartners() {}

async function updateExistingPartners() {}

async function syncLocations() {}

async function syncRewards() {}

function startServer() {}

// a script watches for changes in entities and generates new hashes
// this way, hashes are always generated locally
// nodemon watches for changes in the hashes folder and recompiles and restarts
// the application

// fs.watch plus pm2 could be used for these purposes
