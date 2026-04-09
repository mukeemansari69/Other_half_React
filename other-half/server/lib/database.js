import "../loadEnv.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

import { resolveReviewProduct } from "../../shared/reviewProductCatalog.js";
import { syncAllUserSubscriptions } from "./subscriptions.js";

const ROOT_DIR = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const LEGACY_DATA_DIR = path.join(ROOT_DIR, "server", "data");
const LEGACY_DATABASE_FILE = path.join(LEGACY_DATA_DIR, "db.json");
const DEFAULT_APP_DATA_DIR = path.join(ROOT_DIR, "app-data");
const configuredDataDir = process.env.APP_DATA_DIR?.trim();
const configuredUploadsDir = process.env.APP_UPLOADS_DIR?.trim();
const configuredMongoUri = String(process.env.MONGODB_URI || "").trim();
const configuredMongoDbName =
  String(process.env.MONGODB_DB_NAME || "").trim() || "other-half";
const configuredMongoCollection =
  String(process.env.MONGODB_COLLECTION || "").trim() || "appstates";
const isProduction = process.env.NODE_ENV === "production";
const enableDemoSeeding = (() => {
  if (process.env.ENABLE_DEMO_SEEDING === undefined) {
    return !isProduction;
  }

  return ["1", "true", "yes", "on"].includes(
    String(process.env.ENABLE_DEMO_SEEDING).trim().toLowerCase()
  );
})();
const bootstrapAdminEmail = String(process.env.BOOTSTRAP_ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();
const bootstrapAdminPassword = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || "");
const bootstrapAdminName =
  String(process.env.BOOTSTRAP_ADMIN_NAME || "").trim() || "Other Half Admin";
const APP_STATE_KEY = "primary";
const DEFAULT_DATABASE_VERSION = 1;

export const DATA_DIR = configuredDataDir
  ? path.resolve(ROOT_DIR, configuredDataDir)
  : DEFAULT_APP_DATA_DIR;
export const LOCAL_DATABASE_FILE = path.join(DATA_DIR, "db.json");
export const DATABASE_TARGET = `${configuredMongoDbName}/${configuredMongoCollection}`;
export const UPLOADS_DIR = configuredUploadsDir
  ? path.resolve(ROOT_DIR, configuredUploadsDir)
  : path.join(DATA_DIR, "uploads");

const baseDatabase = () => ({
  meta: {
    version: DEFAULT_DATABASE_VERSION,
    seededAt: null,
    updatedAt: null,
  },
  users: [],
  supportRequests: [],
  newsletterSubscribers: [],
  quizSubmissions: [],
  orders: [],
  reviews: [],
});

const appStateSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: APP_STATE_KEY,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: () => baseDatabase().meta,
    },
    users: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    supportRequests: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    newsletterSubscribers: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    quizSubmissions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    orders: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    reviews: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    collection: configuredMongoCollection,
    minimize: false,
    strict: false,
    versionKey: false,
  }
);

const AppState =
  mongoose.models.OtherHalfAppState ||
  mongoose.model("OtherHalfAppState", appStateSchema);

let connectionPromise = null;
let initializationPromise = null;
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

const createBootstrapAdminUser = async () => ({
  id: randomUUID(),
  name: bootstrapAdminName,
  email: bootstrapAdminEmail,
  phone: "",
  role: "admin",
  passwordHash: await bcrypt.hash(bootstrapAdminPassword, 10),
  subscription: {
    status: "staff",
    planName: "Admin dashboard access",
    deliveryCadence: "N/A",
    nextDelivery: createIsoDate(0),
    dogProfile: {
      name: "Operations",
      breed: "Office Pack",
      age: "N/A",
      focus: "Operations",
    },
  },
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
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

const createSeedOrders = (user) => [
  {
    id: randomUUID(),
    orderNumber: "OH-3201",
    userId: user?.id || null,
    customerName: user?.name || "Guest customer",
    customerEmail: user?.email || "guest@example.com",
    currency: "USD",
    totalAmount: 89,
    paymentMode: "card",
    paymentStatus: "paid",
    orderStatus: "delivered",
    subscriptionType: "subscription",
    deliveryStatus: "delivered",
    deliveryDueAt: createIsoDate(-8),
    items: [
      {
        productId: "daily-duo",
        name: "Daily Duo Bundle",
        quantity: 1,
        unitPrice: 89,
        lineTotal: 89,
        purchaseType: "subscription",
        planId: "1m",
        planLabel: "1 Month Supply",
        deliveryLabel: "Delivered every month",
        billingIntervalUnit: "month",
        billingIntervalCount: 1,
      },
    ],
    subscription: {
      status: "active",
      planName: "Daily Duo Bundle - 1 Month Supply",
      deliveryCadence: "Every month",
      nextDelivery: createIsoDate(22),
      intervalUnit: "month",
      intervalCount: 1,
      cancelAtPeriodEnd: false,
    },
    createdAt: createIsoDate(-15),
    updatedAt: createIsoDate(-8),
  },
  {
    id: randomUUID(),
    orderNumber: "OH-3202",
    userId: user?.id || null,
    customerName: user?.name || "Guest customer",
    customerEmail: user?.email || "guest@example.com",
    currency: "USD",
    totalAmount: 49,
    paymentMode: "card",
    paymentStatus: "paid",
    orderStatus: "processing",
    subscriptionType: "one-time",
    deliveryStatus: "in-transit",
    deliveryDueAt: createIsoDate(2),
    items: [
      {
        productId: "doggie-dental",
        name: "Doggie Dental Powder",
        quantity: 1,
        unitPrice: 49,
        lineTotal: 49,
        purchaseType: "one-time",
        planId: "1m",
        planLabel: "1 Month Supply",
        deliveryLabel: "Delivered every month",
        billingIntervalUnit: "month",
        billingIntervalCount: 1,
      },
    ],
    createdAt: createIsoDate(-2),
    updatedAt: createIsoDate(-1),
  },
  {
    id: randomUUID(),
    orderNumber: "OH-3203",
    userId: null,
    customerName: "Guest customer",
    customerEmail: "guest+checkout@example.com",
    currency: "INR",
    totalAmount: 199,
    paymentMode: "upi",
    paymentStatus: "pending",
    orderStatus: "placed",
    subscriptionType: "one-time",
    deliveryStatus: "queued",
    deliveryDueAt: createIsoDate(4),
    items: [
      {
        productId: "everyday-one",
        name: "Everyday Wellness Plan",
        quantity: 1,
        unitPrice: 199,
        lineTotal: 199,
        purchaseType: "one-time",
        planId: "6m",
        planLabel: "6 Month Supply",
        deliveryLabel: "Delivered every 6 months",
        billingIntervalUnit: "month",
        billingIntervalCount: 6,
      },
    ],
    createdAt: createIsoDate(-1),
    updatedAt: createIsoDate(-1),
  },
];

const createSeedReviews = (user) => {
  const productEntries = [
    {
      productId: "everyday-one",
      title: "He feels more active through the whole day",
      description:
        "We started using Everyday for Milo and within a few weeks his routine felt steadier, his energy looked better, and his coat started looking healthier too.",
      rating: 5,
      profile: "Golden Retriever mom | Everyday customer",
    },
    {
      productId: "doggie-dental",
      title: "Way easier than brushing every night",
      description:
        "Dental support was always a struggle here, so having something simple to add to food made a real difference. Breath improved and the routine felt much calmer.",
      rating: 4,
      profile: "Rescue dog parent | Doggie Dental user",
    },
    {
      productId: "daily-duo",
      title: "One bundle made the whole routine easier",
      description:
        "The Daily Duo worked well for us because it covered both daily wellness and mouth care in one repeatable habit. It feels easier to stay consistent now.",
      rating: 5,
      profile: "Labrador dad | Daily Duo subscriber",
    },
  ];

  return productEntries
    .map((entry, index) => {
      const product = resolveReviewProduct({ productId: entry.productId });

      if (!product) {
        return null;
      }

      const reviewCreatedAt = createIsoDate(-6 + index);

      return {
        id: randomUUID(),
        userId: user?.id || null,
        productId: product.productId,
        productName: product.productName,
        productRoute: product.route,
        title: entry.title,
        description: entry.description,
        rating: entry.rating,
        customerName: user?.name || "Other Half customer",
        customerEmail: user?.email || "",
        customerProfile: entry.profile,
        customerImage: product.testimonialImage,
        sourceOrderId: null,
        sourceOrderNumber: null,
        status: "approved",
        createdAt: reviewCreatedAt,
        updatedAt: reviewCreatedAt,
      };
    })
    .filter(Boolean);
};

const ensureDirectories = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const normalizeDatabaseShape = (database) => {
  const initialDatabase = baseDatabase();
  const safeDatabase = database && typeof database === "object" ? database : {};

  return {
    ...initialDatabase,
    ...safeDatabase,
    meta: {
      ...initialDatabase.meta,
      ...(safeDatabase.meta || {}),
    },
    users: ensureArray(safeDatabase.users),
    supportRequests: ensureArray(safeDatabase.supportRequests),
    newsletterSubscribers: ensureArray(safeDatabase.newsletterSubscribers),
    quizSubmissions: ensureArray(safeDatabase.quizSubmissions),
    orders: ensureArray(safeDatabase.orders),
    reviews: ensureArray(safeDatabase.reviews),
  };
};

const stripModelFields = (document) => {
  if (!document) {
    return null;
  }

  const plainDocument =
    typeof document.toObject === "function" ? document.toObject() : document;
  const database = { ...plainDocument };
  delete database._id;
  delete database.key;
  return normalizeDatabaseShape(database);
};

const getLocalDatabaseCandidates = () =>
  [...new Set([LOCAL_DATABASE_FILE, LEGACY_DATABASE_FILE])];

const hasMeaningfulDatabaseContent = (database) => {
  const normalizedDatabase = normalizeDatabaseShape(database);

  if (normalizedDatabase.meta?.seededAt) {
    return true;
  }

  return (
    normalizedDatabase.users.length > 0 ||
    normalizedDatabase.supportRequests.length > 0 ||
    normalizedDatabase.newsletterSubscribers.length > 0 ||
    normalizedDatabase.quizSubmissions.length > 0 ||
    normalizedDatabase.orders.length > 0 ||
    normalizedDatabase.reviews.length > 0
  );
};

const ensureMongoConfiguration = () => {
  if (!configuredMongoUri) {
    throw new Error(
      "MONGODB_URI is not set. Add your MongoDB Atlas connection string to other-half/.env."
    );
  }

  if (/<db_password>/i.test(configuredMongoUri)) {
    throw new Error(
      "MONGODB_URI still contains <db_password>. Replace it with your actual MongoDB Atlas password in other-half/.env."
    );
  }
};

const connectToDatabase = async () => {
  ensureMongoConfiguration();

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(configuredMongoUri, {
        dbName: configuredMongoDbName,
        serverSelectionTimeoutMS: 10000,
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
  return mongoose.connection;
};

const readLocalDatabaseFile = async (filePath) => {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return normalizeDatabaseShape(JSON.parse(fileContents));
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
};

const cleanupLocalDatabaseFiles = async (filePaths) => {
  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        await fs.rm(filePath, { force: true });
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.warn(`Unable to remove local database file ${filePath}:`, error.message);
        }
      }
    })
  );
};

const buildStoredDatabase = (database) => {
  const normalizedDatabase = normalizeDatabaseShape(database);

  return {
    ...normalizedDatabase,
    meta: {
      ...(normalizedDatabase.meta || {}),
      version: DEFAULT_DATABASE_VERSION,
      updatedAt: new Date().toISOString(),
    },
  };
};

const persistDatabase = async (database) => {
  await connectToDatabase();
  const nextDatabase = buildStoredDatabase(database);

  await AppState.updateOne(
    { key: APP_STATE_KEY },
    {
      $set: {
        key: APP_STATE_KEY,
        ...nextDatabase,
      },
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const storedDocument = await AppState.findOne({ key: APP_STATE_KEY }).lean();
  return stripModelFields(storedDocument);
};

const initializeDatabaseState = async () => {
  await connectToDatabase();

  const existingDocument = await AppState.findOne({ key: APP_STATE_KEY }).lean();
  const existingDatabase = stripModelFields(existingDocument);

  if (existingDocument && hasMeaningfulDatabaseContent(existingDatabase)) {
    return existingDatabase;
  }

  const localDatabaseCandidates = getLocalDatabaseCandidates();

  for (const filePath of localDatabaseCandidates) {
    const localDatabase = await readLocalDatabaseFile(filePath);

    if (!localDatabase || !hasMeaningfulDatabaseContent(localDatabase)) {
      continue;
    }

    const migratedDatabase = await persistDatabase({
      ...localDatabase,
      meta: {
        ...(localDatabase.meta || {}),
        version: DEFAULT_DATABASE_VERSION,
        migratedAt: new Date().toISOString(),
        migratedFrom:
          path.relative(ROOT_DIR, filePath) || filePath,
      },
    });

    await cleanupLocalDatabaseFiles(localDatabaseCandidates);
    return migratedDatabase;
  }

  if (existingDocument) {
    return existingDatabase;
  }

  return persistDatabase(baseDatabase());
};

const ensureInitializedDatabase = async () => {
  if (!initializationPromise) {
    initializationPromise = initializeDatabaseState().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
};

export const readDatabase = async () => {
  await ensureDirectories();
  await ensureInitializedDatabase();
  const storedDocument = await AppState.findOne({ key: APP_STATE_KEY }).lean();

  if (!storedDocument) {
    return persistDatabase(baseDatabase());
  }

  return stripModelFields(storedDocument);
};

export const writeDatabase = async (database) => {
  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      await ensureDirectories();
      await ensureInitializedDatabase();
      return persistDatabase(database);
    });

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
  const bootstrapUsers = [];

  if (
    bootstrapAdminEmail &&
    bootstrapAdminPassword &&
    !usersByEmail.has(bootstrapAdminEmail)
  ) {
    bootstrapUsers.push(await createBootstrapAdminUser());
  }

  if (bootstrapUsers.length > 0) {
    database.users = [...bootstrapUsers, ...database.users];
    didChange = true;
    bootstrapUsers.forEach((user) => {
      usersByEmail.set(String(user.email || "").toLowerCase(), user);
    });
  }

  if (!enableDemoSeeding) {
    if (!database.meta?.seededAt) {
      database.meta = {
        ...(database.meta || {}),
        version: DEFAULT_DATABASE_VERSION,
        seededAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      didChange = true;
    }

    if (syncAllUserSubscriptions(database)) {
      didChange = true;
    }

    if (didChange) {
      await writeDatabase(database);
    }

    return database;
  }

  const demoSeedUsers = [];

  if (!usersByEmail.has(DEFAULT_ADMIN_EMAIL)) {
    demoSeedUsers.push(await createSeedAdminUser());
  }

  if (!usersByEmail.has(DEFAULT_MEMBER_EMAIL)) {
    demoSeedUsers.push(await createSeedMemberUser());
  }

  if (demoSeedUsers.length > 0) {
    database.users = [...demoSeedUsers, ...database.users];
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

  if (database.orders.length === 0) {
    database.orders = createSeedOrders(demoUser);
    didChange = true;
  }

  if (demoUser && database.reviews.length === 0) {
    database.reviews = createSeedReviews(demoUser);
    didChange = true;
  }

  if (syncAllUserSubscriptions(database)) {
    didChange = true;
  }

  if (!database.meta?.seededAt) {
    database.meta = {
      ...(database.meta || {}),
      version: DEFAULT_DATABASE_VERSION,
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

export const hasLocalDatabaseFiles = () => {
  return getLocalDatabaseCandidates().some((filePath) => fsSync.existsSync(filePath));
};
