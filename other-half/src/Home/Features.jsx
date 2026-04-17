import React from "react";
import "/public/Home/css/features.css";

const Features = () => {
  const data = [
    {
      img: "/Home/images/f1.png",
      title: "Vet-Approved",
      desc: "Formulated by professionals who speak fluent “woof.”",
    },
    {
      img: "/Home/images/f2.png",
      title: "Clinically Tested",
      desc: "Real science. Real studies. Real tail-wagging results.",
    },
    {
      img: "/Home/images/f3.png",
      title: "Human-Grade Ingredients",
      desc: "Clean, simple, and effective—nothing you wouldn’t want in your own food.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {data.map((item, index) => (
          <div key={index} className="feature-card">
            <img src={item.img} alt={item.title} loading="lazy" decoding="async" className="feature-icon" />

            <h3 className="feature-title">{item.title}</h3>

            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

