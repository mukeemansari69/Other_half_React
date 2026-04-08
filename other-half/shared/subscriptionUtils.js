const normalizePositiveInteger = (value, fallback = 1) => {
  const parsed = Math.round(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeIntervalUnit = (value = "month") => {
  const normalizedValue = String(value || "")
    .trim()
    .toLowerCase();

  if (normalizedValue === "day" || normalizedValue === "week" || normalizedValue === "month" || normalizedValue === "year") {
    return normalizedValue;
  }

  return "month";
};

const getIntervalCountFromPlanId = (planId = "") => {
  const match = String(planId || "")
    .trim()
    .toLowerCase()
    .match(/^(\d+)\s*m$/);

  if (!match) {
    return null;
  }

  return normalizePositiveInteger(match[1], 1);
};

const getIntervalCountFromDeliveryLabel = (deliveryLabel = "") => {
  const normalizedLabel = String(deliveryLabel || "")
    .trim()
    .toLowerCase();

  if (!normalizedLabel) {
    return null;
  }

  if (normalizedLabel.includes("every month")) {
    return 1;
  }

  const match = normalizedLabel.match(/every\s+(\d+)\s+months?/);

  if (!match) {
    return null;
  }

  return normalizePositiveInteger(match[1], 1);
};

const formatCadenceLabel = (intervalCount = 1, intervalUnit = "month") => {
  const safeIntervalCount = normalizePositiveInteger(intervalCount, 1);
  const safeIntervalUnit = normalizeIntervalUnit(intervalUnit);

  if (safeIntervalUnit === "month") {
    return safeIntervalCount === 1 ? "Every month" : `Every ${safeIntervalCount} months`;
  }

  if (safeIntervalUnit === "week") {
    return safeIntervalCount === 1 ? "Every week" : `Every ${safeIntervalCount} weeks`;
  }

  if (safeIntervalUnit === "year") {
    return safeIntervalCount === 1 ? "Every year" : `Every ${safeIntervalCount} years`;
  }

  return safeIntervalCount === 1 ? "Every day" : `Every ${safeIntervalCount} days`;
};

const getCadenceDetails = ({
  planId = "",
  deliveryLabel = "",
  intervalCount,
  intervalUnit = "month",
} = {}) => {
  const safeIntervalUnit = normalizeIntervalUnit(intervalUnit);
  const safeIntervalCount = normalizePositiveInteger(
    intervalCount || getIntervalCountFromPlanId(planId) || getIntervalCountFromDeliveryLabel(deliveryLabel) || 1,
    1
  );

  return {
    intervalUnit: safeIntervalUnit,
    intervalCount: safeIntervalCount,
    cadenceLabel: formatCadenceLabel(safeIntervalCount, safeIntervalUnit),
  };
};

const addIntervalToDate = (dateValue, intervalCount = 1, intervalUnit = "month") => {
  const nextDate = new Date(dateValue || Date.now());

  if (Number.isNaN(nextDate.getTime())) {
    return null;
  }

  const safeIntervalCount = normalizePositiveInteger(intervalCount, 1);
  const safeIntervalUnit = normalizeIntervalUnit(intervalUnit);

  if (safeIntervalUnit === "month") {
    nextDate.setMonth(nextDate.getMonth() + safeIntervalCount);
  } else if (safeIntervalUnit === "week") {
    nextDate.setDate(nextDate.getDate() + safeIntervalCount * 7);
  } else if (safeIntervalUnit === "year") {
    nextDate.setFullYear(nextDate.getFullYear() + safeIntervalCount);
  } else {
    nextDate.setDate(nextDate.getDate() + safeIntervalCount);
  }

  return nextDate.toISOString();
};

export {
  addIntervalToDate,
  formatCadenceLabel,
  getCadenceDetails,
  normalizeIntervalUnit,
  normalizePositiveInteger,
};
