import React from "react";
import "/public/Default/css/FaqFooter.css";
import { NavLink } from "react-router-dom";

const FaqFooter = () => {
  return (
    <section className="FaqFooter-container">

      {/* BACKGROUND */}
      <div className="FaqFooter-bg">

        {/* OVERLAY */}
        <div className="FaqFooter-overlay">

          {/* CONTENT */}
          <div className="FaqFooter-content">

            {/* TEXT */}
            <h2 className="FaqFooter-heading">
              Contact Our Other Half Products Experts
            </h2>

            <p className="FaqFooter-subtext">
              We’re here to help you and your furry friend. Whether you have
              questions about our product or need guidance, feel free to reach
              out to us anytime. Your dog deserves the best care possible.
            </p>

            {/* BUTTON */}
           <NavLink to="/contact" className="FaqFooter-btn">
               <a >
              CONTACT US
            </a>
            </NavLink>
         
          </div>
          
        </div>
        
      </div>
 {/* BOTTOM LINE */}
      <div className="FaqFooter-bottom">
        <p>
          See for yourself how convenient otherhalf can be and{" "}
          <NavLink to="/login" className="FaqFooter-link">
sign up
            </NavLink>
          
          {" "}
          for a subscription today!
        </p>
      </div>
     

    </section>
  );
};

export default FaqFooter;

