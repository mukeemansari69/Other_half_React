import React from "react";
import "/public/OurStory/css/nextstep.css"; 


const NextStep = () => {
  return (
    <section className="nextstep">
      <div className="nextstep-wrapper">
        
        {/* LEFT CONTENT */}
        <div className="nextstep-left">
          <div className="nextstep-content">

            {/* Heading */}
            <h2 className="nextstep-heading">
              OUR NEXT STEP!
            </h2>

            {/* Image (mobile placement) */}
            <div className="nextstep-image mobile-only">
              <img src="/OurStory/images/nextstep.webp" alt="dog" loading="lazy" decoding="async" />
            </div>

            {/* Subtext */}
            <p className="nextstep-subtext">
              We created PetPlus because our dogs needed more than empty promises —
              and so did yours. Coming soon:
            </p>

            {/* Points */}
            <ul className="nextstep-list">
              <li >Personalized wellness plans</li>
              <li>Smarter tracking tools</li>
              <li>More delicious ways to deliver daily care</li>
            </ul>

            {/* Green Box */}
            <div className="nextstep-box">
             <div className="nextstep-box-text"> BUT OUR MISSION WILL ALWAYS STAY THE SAME:
              HELP DOGS LIVE LONGER, HEALTHIER, HAPPIER LIVES — WITHOUT THE GUESSWORK.</div>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE (desktop) */}
        <div className="nextstep-image desktop-only">
          <img src="/OurStory/images/nextstep.webp" alt="dog" loading="lazy" decoding="async" />
        </div>

      </div>
    </section>
  );
};

export default NextStep;

