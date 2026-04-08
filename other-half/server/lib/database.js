import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const LEGACY_DATA_DIR = path.join(ROOT_DIR, "server", "data");
const LEGACY_DATABASE_FILE = path.join(LEGACY_DATA_DIR, "db.json");
const LEGACY_UPLOADS_DIR = path.join(ROOT_DIR, "server", "uploads");
const DEFAULT_APP_DATA_DIR = path.join(ROOT_DIR, "app-data");
const configuredDataDir = process.env.APP_DATA_DIR?.trim();
const configuredUploadsDir = process.env.APP_UPLOADS_DIR?.trim();

export const DATA_DIR = configuredDataDir
  ? path.resolve(ROOT_DIR, configuredDataDir)
  : DEFAULT_APP_DATA_DIR;
export const DATABASE_FILE = path.join(DATA_DIR, "db.json");
export const UPLOADS_DIR = configuredUploadsDir
  ? path.resolve(ROOT_DIR, configuredUploadsDir)
  : path.join(DATA_DIR, "uploads");

const baseDatabase = () => ({
  meta: {
    version: 1,
    seededAt: null,
    updatedAt: null,
  },
  users: [],
  supportRequests: [],
  newsletterSubscribers: [],
  quizSubmissions: [],
});

let writeQueue = Promise.resolve();

const createIsoDate = (offsetDays = 0) => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + offsetDays);
  return nextDate.toISOString();
};

const createDefaultSubscription = (dogName = "Maple") => ({
  status: "active",
  planName: "Daily Duo Subscription",
  deliveryCadence: "Every 30 days",
  nextDelivery: createIsoDate(12),
  dogProfile: {
    name: dogName,
    breed: "Mixed Breed",
    age: "Adult",
    focus: "Daily wellness + oral care",
  },
});

const DEFAULT_ADMIN_EMAIL = "admin@otherhalfpets.com";
const DEFAULT_MEMBER_EMAIL = "member@example.com";

const createSeedAdminUser = async () => ({
  id: randomUUID(),
  name: "Admin Other Half",
  email: DEFAULT_ADMIN_EMAIL,
  phone: "+1 555 0100",
  role: "admin",
  passwordHash: await bcrypt.hash("Admin@123", 10),
  subscription: {
    status: "staff",
    planName: "Admin dashboard access",
    deliveryCadence: "N/A",
    nextDelivery: createIsoDate(0),
    dogProfile: {
      name: "HQ",
      breed: "Office Pack",
      age: "N/A",
      focus: "Operations",
    },
  },
  createdAt: createIsoDate(-14),
  lastLoginAt: createIsoDate(-1),
});

const createSeedMemberUser = async () => ({
  id: randomUUID(),
  name: "Sarah Bennett",
  email: DEFAULT_MEMBER_EMAIL,
  phone: "+1 555 0101",
  role: "user",
  passwordHash: await bcrypt.hash("Member@123", 10),
  subscription: createDefaultSubscription("Milo"),
  createdAt: createIsoDate(-7),
  lastLoginAt: createIsoDate(-2),
});

const createSeedSupportRequest = (user) => {
  return {
    id: randomUUID(),
    userId: user.id,
    team: "Subscription Team",
    teamEmail: "subscriptions@otherhalfpets.com",
    name: user.name,
    email: user.email,
    phone: user.phone,
    orderNumber: "OH-2048",
    dogName: user.subscription.dogProfile.name,
    subject: "[Subscription Team] Need to move my next shipment",
    category: "subscription-help",
    priority: "priority",
    preferredContact: "email",
    message:
      "I am traveling next week and need my next order pushed back by two weeks so the shipment does not arrive while I am away.",
    status: "in-review",
    attachments: [],
    handledBy: "Ava - Customer Care",
    createdAt: createIsoDate(-3),
    updatedAt: createIsoDate(-2),
  };
};

const createSeedQuizSubmission = (user) => {
  return {
    id: randomUUID(),
    userId: user.id,
    name: user.name,
    email: user.email,
    recommendationKey: "duo",
    recommendationTitle: "Daily Duo Bundle",
    topFocuses: ["dental", "gut", "vitality"],
    scores: {
      gut: 6,
      dental: 8,
      mobility: 1,
      skin: 2,
      vitality: 5,
      bundleIntent: 4,
    },
    answers: [
      {
        questionId: "main-concern",
        title: "A few things feel off at once",
      },
      {
        questionId: "mouth",
        title: "Plaque or strong breath is obvious",
      },
    ],
    createdAt: createIsoDate(-4),
  };
};

const createSeedSubscriber = () => ({
  id: randomUUID(),
  email: "packfan@example.com",
  source: "footer-desktop",
  createdAt: createIsoDate(-1),
});

const ensureDirectories = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};

const migrateLegacyStorageIfNeeded = async () => {
  if (configuredDataDir || configuredUploadsDir) {
    return;
  }

  if (!fsSync.existsSync(DATABASE_FILE) && fsSync.existsSync(LEGACY_DATABASE_FILE)) {
    await fs.copyFile(LEGACY_DATABASE_FILE, DATABASE_FILE);
  }

  if (
    fsSync.existsSync(LEGACY_UPLOADS_DIR) &&
    LEGACY_UPLOADS_DIR !== UPLOADS_DIR
  ) {
    const currentUploads = await fs.readdir(UPLOADS_DIR);

    if (currentUploads.length === 0) {
      await fs.cp(LEGACY_UPLOADS_DIR, UPLOADS_DIR, {
        recursive: true,
        force: false,
      });
    }
  }
};

const writeRawDatabase = async (database) => {
  const nextDatabase = {
    ...database,
    meta: {
      ...(database.meta || {}),
      version: 1,
      updatedAt: new Date().toISOString(),
    },
  };

  await fs.writeFile(DATABASE_FILE, JSON.stringify(nextDatabase, null, 2));
  return nextDatabase;
};

export const readDatabase = async () => {
  await ensureDirectories();
  await migrateLegacyStorageIfNeeded();

  try {
    const fileContents = await fs.readFile(DATABASE_FILE, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    const initialDatabase = await writeRawDatabase(baseDatabase());
    return initialDatabase;
  }
};

export const writeDatabase = async (database) => {
  writeQueue = writeQueue.then(() => writeRawDatabase(database));
  return writeQueue;
};

export const sanitizeUser = (user) => {
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return safeUser;
};

export const seedDatabase = async () => {
  const database = await readDatabase();
  let didChange = false;
  const usersByEmail = new Map(
    database.users.map((user) => [String(user.email || "").toLowerCase(), user])
  );
  const seededUsers = [];

  if (!usersByEmail.has(DEFAULT_ADMIN_EMAIL)) {
    seededUsers.push(await createSeedAdminUser());
  }

  if (!usersByEmail.has(DEFAULT_MEMBER_EMAIL)) {
    seededUsers.push(await createSeedMemberUser());
  }

  if (seededUsers.length > 0) {
    database.users = [...seededUsers, ...database.users];
    didChange = true;
  }

  const demoUser =
    database.users.find((user) => user.email === DEFAULT_MEMBER_EMAIL) ||
    database.users.find((user) => user.role === "user");

  if (demoUser && database.supportRequests.length === 0) {
    database.supportRequests = [createSeedSupportRequest(demoUser)];
    didChange = true;
  }

  if (database.newsletterSubscribers.length === 0) {
    database.newsletterSubscribers = [createSeedSubscriber()];
    didChange = true;
  }

  if (demoUser && database.quizSubmissions.length === 0) {
    database.quizSubmissions = [createSeedQuizSubmission(demoUser)];
    didChange = true;
  }

  if (!database.meta?.seededAt) {
    database.meta = {
      ...(database.meta || {}),
      version: 1,
      seededAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    didChange = true;
  }

  if (didChange) {
    await writeDatabase(database);
  }

  return database;
};
