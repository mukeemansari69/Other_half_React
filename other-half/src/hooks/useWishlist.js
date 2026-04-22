import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";

const WISHLIST_STORAGE_KEY_PREFIX = "other-half-wishlist";

const normalizeWishlist = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))];
};

const buildWishlistStorageKey = (user) => {
  const identity = user?.id || user?.email || "";

  if (!identity) {
    return "";
  }

  return `${WISHLIST_STORAGE_KEY_PREFIX}:${identity}`;
};

const readStoredWishlist = (storageKey) => {
  if (typeof window === "undefined" || !storageKey) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return [];
    }

    return normalizeWishlist(JSON.parse(rawValue));
  } catch {
    return [];
  }
};

export const useWishlist = () => {
  const { isAuthenticated, user } = useAuth();
  const storageKey = useMemo(() => buildWishlistStorageKey(user), [user]);
  const [wishlistProductIds, setWishlistProductIds] = useState(() =>
    readStoredWishlist(storageKey)
  );

  useEffect(() => {
    setWishlistProductIds(readStoredWishlist(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !storageKey || !isAuthenticated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(wishlistProductIds));
  }, [isAuthenticated, storageKey, wishlistProductIds]);

  const isWishlisted = (productId) => {
    const normalizedProductId = String(productId || "").trim();

    if (!normalizedProductId || !isAuthenticated) {
      return false;
    }

    return wishlistProductIds.includes(normalizedProductId);
  };

  const toggleWishlist = (productId) => {
    const normalizedProductId = String(productId || "").trim();

    if (!normalizedProductId || !isAuthenticated) {
      return false;
    }

    const nextWishlistedState = !wishlistProductIds.includes(normalizedProductId);

    setWishlistProductIds((currentWishlist) => {
      if (currentWishlist.includes(normalizedProductId)) {
        return currentWishlist.filter((item) => item !== normalizedProductId);
      }

      return [...currentWishlist, normalizedProductId];
    });

    return nextWishlistedState;
  };

  return {
    isWishlisted,
    toggleWishlist,
    wishlistProductIds,
  };
};
