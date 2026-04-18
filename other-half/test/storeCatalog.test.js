import assert from "node:assert/strict";
import test from "node:test";

import {
  collectionCards,
  resolveCatalogLineItem,
  resolveStoreProduct,
  storeCatalog,
} from "../shared/storeCatalog.js";

test("store catalog exposes the core storefront products", () => {
  assert.ok(storeCatalog.length >= 3);
  assert.ok(collectionCards.some((entry) => entry.productId === "everyday-one"));
  assert.ok(collectionCards.some((entry) => entry.productId === "doggie-dental"));
  assert.ok(collectionCards.some((entry) => entry.productId === "daily-duo"));
});

test("catalog resolution is server-owned and returns canonical bundle pricing", () => {
  const lineItem = resolveCatalogLineItem({
    productId: "everyday-one",
    sizeId: "small",
    planId: "2m",
    purchaseType: "subscription",
    bundleIds: ["daily-duo"],
  });

  assert.ok(lineItem);
  assert.equal(lineItem.productId, "everyday-one");
  assert.equal(lineItem.purchaseType, "subscription");
  assert.ok(lineItem.unitPrice > 0);
  assert.deepEqual(lineItem.bundleIds, ["daily-duo"]);
  assert.equal(lineItem.bundleLabels.length, 1);
});

test("catalog resolution uses compare-at pricing for one-time purchases", () => {
  const subscriptionLineItem = resolveCatalogLineItem({
    productId: "doggie-dental",
    sizeId: "small",
    planId: "1m",
    purchaseType: "subscription",
  });
  const oneTimeLineItem = resolveCatalogLineItem({
    productId: "doggie-dental",
    sizeId: "small",
    planId: "1m",
    purchaseType: "one-time",
  });

  assert.ok(oneTimeLineItem);
  assert.ok(subscriptionLineItem);
  assert.ok(oneTimeLineItem.unitPrice > subscriptionLineItem.unitPrice);
});

test("alias resolution still finds products after route normalization", () => {
  const resolvedProduct = resolveStoreProduct({
    productName: "Daily Duo: Multivitamin + Dental Powder",
  });

  assert.ok(resolvedProduct);
  assert.equal(resolvedProduct.route, "/daily-duo");
});

test("collection cards expose centralized pricing and default subscription state", () => {
  const everydayCard = collectionCards.find((entry) => entry.productId === "everyday-one");
  const dentalCard = collectionCards.find((entry) => entry.productId === "doggie-dental");
  const duoCard = collectionCards.find((entry) => entry.productId === "daily-duo");

  assert.equal(everydayCard?.displayCompareAtPrice, 300);
  assert.equal(dentalCard?.displayCompareAtPrice, 150);
  assert.equal(duoCard?.displayCompareAtPrice, 450);
  assert.equal(everydayCard?.displayPrice, 255);
  assert.equal(dentalCard?.displayPrice, 123);
  assert.equal(duoCard?.displayPrice, 360);
  assert.equal(everydayCard?.startingDiscountLabel, "15% OFF");
  assert.equal(dentalCard?.startingDiscountLabel, "18% OFF");
  assert.equal(duoCard?.startingDiscountLabel, "20% OFF");
  assert.equal(everydayCard?.defaultSelection.purchaseType, "subscription");
});
