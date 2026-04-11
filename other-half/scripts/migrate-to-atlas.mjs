import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DATABASE_TARGET,
  LOCAL_DATABASE_FILE,
  readDatabase,
  seedDatabase,
} from "../server/lib/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const shouldArchiveLocal = process.argv.includes("--archive-local");

const summarizeDatabase = (database) => ({
  users: Array.isArray(database.users) ? database.users.length : 0,
  orders: Array.isArray(database.orders) ? database.orders.length : 0,
  reviews: Array.isArray(database.reviews) ? database.reviews.length : 0,
  supportRequests: Array.isArray(database.supportRequests)
    ? database.supportRequests.length
    : 0,
  newsletterSubscribers: Array.isArray(database.newsletterSubscribers)
    ? database.newsletterSubscribers.length
    : 0,
  quizSubmissions: Array.isArray(database.quizSubmissions)
    ? database.quizSubmissions.length
    : 0,
});

const readLocalSnapshot = async () => {
  try {
    const contents = await fs.readFile(LOCAL_DATABASE_FILE, "utf8");
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
};

const archiveLocalDatabase = async () => {
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const backupPath = path.join(
    path.dirname(LOCAL_DATABASE_FILE),
    `db.migrated-backup-${timestamp}.json`
  );

  await fs.rename(LOCAL_DATABASE_FILE, backupPath);
  return backupPath;
};

const main = async () => {
  const localSnapshot = await readLocalSnapshot();

  await seedDatabase();

  if (DATABASE_TARGET === path.relative(projectRoot, LOCAL_DATABASE_FILE) || DATABASE_TARGET.endsWith("db.json")) {
    throw new Error(
      "Database target is still local. Confirm MONGODB_URI is reachable before migrating."
    );
  }

  const remoteDatabase = await readDatabase();
  const result = {
    databaseTarget: DATABASE_TARGET,
    localSnapshot: localSnapshot ? summarizeDatabase(localSnapshot) : null,
    remoteSnapshot: summarizeDatabase(remoteDatabase),
    archivedLocalDatabase: null,
  };

  if (shouldArchiveLocal && localSnapshot) {
    result.archivedLocalDatabase = path.relative(projectRoot, await archiveLocalDatabase());
  }

  console.log(JSON.stringify(result, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
