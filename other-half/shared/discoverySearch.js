import { collectionCards } from "./storeCatalog.js";

const normalizeDiscoveryValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getCardCategories = (item) =>
  [
    item.tag,
    ...(Array.isArray(item.badges) ? item.badges : []),
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

const getProductScore = (product, query) => {
  if (!query) {
    return 0;
  }

  let score = 0;
  const normalizedTitle = normalizeDiscoveryValue(product.title);
  const normalizedDescription = normalizeDiscoveryValue(product.description);

  if (normalizedTitle.startsWith(query)) {
    score += 6;
  } else if (normalizedTitle.includes(query)) {
    score += 4;
  }

  if (product.categories.some((category) => normalizeDiscoveryValue(category).includes(query))) {
    score += 3;
  }

  if (normalizedDescription.includes(query)) {
    score += 1;
  }

  return score;
};

const getCategoryScore = (category, query) => {
  if (!query) {
    return 0;
  }

  const normalizedLabel = normalizeDiscoveryValue(category.label);

  if (normalizedLabel === query) {
    return 6;
  }

  if (normalizedLabel.startsWith(query)) {
    return 5;
  }

  if (normalizedLabel.includes(query)) {
    return 3;
  }

  return 0;
};

const discoveryProducts = collectionCards.map((item) => ({
  productId: item.productId,
  title: item.title,
  route: item.route,
  image: item.image,
  description: item.description,
  rating: item.rating,
  reviews: item.reviews,
  categories: getCardCategories(item),
}));

const discoveryCategories = Array.from(
  discoveryProducts.reduce((categoryMap, product) => {
    product.categories.forEach((category) => {
      const categoryKey = normalizeDiscoveryValue(category);

      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          id: categoryKey,
          label: category,
          count: 0,
          productIds: [],
        });
      }

      const existingCategory = categoryMap.get(categoryKey);
      existingCategory.count += 1;
      existingCategory.productIds.push(product.productId);
    });

    return categoryMap;
  }, new Map()).values()
).sort((left, right) => {
  if (right.count !== left.count) {
    return right.count - left.count;
  }

  return left.label.localeCompare(right.label);
});

const findDiscoverySuggestions = (
  query,
  {
    productLimit = 3,
    categoryLimit = 5,
  } = {}
) => {
  const normalizedQuery = normalizeDiscoveryValue(query);

  if (!normalizedQuery) {
    return {
      hasQuery: false,
      products: discoveryProducts.slice(0, productLimit),
      categories: discoveryCategories.slice(0, categoryLimit),
    };
  }

  const products = discoveryProducts
    .map((product) => ({
      ...product,
      score: getProductScore(product, normalizedQuery),
    }))
    .filter((product) => product.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.reviews !== left.reviews) {
        return right.reviews - left.reviews;
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, productLimit);

  const categories = discoveryCategories
    .map((category) => ({
      ...category,
      score: getCategoryScore(category, normalizedQuery),
    }))
    .filter((category) => category.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.label.localeCompare(right.label);
    })
    .slice(0, categoryLimit);

  return {
    hasQuery: true,
    products,
    categories,
  };
};

const filterCollectionCards = (
  cards = collectionCards,
  {
    searchQuery = "",
    topic = "",
  } = {}
) => {
  const normalizedSearchQuery = normalizeDiscoveryValue(searchQuery);
  const normalizedTopic = normalizeDiscoveryValue(topic);

  return cards.filter((item) => {
    const categories = getCardCategories(item);
    const searchBlob = normalizeDiscoveryValue(
      [
        item.title,
        item.description,
        item.tag,
        ...(Array.isArray(item.badges) ? item.badges : []),
      ].join(" ")
    );
    const matchesTopic =
      !normalizedTopic ||
      categories.some((category) => normalizeDiscoveryValue(category) === normalizedTopic);
    const matchesSearch = !normalizedSearchQuery || searchBlob.includes(normalizedSearchQuery);

    return matchesTopic && matchesSearch;
  });
};

export {
  discoveryCategories,
  discoveryProducts,
  filterCollectionCards,
  findDiscoverySuggestions,
  getCardCategories,
  normalizeDiscoveryValue,
};
