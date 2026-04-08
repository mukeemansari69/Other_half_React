import { addIntervalToDate, getCadenceDetails } from "../../shared/subscriptionUtils.js";

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due"];

const normalizeSubscriptionStatus = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase();

const createDogProfile = (dogName = "Your dog", currentProfile = {}) => ({
  name: currentProfile?.name || dogName,
  breed: currentProfile?.breed || "Not set yet",
  age: currentProfile?.age || "Not set yet",
  focus: currentProfile?.focus || "Getting started",
});

const createInactiveSubscription = (dogName = "Your dog", currentSubscription = {}) => ({
  status: "none",
  planName: "No active subscription",
  deliveryCadence: currentSubscription?.deliveryCadence || "Not set",
  nextDelivery: null,
  productId: null,
  productName: "",
  planId: null,
  planLabel: "",
  intervalUnit: null,
  intervalCount: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  sourceOrderId: null,
  sourceOrderNumber: null,
  dogProfile: createDogProfile(dogName, currentSubscription?.dogProfile),
});

const isSubscriptionOrderActive = (order) => {
  if (!order || String(order.subscriptionType || "").toLowerCase() !== "subscription") {
    return false;
  }

  if (String(order.orderStatus || "").toLowerCase() === "cancelled") {
    return false;
  }

  const paymentStatus = normalizeSubscriptionStatus(order.paymentStatus);
  const subscriptionStatus = normalizeSubscriptionStatus(order.subscription?.status);

  if (ACTIVE_SUBSCRIPTION_STATUSES.includes(subscriptionStatus)) {
    return true;
  }

  return paymentStatus === "paid";
};

const getPrimarySubscriptionItem = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];

  return (
    items.find((item) => String(item.purchaseType || "").toLowerCase() === "subscription") ||
    items[0] ||
    null
  );
};

const getSubscriptionSortTime = (order) => {
  const candidates = [
    order?.subscription?.currentPeriodEnd,
    order?.subscription?.nextDelivery,
    order?.deliveryDueAt,
    order?.updatedAt,
    order?.createdAt,
  ];

  for (const candidate of candidates) {
    const timestamp = new Date(candidate).getTime();

    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return 0;
};

const buildActiveSubscriptionFromOrder = (order, currentSubscription = {}) => {
  const primaryItem = getPrimarySubscriptionItem(order);

  if (!primaryItem) {
    return createInactiveSubscription(currentSubscription?.dogProfile?.name || "Your dog", currentSubscription);
  }

  const cadence = getCadenceDetails({
    planId: primaryItem.planId,
    deliveryLabel: primaryItem.deliveryLabel || order?.subscription?.deliveryCadence,
    intervalCount: primaryItem.billingIntervalCount || order?.subscription?.intervalCount,
    intervalUnit: primaryItem.billingIntervalUnit || order?.subscription?.intervalUnit || "month",
  });
  const orderCreatedAt = order?.createdAt || new Date().toISOString();
  const currentPeriodEnd =
    order?.subscription?.currentPeriodEnd ||
    order?.subscription?.nextDelivery ||
    order?.deliveryDueAt ||
    addIntervalToDate(orderCreatedAt, cadence.intervalCount, cadence.intervalUnit);
  const subscriptionStatus = normalizeSubscriptionStatus(order?.subscription?.status);

  return {
    status: ACTIVE_SUBSCRIPTION_STATUSES.includes(subscriptionStatus)
      ? subscriptionStatus
      : "active",
    planName:
      order?.subscription?.planName ||
      `${primaryItem.name}${primaryItem.planLabel ? ` - ${primaryItem.planLabel}` : ""}`,
    deliveryCadence: order?.subscription?.deliveryCadence || cadence.cadenceLabel,
    nextDelivery: order?.subscription?.nextDelivery || currentPeriodEnd || null,
    productId: primaryItem.productId || null,
    productName: primaryItem.name || "",
    planId: primaryItem.planId || null,
    planLabel: primaryItem.planLabel || "",
    intervalUnit: cadence.intervalUnit,
    intervalCount: cadence.intervalCount,
    stripeCustomerId: order?.subscription?.stripeCustomerId || null,
    stripeSubscriptionId: order?.subscription?.stripeSubscriptionId || null,
    currentPeriodEnd: currentPeriodEnd || null,
    cancelAtPeriodEnd: Boolean(order?.subscription?.cancelAtPeriodEnd),
    sourceOrderId: order?.id || null,
    sourceOrderNumber: order?.orderNumber || null,
    dogProfile: createDogProfile(currentSubscription?.dogProfile?.name || "Your dog", currentSubscription?.dogProfile),
  };
};

const syncUserSubscriptionState = (database, userId) => {
  const user = database?.users?.find((candidate) => candidate.id === userId);

  if (!user || user.role === "admin") {
    return false;
  }

  const currentSubscription = user.subscription || {};
  const currentSerializedSubscription = JSON.stringify(currentSubscription);
  const activeOrder = [...(database.orders || [])]
    .filter((order) => order.userId === userId)
    .filter(isSubscriptionOrderActive)
    .sort((firstOrder, secondOrder) => getSubscriptionSortTime(secondOrder) - getSubscriptionSortTime(firstOrder))[0];

  user.subscription = activeOrder
    ? buildActiveSubscriptionFromOrder(activeOrder, currentSubscription)
    : createInactiveSubscription(currentSubscription?.dogProfile?.name || "Your dog", currentSubscription);

  return JSON.stringify(user.subscription) !== currentSerializedSubscription;
};

const syncAllUserSubscriptions = (database) => {
  let didChange = false;

  for (const user of database?.users || []) {
    if (user.role === "admin") {
      continue;
    }

    if (syncUserSubscriptionState(database, user.id)) {
      didChange = true;
    }
  }

  return didChange;
};

export {
  ACTIVE_SUBSCRIPTION_STATUSES,
  buildActiveSubscriptionFromOrder,
  createInactiveSubscription,
  createDogProfile,
  getPrimarySubscriptionItem,
  isSubscriptionOrderActive,
  normalizeSubscriptionStatus,
  syncAllUserSubscriptions,
  syncUserSubscriptionState,
};
