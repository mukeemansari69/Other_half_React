import React from "react";
import { NavLink } from "react-router-dom";
import "/public/Home/css/pup.css";

export default function Pup() {

  const products = [
    {
      img: "/Home/images/p1.png",
      title: "Everyday Daily Multivitamin",
      price: "$99.99",
      old: "$69.99",
      link: "/product",
      tags: ["Immunity Boost", "Digestive health", "Overall Wellness"]
    },
    {
      img: "/Home/images/p2.png",
      title: "Doggie Dental Powder",
      price: "$99.99",
      old: "$69.99",
      link: "/doggie-dental",
      tags: ["Dental Care", "Overall Wellness"]
    },
    {
      img: "/Home/images/p3.png",
      title: "Daily Duo Bundle",
      price: "$99.99",
      old: "$69.99",
      link: "/dailyduo",
      tags: ["Immunity Boost", "Digestive health", "Overall Wellness"]
    }
  ];

  return (
    <section className="w-full py-[36px] lg:py-[80px]">
      <div className="max-w-[1920px] mx-auto">

        {/* Heading */}
        <h2 className="pup-heading">
          YOUR PUP WILL LOVE THESE
        </h2>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-6 max-w-[1440px] mx-auto mt-12 px-10">

          {products.map((p, i) => (
            <NavLink
              to={p.link}
              key={i}
              className="pup-card cursor-pointer block"
            >

              <img src={p.img} alt="" className="pup-image"/>

              <div className="pup-text">

                <div className="flex justify-center flex-wrap gap-2">
                  {p.tags.map((tag,index)=>(
                    <span key={index} className="pup-tag">{tag}</span>
                  ))}
                </div>

                <h3 className="pup-title">{p.title}</h3>

                <div className="pup-rating">
                  ★★★★★
                  <span className="ml-2">4.9 (121)</span>
                </div>

              </div>

            </NavLink>
          ))}

        </div>

        {/* Mobile Slider */}
        <div className="flex lg:hidden pup-slider mt-8">

          {products.map((p, i) => (
            <NavLink
              to={p.link}
              key={i}
              className="pup-card-mobile cursor-pointer block"
            >

              <img src={p.img} alt="" className="pup-image-mobile"/>

              <div className="pup-text-mobile">

                <div className="flex justify-center flex-wrap gap-1">
                  {p.tags.slice(0,3).map((tag,index)=>(
                    <span key={index} className="pup-tag-mobile">{tag}</span>
                  ))}
                </div>

                <h3 className="pup-title-mobile">
                  {p.title}
                </h3>

                <div className="pup-rating-mobile">
                  ★★★★★ <span>4.9 (121)</span>
                </div>

              </div>

              <div className="pup-price-row">

                <div>
                  <span className="pup-price">{p.price}</span>
                  <span className="pup-old">{p.old}</span>
                </div>

                <button className="pup-arrow">
                  →
                </button>

              </div>

            </NavLink>
          ))}

        </div>

      </div>
    </section>
  );
}

