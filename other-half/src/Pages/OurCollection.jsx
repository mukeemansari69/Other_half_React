import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "/public/Default/css/ourCollection.css";
import { useCart } from "../context/CartContext.jsx";
import { collectionCards } from "../../shared/storeCatalog.js";
import { formatStoreCurrency } from "../../shared/storefrontConfig.js";

const products = collectionCards.map((item) => ({
  ...item,
  price: formatStoreCurrency(item.startingPrice),
  oldPrice: formatStoreCurrency(item.startingPrice * 1.15),
  discount: "15% OFF",
  cartId: `collection-${item.productId}`,
  cartImage: item.image,
  unitPrice: item.startingPrice,
  cartDescription: `${item.defaultSelection.sizeLabel} (${item.defaultSelection.sizeWeight}) | ${item.defaultSelection.planLabel}`,
}));

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
      sizeId: item.defaultSelection.sizeId,
      sizeLabel: item.defaultSelection.sizeLabel,
      sizeWeight: item.defaultSelection.sizeWeight,
      planId: item.defaultSelection.planId,
      planLabel: item.defaultSelection.planLabel,
    });
  };

  return (
    <section className="ourCollection-container">
      <div className="ourCollection-inner">
        <h2 className="ourCollection-heading">OUR COLLECTION</h2>

        <div className="ourCollection-grid">
          {products.map((item) => (
            <NavLink
              to={item.route}
              key={item.productId}
              className="ourCollection-card group cursor-pointer block"
            >
              <span className={`ourCollection-tag ${item.tagColor}`}>
                {item.tag}
              </span>

              <div className="ourCollection-imageWrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="ourCollection-image group-hover:hidden"
                />
                <img
                  src={item.hoverImage}
                  alt={item.title}
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
                <span className="ourCollection-price">{item.price}</span>
                <span className="ourCollection-oldPrice">{item.oldPrice}</span>
                <span className="ourCollection-discount">{item.discount}</span>
              </div>

              <div className="ourCollection-subscribe">
                <div className="ourCollection-tick">+</div>
                <div>
                  <p className="ourCollection-subscribeTitle">Subscribe & Save 20%</p>
                  <p className="ourCollection-subscribeText">
                    Delivered on your selected plan
                  </p>
                </div>
              </div>

              <button
                className="ourCollection-btn"
                onClick={(event) => handleAddToCart(event, item)}
              >
                {hasItem(item.cartId) ? "GO TO CART" : "+ ADD TO CART"}
              </button>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCollection;
