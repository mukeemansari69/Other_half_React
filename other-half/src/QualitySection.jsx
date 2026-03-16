import React from "react";
import "/public/css/qualitySection.css";

const QualitySection = () => {

  const items = [
    { icon: "/images/q1.png", text: "Batch Tested" },
    { icon: "/images/q2.png", text: "No Artificial Colors or Flavors" },
    { icon: "/images/q3.png", text: "GMO, Hormone & Antibiotic free" },
    { icon: "/images/q4.png", text: "GMP/SQF Certified" },
    { icon: "/images/q5.png", text: "Made In USA" },
    { icon: "/images/q6.png", text: "In Line With FDA guidelines" },
  ];

  return (
    <section className="quality-section">

      <div className="quality-container">

        {items.map((item, index) => (
          <div key={index} className="quality-item">

            <img
              src={item.icon}
              alt={item.text}
              className="quality-icon"
            />

            <p className="quality-text">
              {item.text}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default QualitySection;