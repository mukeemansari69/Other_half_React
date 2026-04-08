import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "/public/Default/css/ourCollection.css";
import { useCart } from "../context/CartContext.jsx";

const products = [
  {
    id: 1,
    link: "/product",
    tag: "Best Seller",
    tagColor: "bg-orange-500",
    image: "/public/Default/images/col1.png",
    hoverImage: "/public/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    title: "Everyday Daily Multivitamin",
    badges: ["Immunity Boost", "Digestive health", "Overall Wellness"],
    desc: "45 high-quality ingredients in every scoop...",
    price: "$54.00",
    oldPrice: "$54.00",
    discount: "15% OFF",
    cartId: "collection-everyday",
    productId: "everyday-one",
    cartImage: "/Default/images/col1.png",
    unitPrice: 54,
    cartDescription: "Everyday routine | Standard plan",
  },
  {
    id: 2,
    link: "/doggie-dental",
    tag: "New Release",
    tagColor: "bg-blue-500",
    image: "/public/Default/images/col2.png",
    hoverImage: "/public/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    title: "Doggie Dental Powder",
    badges: ["Bad breath", "Plaque & Tartar Control", "Keep Teeth Clean"],
    desc: "Doggie Dental is a breakthrough oral health powder...",
    price: "$39.99",
    oldPrice: "$42.00",
    discount: "15% OFF",
    cartId: "collection-dental",
    productId: "doggie-dental",
    cartImage: "/Default/images/col2.png",
    unitPrice: 39.99,
    cartDescription: "Dental support | Standard plan",
  },
  {
    id: 3,
    link: "/dailyduo",
    tag: "Bundle & Save",
    tagColor: "bg-pink-600",
    image: "/public/Default/images/col3.png",
    hoverImage: "/public/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    title: "Daily Duo Bundle",
    badges: ["Immunity Boost", "Digestive health", "Overall Wellness"],
    desc: "Meet the Daily Duo Bundle...",
    price: "$71.98",
    oldPrice: "$77.00",
    discount: "15% OFF",
    cartId: "collection-daily-duo",
    productId: "daily-duo",
    cartImage: "/Default/images/col3.png",
    unitPrice: 71.98,
    cartDescription: "Daily Duo bundle | Standard plan",
  },
];

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
    });
  };

  return (
    <section className="ourCollection-container">
      <div className="ourCollection-inner">
        <h2 className="ourCollection-heading">OUR COLLECTION</h2>

        <div className="ourCollection-grid">
          {products.map((item) => (
            <NavLink
              to={item.link}
              key={item.id}
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
                  <span key={`${item.id}-${badge}`} className="ourCollection-badge">
                    {badge}
                  </span>
                ))}
              </div>

              <p className="ourCollection-desc">{item.desc}</p>

              <div className="ourCollection-priceRow">
                <span className="ourCollection-price">{item.price}</span>
                <span className="ourCollection-oldPrice">{item.oldPrice}</span>
                <span className="ourCollection-discount">{item.discount}</span>
              </div>

              <div className="ourCollection-subscribe">
                <div className="ourCollection-tick">+</div>
                <div>
                  <p className="ourCollection-subscribeTitle">Subscribe & Save 20%</p>
                  <p className="ourCollection-subscribeText">Shipped every 3 months</p>
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
