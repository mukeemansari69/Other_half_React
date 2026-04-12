import React from "react";
import "/public/Default/css/FaqBanner.css";

const FaqBanner = () => {
  return (
    <section className="FaqBanner-container">

      {/* Background Image */}
      <div className="FaqBanner-bg">

        {/* Overlay */}
        <div className="FaqBanner-overlay">

          {/* Content Container */}
          <div className="FaqBanner-content">

            {/* Heading */}
            <h1 className="FaqBanner-heading">
              Everything You Need To Know About Our Products
            </h1>

            {/* Sub Text */}
            <p className="FaqBanner-subtext">
              We believe in transparency and care. Our products are designed to 
              support your dog’s health with natural ingredients and proven results. 
              Explore the most frequently asked questions below.
            </p>

          </div>
        </div>
      </div>

    </section>
  );
};

export default FaqBanner;

