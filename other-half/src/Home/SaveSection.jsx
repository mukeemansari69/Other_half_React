import React from "react";
import "/public/Home/css/saveSection.css";
import { NavLink } from "react-router-dom";

const SaveSection = () => {

  const data = [
    {
      img: "/Home/images/save1.png",
      title: "Save up to 18%",
      desc: "Tail-wagging wellness on autopilot — and more $$ in your pocket.",
    },
    {
      img: "/Home/images/save2.png",
      title: "Free Shipping",
      desc: "No fetching required. We bring the good stuff straight to your door.",
    },
    {
      img: "/Home/images/save3.png",
      title: "Surprise Gifts",
      desc: "Bonus treats? Toys? Only the good kind of surprises.",
    },
  ];

  return (
    <section className="save-section">

      <h2 className="save-heading">
        SUBSCRIBE & SAVE
      </h2>

      <div className="save-container">

        {data.map((item, index) => (

          <div key={index} className="save-card">

            <div className="save-icon-circle">
              <img src={item.img} alt={item.title} />
            </div>

            <h3 className="save-title">
              {item.title}
            </h3>

            <p className="save-desc">
              {item.desc}
            </p>

          </div>

        ))}

      </div>

      <div className="save-btn-wrapper">
  <NavLink to="/collection" className="block">
    <button className="subscribe-btn ">
      SUBSCRIBE & SAVE
    </button>
  </NavLink>
</div>

    </section>
  );
};

export default SaveSection;

