const reviewProductCatalog = [
  {
    productId: "everyday-one",
    productName: "45 in 1 Everyday Daily Multivitamin",
    route: "/product",
    reviewSectionHref: "/?reviewsProduct=everyday-one#reviews",
    image: "/Default/images/col1.png",
    testimonialImage: "/Home/images/d1.jpg",
    aliases: [
      "everyday-one",
      "everyday daily multivitamin",
      "45 in 1 everyday daily multivitamin",
      "everyday wellness plan",
    ],
  },
  {
    productId: "doggie-dental",
    productName: "Doggie Dental Powder - Fresh Breath & Oral Care",
    route: "/doggie-dental",
    reviewSectionHref: "/?reviewsProduct=doggie-dental#reviews",
    image: "/Default/images/col2.png",
    testimonialImage: "/Home/images/d2.jpg",
    aliases: [
      "doggie-dental",
      "doggie dental powder",
      "doggie dental powder - fresh breath & oral care",
    ],
  },
  {
    productId: "daily-duo",
    productName: "Daily Duo: Multivitamin + Dental Powder",
    route: "/dailyduo",
    reviewSectionHref: "/?reviewsProduct=daily-duo#reviews",
    image: "/Default/images/col3.png",
    testimonialImage: "/Home/images/d3.jpg",
    aliases: [
      "daily-duo",
      "daily duo",
      "daily duo bundle",
      "daily duo: multivitamin + dental powder",
    ],
  },
];

const normalizeCatalogValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const reviewProductCatalogById = Object.fromEntries(
  reviewProductCatalog.map((entry) => [entry.productId, entry])
);

const findReviewProductByAlias = (value = "") => {
  const normalizedValue = normalizeCatalogValue(value);

  if (!normalizedValue) {
    return null;
  }

  return (
    reviewProductCatalog.find((entry) =>
      entry.aliases.some((alias) => normalizeCatalogValue(alias) === normalizedValue)
    ) || null
  );
};

const resolveReviewProduct = ({ productId = "", productName = "" } = {}) => {
  const normalizedId = normalizeCatalogValue(productId);

  if (normalizedId && reviewProductCatalogById[normalizedId]) {
    return reviewProductCatalogById[normalizedId];
  }

  return findReviewProductByAlias(productName);
};

export {
  reviewProductCatalog,
  reviewProductCatalogById,
  resolveReviewProduct,
};
