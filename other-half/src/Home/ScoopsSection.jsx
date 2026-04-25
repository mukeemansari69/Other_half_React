import React, { useState } from "react";
import "/public/Home/css/ScoopsSeaction.css";

const data = [
  {
    title: "Hip & Joint Support",
    text: "Keep those zoomies pain-free—joints that jump for joy!",
    img: "/Home/images/d1.webp",
  },
  {
    title: "Digestive Health",
    text: "Supports smooth digestion for your pup.",
    img: "/Home/images/d2.webp",
  },
  {
    title: "Allergy Support",
    text: "Helps reduce common allergy symptoms.",
    img: "/Home/images/d3.webp",
  },
  {
    title: "Healthy Aging",
    text: "Nutrients that support senior dogs.",
    img: "/Home/images/d4.webp",
  },
  {
    title: "Immunity Boost",
    text: "Boost your dog’s natural defenses.",
    img: "/Home/images/d5.webp",
  },
  {
    title: "Dental Delight",
    text: "Supports teeth and gum health.",
    img: "/Home/images/d6.webp",
  },
];

export default function ScoopsSection() {
  const [active, setActive] = useState(0);

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

