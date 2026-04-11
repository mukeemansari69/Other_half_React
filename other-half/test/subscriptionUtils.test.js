import assert from "node:assert/strict";
import test from "node:test";

import { addIntervalToDate, getCadenceDetails } from "../shared/subscriptionUtils.js";

test("getCadenceDetails parses month-based delivery labels", () => {
  const cadence = getCadenceDetails({
    planId: "4m",
    deliveryLabel: "Delivered Every 4 Months",
  });

  assert.equal(cadence.intervalUnit, "month");
  assert.equal(cadence.intervalCount, 4);
  assert.equal(cadence.cadenceLabel, "Every 4 months");
});

test("addIntervalToDate advances ISO dates by the requested cadence", () => {
  const nextDate = addIntervalToDate("2026-01-10T00:00:00.000Z", 2, "month");

  assert.equal(nextDate, "2026-03-10T00:00:00.000Z");
});
