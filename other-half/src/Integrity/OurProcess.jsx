// OurProcess.jsx
import React from "react";
import "/public/Integrity/css/ourProcess.css";

const processData = [
  {
    id: "01",
    icon: "/Integrity/images/searchicon.png",
    title: "We Research. A Lot.",
    desc: "Science journals, clinical studies, vet consults. We don’t guess — we geek out.",
  },
  {
    id: "02",
    icon: "/Integrity/images/formulate.png",
    title: "We Formulate With Intention.",
    desc: "Every nutrient is dosed with a purpose — not tossed in to pad a label.",
  },
  {
    id: "03",
    icon: "/Integrity/images/proud-icon.png",
    title: "We Produce Safely.",
    desc: "cGMP certified, third-party tested, and quality-checked to the last scoop.",
  },
  {
    id: "04",
    icon: "/Integrity/images/launchicon.png",
    title: "We Don’t Launch It Unless It’s Legit.",
    desc: "If our dogs won’t eat it, and yours won’t benefit? We don’t sell it.",
  },
];

const OurProcess = () => {
  return (
    <section className="ourProcess-section">
      <div className="ourProcess-container">

        {/* Heading */}
        <div className="ourProcess-header text-center">
          <p className="ourProcess-subtitle">OUR PROCESS</p>
          <h2 className="ourProcess-title">
            WE BUILD EACH FORMULA WITH CARE
          </h2>
        </div>

        {/* DESKTOP */}
        <div className="ourProcess-desktop">

          {/* top row */}
          <div className="ourProcess-row ourProcess-row-top">
            {processData.slice(0, 2).map((item, index) => (
              <div key={index} className="ourProcess-card">
                <img src={item.icon} alt="icon" className="ourProcess-icon" />
                <h3 className="ourProcess-card-title">{item.title}</h3>
                <p className="ourProcess-card-desc">{item.desc}</p>
                <span className="ourProcess-number">{item.id}</span>
              </div>
            ))}
          </div>

          {/* middle dashed line */}
          <div className="ourProcess-line" />

          {/* bottom row */}
          <div className="ourProcess-row ourProcess-row-bottom">
            {processData.slice(2).map((item, index) => (
              <div key={index} className="ourProcess-card">
                <img src={item.icon} alt="icon" className="ourProcess-icon" />
                <h3 className="ourProcess-card-title">{item.title}</h3>
                <p className="ourProcess-card-desc">{item.desc}</p>
                <span className="ourProcess-number">{item.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <div className="ourProcess-mobile">
          {processData.map((item, index) => (
            <div key={index} className="ourProcess-mobile-card">
              <img src={item.icon} alt="icon" className="ourProcess-icon" />
              <h3 className="ourProcess-card-title">{item.title}</h3>
              <p className="ourProcess-card-desc">{item.desc}</p>
              <span className="ourProcess-number">{item.id}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurProcess;






