import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

const locationFilePath = path.join(__dirname, "locations.csv");

fs.writeFileSync(locationFilePath, "latitude,longitude\n", "utf-8");

for (let i = 0; i < 10000; i++) {
  const latitude = faker.location.latitude();
  const longitude = faker.location.longitude();
  fs.appendFileSync(locationFilePath, `${latitude},${longitude}\n`);
}
