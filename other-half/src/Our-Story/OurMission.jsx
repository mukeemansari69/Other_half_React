import React from "react";

import "/public/OurStory/css/OurMission.css";


const OurMission = () => {

  const items = [
    { icon: "/Home/images/q1.png", text: "Batch Tested" },
    { icon: "/Home/images/q2.png", text: "No Artificial Colors or Flavors" },
    { icon: "/Home/images/q3.png", text: "GMO, Hormone & Antibiotic free" },
    { icon: "/Home/images/q4.png", text: "GMP/SQF Certified" },
    { icon: "/Home/images/q5.png", text: "Made In USA" },
    { icon: "/Home/images/q6.png", text: "In Line With FDA guidelines" },
  ];

  return (
    <section className="ourMission-section">

      {/* TOP CONTENT */}
      <div className="ourMission-top">
        <h2 className="ourMission-title">OUR MISSION</h2>

        <p className="ourMission-subtext">
          We're turning unconditional love into uncomplicated care.
          <br className="ourmission-br"/>
          Our products make dog wellness easy, effective, and actually enjoyable — 
          so your dog stays healthy, and you stay stress-free.
         <br className="ourmission-br"/>
          Created by a team of pet scientists, vets, and obsessive dog parents, 
          our formulas are:
        </p>
      </div>

      {/* ICONS */}
      <div className="ourMission-container">
        {items.map((item, index) => (
          <div key={index} className="ourMission-item">

            <img
              src={item.icon}
              alt={item.text}
              className="ourMission-icon"
            />

            <p className="ourMission-text">
              {item.text}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default OurMission;