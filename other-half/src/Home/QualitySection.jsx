import React from "react";
import "/public/Home/css/qualitySection.css";
import { getImagePerformanceProps } from "../utils/imagePerformance.js";

const QualitySection = () => {

  const items = [
    { icon: "/Home/images/q1.webp", text: "Batch Tested" },
    { icon: "/Home/images/q2.webp", text: "No Artificial Colors or Flavors" },
    { icon: "/Home/images/q3.webp", text: "GMO, Hormone & Antibiotic free" },
    { icon: "/Home/images/q4.webp", text: "GMP/SQF Certified" },
    { icon: "/Home/images/q5.webp", text: "Made In USA" },
    { icon: "/Home/images/q6.webp", text: "In Line With FDA guidelines" },
  ];

  return (
    <section className="quality-section">

      <div className="quality-container">

        {items.map((item, index) => (
          <div key={index} className="quality-item">

            <img
              {...getImagePerformanceProps(item.icon)}
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

