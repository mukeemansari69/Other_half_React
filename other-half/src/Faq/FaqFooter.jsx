import React from "react";
import "/public/Default/css/FaqFooter.css";

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
            <a href="#" className="FaqFooter-btn">
              CONTACT US
            </a>
         
          </div>
          
        </div>
        
      </div>
 {/* BOTTOM LINE */}
      <div className="FaqFooter-bottom">
        <p>
          See for yourself how convenient otherhalf can be and{" "}
          <a href="#" className="FaqFooter-link">
            sign up
          </a>{" "}
          for a subscription today!
        </p>
      </div>
     

    </section>
  );
};

export default FaqFooter;