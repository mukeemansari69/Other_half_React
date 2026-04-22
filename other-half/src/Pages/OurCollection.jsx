import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "/public/Default/css/ourCollection.css";
import BreadcrumbTrail from "../Components/BreadcrumbTrail.jsx";
import WishlistButton from "../Components/WishlistButton.jsx";
import { LoadingButton } from "../Components/LoadingControl.jsx";
import { useCart } from "../context/CartContext.jsx";
import { collectionCards } from "../../shared/storeCatalog.js";
import { formatStoreCurrency } from "../../shared/storefrontConfig.js";

const products = collectionCards.map((item) => {
  const mrpValue = Number(item.displayCompareAtPrice || item.startingCompareAtPrice || 0);
  const saleValue = Number(item.displayPrice || item.startingPrice || 0);
  const hasDiscount = mrpValue > 0 && saleValue > 0 && mrpValue > saleValue;

  return {
    ...item,
    price: formatStoreCurrency(saleValue),
    oldPrice: hasDiscount ? formatStoreCurrency(mrpValue) : "",
    discount: hasDiscount ? item.displayDiscountLabel || item.startingDiscountLabel || "" : "",
    cartId: `collection-${item.productId}`,
    cartImage: item.image,
    unitPrice: item.startingPrice,
    cartDescription: `${item.defaultSelection.sizeLabel} (${item.defaultSelection.sizeWeight}) | ${item.defaultSelection.planLabel}`,
    subscribeTitle: hasDiscount
      ? `Subscribe & Save ${item.displayDiscountLabel || item.startingDiscountLabel || ""}`
      : "Subscribe & Save",
    isOutOfStock:
      item.availability?.status === "out_of_stock" ||
      item.defaultSelection?.inStock === false,
  };
});

const OurCollection = () => {
  const navigate = useNavigate();
  const { addItem, hasItem } = useCart();

  const handleAddToCart = (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    if (hasItem(item.cartId)) {
      navigate("/cart");
      return;
    }

    addItem({
      id: item.cartId,
      productId: item.productId,
      name: item.title,
      description: item.cartDescription,
      image: item.cartImage,
      unitPrice: item.unitPrice,
      quantity: 1,
      purchaseType: item.defaultSelection.purchaseType,
      sizeId: item.defaultSelection.sizeId,
      sizeLabel: item.defaultSelection.sizeLabel,
      sizeWeight: item.defaultSelection.sizeWeight,
      planId: item.defaultSelection.planId,
      planLabel: item.defaultSelection.planLabel,
      deliveryLabel: item.defaultSelection.deliveryLabel,
      deliveryCadence: item.defaultSelection.deliveryCadence,
      billingIntervalUnit: item.defaultSelection.billingIntervalUnit,
      billingIntervalCount: item.defaultSelection.billingIntervalCount,
    });
  };

  return (
    <section className="ourCollection-container">
      <div className="ourCollection-inner">
        <BreadcrumbTrail
          className="ourCollection-breadcrumb"
          items={[
            { label: "Home", href: "/" },
            { label: "Collection" },
          ]}
        />
        <h2 className="ourCollection-heading">OUR COLLECTION</h2>

        <div className="ourCollection-grid">
          {products.map((item) => (
            <NavLink
              to={item.route}
              key={item.productId}
              className="ourCollection-card group cursor-pointer block"
            >
              <WishlistButton
                productId={item.productId}
                className="absolute right-4 top-4 z-10"
              />
              <span className={`ourCollection-tag ${item.tagColor}`}>
                {item.tag}
              </span>
              {item.isOutOfStock ? (
                <span className="absolute left-4 top-14 rounded-full bg-[#FFF1EE] px-3 py-1 text-xs font-semibold text-[#A13A2C]">
                  Out of stock
                </span>
              ) : null}

              <div className="ourCollection-imageWrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="ourCollection-image group-hover:hidden"
                />
                <img
                  src={item.hoverImage}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="ourCollection-image hidden group-hover:block"
                />
              </div>

              <div className="ourCollection-rating">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="ourCollection-star">
                      *
                    </span>
                  ))}
                </div>
                <span className="ourCollection-ratingText">{item.rating}</span>
                <span className="ourCollection-review">{item.reviews} Reviews</span>
              </div>

              <h3 className="ourCollection-title">{item.title}</h3>

              <div className="ourCollection-badges">
                {item.badges.map((badge) => (
                  <span
                    key={`${item.productId}-${badge}`}
                    className="ourCollection-badge"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <p className="ourCollection-desc">{item.description}</p>

              <div className="ourCollection-priceRow">
                {item.oldPrice ? (
                  <span className="ourCollection-oldPrice">MRP {item.oldPrice}</span>
                ) : null}
                <span className="ourCollection-price">Now {item.price}</span>
                {item.discount ? (
                  <span className="ourCollection-discount">{item.discount}</span>
                ) : null}
              </div>

              <div className="ourCollection-subscribe">
                <div className="ourCollection-tick">+</div>
                <div>
                  <p className="ourCollection-subscribeTitle">{item.subscribeTitle}</p>
                  <p className="ourCollection-subscribeText">
                    MRP and current subscription price are shown together for quick comparison.
                  </p>
                </div>
              </div>

              <LoadingButton
                className="ourCollection-btn"
                onClick={(event) => {
                  if (item.isOutOfStock) {
                    event.preventDefault();
                    event.stopPropagation();
                    navigate(item.route);
                    return;
                  }

                  handleAddToCart(event, item);
                }}
                lockOnClick
                loadingText={
                  item.isOutOfStock
                    ? "Opening..."
                    : hasItem(item.cartId)
                      ? "Opening cart..."
                      : "Adding..."
                }
              >
                {item.isOutOfStock
                  ? "VIEW DETAILS"
                  : hasItem(item.cartId)
                    ? "GO TO CART"
                    : "+ ADD TO CART"}
              </LoadingButton>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCollection;
