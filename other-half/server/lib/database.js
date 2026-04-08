import "../loadEnv.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveReviewProduct } from "../../shared/reviewProductCatalog.js";
import { syncAllUserSubscriptions } from "./subscriptions.js";

const ROOT_DIR = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const LEGACY_DATA_DIR = path.join(ROOT_DIR, "server", "data");
const LEGACY_DATABASE_FILE = path.join(LEGACY_DATA_DIR, "db.json");
const LEGACY_UPLOADS_DIR = path.join(ROOT_DIR, "server", "uploads");
const DEFAULT_APP_DATA_DIR = path.join(ROOT_DIR, "app-data");
const configuredDataDir = process.env.APP_DATA_DIR?.trim();
const configuredUploadsDir = process.env.APP_UPLOADS_DIR?.trim();
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
  orders: [],
  reviews: [],
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

const writeRawDatabase = async (database) => {
  const normalizedDatabase = normalizeDatabaseShape(database);
  const nextDatabase = {
    ...normalizedDatabase,
    meta: {
      ...(normalizedDatabase.meta || {}),
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
    return normalizeDatabaseShape(JSON.parse(fileContents));
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
        version: 1,
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
