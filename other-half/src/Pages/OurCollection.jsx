import React from "react";
import "/public/Default/css/ourCollection.css"
const products = [
  {
    id: 1,
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
  },
  {
    id: 2,
    tag: "New Release",
    tagColor: "bg-blue-500",
    image: "/public/Default/images/col2.png",
    hoverImage: "/public/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    title: "Doggie Dental Powder",
    badges: ["Bad breath", "Plaque & Tartar Control", "Keep Teeth Clean"],
    desc: "Doggie Dental™ is a breakthrough oral health powder...",
    price: "$39.99",
    oldPrice: "$42.00",
    discount: "15% OFF",
  },
  {
    id: 3,
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
  },
];

const OurCollection = () => {
  return (
    <section className="ourCollection-container">
      <div className="ourCollection-inner">

        {/* Heading */}
        <h2 className="ourCollection-heading">
          OUR COLLECTION
        </h2>

        {/* Cards */}
        <div className="ourCollection-grid">
          {products.map((item) => (
            <div key={item.id} className="ourCollection-card group">

              {/* TAG */}
              <span className={`ourCollection-tag ${item.tagColor}`}>
                {item.tag}
              </span>

              {/* IMAGE */}
              <div className="ourCollection-imageWrapper">
                <img
                  src={item.image}
                  alt=""
                  className="ourCollection-image group-hover:hidden"
                />
                <img
                  src={item.hoverImage}
                  alt=""
                  className="ourCollection-image hidden group-hover:block"
                />
              </div>

              {/* RATING */}
              <div className="ourCollection-rating">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="ourCollection-star">★</span>
                  ))}
                </div>
                <span className="ourCollection-ratingText">
                  {item.rating}
                </span>
                <span className="ourCollection-review">
                  {item.reviews} Reviews
                </span>
              </div>

              {/* TITLE */}
              <h3 className="ourCollection-title">
                {item.title}
              </h3>

              {/* BADGES */}
              <div className="ourCollection-badges">
                {item.badges.map((b, i) => (
                  <span key={i} className="ourCollection-badge">
                    {b}
                  </span>
                ))}
              </div>

              {/* DESC */}
              <p className="ourCollection-desc">
                {item.desc}
              </p>

              {/* PRICE */}
              <div className="ourCollection-priceRow">
                <span className="ourCollection-price">{item.price}</span>
                <span className="ourCollection-oldPrice">{item.oldPrice}</span>
                <span className="ourCollection-discount">
                  {item.discount}
                </span>
              </div>

              {/* SUBSCRIBE BOX */}
              <div className="ourCollection-subscribe">
                <div className="ourCollection-tick">✔</div>
                <div>
                  <p className="ourCollection-subscribeTitle">
                    Subscribe & Save 20%
                  </p>
                  <p className="ourCollection-subscribeText">
                    Shipped every 3 months
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button className="ourCollection-btn">
                + ADD TO CART
              </button>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCollection;