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

test("alias resolution still finds products after route normalization", () => {
  const resolvedProduct = resolveStoreProduct({
    productName: "Daily Duo: Multivitamin + Dental Powder",
  });

  assert.ok(resolvedProduct);
  assert.equal(resolvedProduct.route, "/daily-duo");
});
