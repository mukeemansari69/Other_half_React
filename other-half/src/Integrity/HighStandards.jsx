import React from "react";
import "/public/Integrity/css/highstandards.css";

const HighStandards = () => {
  return (
    <section className="highstandards-section flex items-center justify-center">
      <div className="highstandards-container flex flex-col md:flex-row">
        
        {/* Left Heading */}
        <div className="highstandards-left">
          <h2 className="highstandards-heading">
            IT’S OK TO HAVE <br /> HIGH STANDARDS
          </h2>
        </div>

        {/* Right Text */}
        <div className="highstandards-right">
          <p className="highstandards-text">
            We’re Not Here to Play Fetch With Standards. In a pet supplement
            world filled with mystery powders and marketing fluff, we said,
            “Hard pass.” Here’s how we’re raising the bar (and a few tails):
          </p>
        </div>

      </div>
    </section>
  );
};

export default HighStandards;

