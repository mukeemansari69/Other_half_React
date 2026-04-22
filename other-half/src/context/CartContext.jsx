/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "other-half-cart-v1";

const CartContext = createContext(null);

const toSafeNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const normalizeItem = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const id = String(item.id || "").trim();
  const name = String(item.name || "").trim();

  if (!id || !name) {
    return null;
  }

  const quantity = Math.max(1, Math.round(toSafeNumber(item.quantity, 1)));
  const unitPrice = Math.max(0, toSafeNumber(item.unitPrice, 0));

  return {
    id,
    productId: String(item.productId || id),
    name,
    description: String(item.description || "").trim(),
    image: String(item.image || "").trim(),
    unitPrice,
    quantity,
    purchaseType:
      String(item.purchaseType || "").trim().toLowerCase() === "subscription"
        ? "subscription"
        : "one-time",
    planId: String(item.planId || "").trim(),
    planLabel: String(item.planLabel || "").trim(),
    deliveryLabel: String(item.deliveryLabel || "").trim(),
    deliveryCadence: String(item.deliveryCadence || "").trim(),
    billingIntervalUnit: String(item.billingIntervalUnit || "").trim() || "month",
    billingIntervalCount: Math.max(1, Math.round(toSafeNumber(item.billingIntervalCount, 1))),
    sizeId: String(item.sizeId || "").trim(),
    sizeLabel: String(item.sizeLabel || "").trim(),
    sizeWeight: String(item.sizeWeight || "").trim(),
  };
};

const readStoredCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((item) => normalizeItem(item))
      .filter(Boolean);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStoredCart());
  const [cartNotice, setCartNotice] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (items.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const nextItem = normalizeItem(item);

    if (!nextItem) {
      return;
    }

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (currentItem) => currentItem.id === nextItem.id
      );

      if (existingIndex === -1) {
        return [...currentItems, nextItem];
      }

      const nextItems = [...currentItems];
      const existingItem = nextItems[existingIndex];
      nextItems[existingIndex] = {
        ...existingItem,
        ...nextItem,
        quantity: existingItem.quantity + nextItem.quantity,
      };
      return nextItems;
    });

    setCartNotice({
      itemId: nextItem.id,
      itemName: nextItem.name,
      timestamp: Date.now(),
    });
  };

  const removeItem = (itemId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  const updateItemQuantity = (itemId, nextQuantity) => {
    const safeQuantity = Math.round(toSafeNumber(nextQuantity, 1));

    if (safeQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: safeQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const dismissCartNotice = () => {
    setCartNotice(null);
  };

  const hasItem = (itemId) => {
    return items.some((item) => item.id === itemId);
  };

  const cartCount = useMemo(() => {
    return items.reduce((totalCount, item) => totalCount + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (totalAmount, item) => totalAmount + item.unitPrice * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        cartNotice,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        dismissCartNotice,
        hasItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return value;
};
