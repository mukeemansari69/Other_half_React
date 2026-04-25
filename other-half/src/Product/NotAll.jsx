
// NotAll.jsx
import React from "react";
import "/public/Product/css/NotAll.css";

const features = [
  "45 Active Ingredients",
  "Irresistible Taste for Dogs",
  "Human-Grade Quality",
  "Clean and Consciously Formulated",
  "Absolutely No Fillers",
];

const NotAll = () => {
  return (
    <section className="notall-container flex flex-col items-center">
      <div className="notall-header">
        <h2 className="notall-heading">
          NOT ALL SCOOPS ARE CREATED EQUAL
        </h2>
        <p className="notall-subtext">
          We brought receipts. They brought... well, not much.
        </p>
      </div>

      <div className="notall-content flex justify-center items-center">
        {/* GREEN BACKGROUND BOX */}
        <div className="notall-center-box flex flex-col items-center">
          <img
            src="/Product/images/logo.webp"
            alt="logo"
            loading="lazy"
            decoding="async"
            className="notall-logo"
          />
        </div>

        {/* LIST */}
        <div className="notall-list">
          <div className="notall-brand-name">Other
Brands</div>
          {features.map((item, index) => (
            <div
              key={index}
              className={`notall-row ${index % 2 === 0 ? "alt" : ""}`}
            >
              <span className="notall-text">{item}</span>

              {/* CENTER CHECK */}
              <img
                src="/Product/images/right.webp"
                alt="check"
                loading="lazy"
                decoding="async"
                className="notall-check-center"
              />

              {/* RIGHT CROSS */}
              <img
                src="/Product/images/cross.webp"
                alt="cross"
                loading="lazy"
                decoding="async"
                className="notall-cross"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotAll;




