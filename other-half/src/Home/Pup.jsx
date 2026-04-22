import React from "react";
import { NavLink } from "react-router-dom";

import "/public/Home/css/pup.css";
import { collectionCards } from "../../shared/storeCatalog.js";
import { formatStoreCurrency } from "../../shared/storefrontConfig.js";

const products = collectionCards.slice(0, 3).map((product) => ({
  img: product.image,
  title: product.title,
  price: formatStoreCurrency(product.displayPrice),
  old: product.displayCompareAtPrice
    ? formatStoreCurrency(product.displayCompareAtPrice)
    : "",
  link: product.route,
  tags: product.badges,
}));

export default function Pup() {
  return (
    <section className="w-full py-[36px] lg:py-[80px]">
      <div className="max-w-[1920px] mx-auto">
        <h2 className="pup-heading">YOUR PUP WILL LOVE THESE</h2>

        <div className="hidden lg:grid grid-cols-3 gap-6 max-w-[1440px] mx-auto mt-12 px-10">
          {products.map((product) => (
            <NavLink
              to={product.link}
              key={product.title}
              className="pup-card cursor-pointer block"
            >
              <img src={product.img} alt="" loading="lazy" decoding="async" className="pup-image" />

              <div className="pup-text">
                <div className="flex justify-center flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="pup-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="pup-title">{product.title}</h3>

                <div className="pup-rating">
                  5.0 <span className="ml-2">Verified dog parents</span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        <div className="flex lg:hidden pup-slider mt-8">
          {products.map((product) => (
            <NavLink
              to={product.link}
              key={product.title}
              className="pup-card-mobile cursor-pointer block"
            >
              <img src={product.img} alt="" loading="lazy" decoding="async" className="pup-image-mobile" />

              <div className="pup-text-mobile">
                <div className="flex justify-center flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="pup-tag-mobile">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="pup-title-mobile">{product.title}</h3>

                <div className="pup-rating-mobile">
                  5.0 <span>Trusted picks</span>
                </div>
              </div>

              <div className="pup-price-row">
                <div>
                  {product.old ? <span className="pup-old">{product.old}</span> : null}
                  <span className="pup-price">{product.price}</span>
                </div>

                <button className="pup-arrow">+</button>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}
