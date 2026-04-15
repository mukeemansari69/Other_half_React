import React from "react";
import { NavLink } from "react-router-dom";

import "/public/Default/css/FaqFooter.css";

const FaqFooter = () => {
  return (
    <section className="FaqFooter-container">
      <div className="FaqFooter-bg">
        <div className="FaqFooter-overlay">
          <div className="FaqFooter-content">
            <h2 className="FaqFooter-heading">Contact Our PetPlus Product Experts</h2>

            <p className="FaqFooter-subtext">
              We&apos;re here to help you and your furry friend. Whether you have
              questions about our products or need guidance, feel free to reach
              out anytime. Your dog deserves the best care possible.
            </p>

            <NavLink to="/contact" className="FaqFooter-btn">
              CONTACT US
            </NavLink>
          </div>
        </div>
      </div>

      <div className="FaqFooter-bottom">
        <p>
          See for yourself how convenient PetPlus can be and{" "}
          <NavLink to="/login" className="FaqFooter-link">
            sign up
          </NavLink>{" "}
          for a subscription today!
        </p>
      </div>
    </section>
  );
};

export default FaqFooter;
