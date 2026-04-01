// Obsess.jsx
import React, { useState } from "react";
import "./obsess.css";

const data = [
  {
    id: 1,
    question: "We Manufacture in a cGMP Certified Facility",
    answer:
      "All our products are manufactured in certified facilities ensuring the highest quality standards and safety for your pets.",
  },
  {
    id: 2,
    question: "We Make Everything in the USA",
    answer:
      "Every product is proudly made in the USA with strict quality control and premium sourcing standards.",
  },
];

const Obsess = () => {
  const [active, setActive] = useState(null);

  const toggle = (id) => {
    setActive(active === id ? null : id);
  };

  return (
    <section className="obsess-container flex flex-col md:flex-row">
        <div className="obsess-content w-full md:w-1/2">
        <div className="obsess-inner">

          <h2 className="obsess-heading">
            & WE OBSESS OVER HOW IT’S MADE
          </h2>

          <p className="obsess-subtext">
            Before a single scoop hits your dog’s bowl, we’ve already obsessed over every part of the process — from sourcing ingredients to scaling the tub. We don’t believe in “good enough.” We believe in pharma-grade precision, full transparency, and doing things the right way.
          </p>

          <div className="obsess-accordion">
            {data.map((item) => (
              <div key={item.id}>

                {/* QUESTION */}
                <div
                  className={`obsess-question ${
                    active === item.id ? "active" : ""
                  }`}
                  onClick={() => toggle(item.id)}
                >
                  <span>{item.question}</span>

                  <div className="obsess-icon">
                    {active === item.id ? "-" : "+"}
                  </div>
                </div>

                {/* ANSWER */}
                {active === item.id && (
                  <div className="obsess-answer">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
      {/* IMAGE */}
      <div className="obsess-image-wrapper w-full md:w-1/2">
        <img
          src="\public\Integrity\images\dogi-img.jpg"
          alt="product"
          className="obsess-image"
        />
      </div>

      
     
    </section>
  );
};

export default Obsess;