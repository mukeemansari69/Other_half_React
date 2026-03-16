import React, { useState } from "react";
import "/public/css/ScoopsSeaction.css";

const data = [
  {
    title: "Hip & Joint Support",
    text: "Keep those zoomies pain-free—joints that jump for joy!",
    img: "/images/d1.jpg",
  },
  {
    title: "Digestive Health",
    text: "Supports smooth digestion for your pup.",
    img: "/images/d2.jpg",
  },
  {
    title: "Allergy Support",
    text: "Helps reduce common allergy symptoms.",
    img: "/images/d3.jpg",
  },
  {
    title: "Healthy Aging",
    text: "Nutrients that support senior dogs.",
    img: "/images/d4.jpg",
  },
  {
    title: "Immunity Boost",
    text: "Boost your dog’s natural defenses.",
    img: "/images/d5.jpg",
  },
  {
    title: "Dental Delight",
    text: "Supports teeth and gum health.",
    img: "/images/d6.jpg",
  },
];

export default function ScoopsSection() {
  const [active, setActive] = useState(null);

  const toggle = (i) => {
    setActive(active === i ? null : i);
  };

  return (
    <section className="scoops-section">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="heading">SCOOPS. SNOUTS. CHAOS</h2>

        <p className="subheading">
          Support built for whatever your dog throws (or chews):
        </p>

        <div className="circle-grid">

          {data.map((item, i) => (
            <div key={i} className="circle-wrapper">

              <div
                onClick={() => toggle(i)}
                className={`circle ${active === i ? "active" : ""}`}
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <span className="circle-text">{item.title}</span>

                <div className={`plus ${active === i ? "close" : ""}`}>
                  +
                </div>

                {active === i && (
                  <div className="info-box">
                    {item.text}
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}