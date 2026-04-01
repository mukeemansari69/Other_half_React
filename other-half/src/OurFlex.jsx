import React from "react";
import "./ourFlex.css";

const OurFlex = () => {
  return (
    <section className="ourFlex-section">
      <div className="ourFlex-container">

        {/* LEFT IMAGE */}
        <div className="ourFlex-imageWrapper">
          <img
            src="/public/Integrity/images/dogi.png"
            alt="dog"
            className="ourFlex-image"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="ourFlex-content">

          <h2 className="ourFlex-heading">
            INGREDIENT INTEGRITY ISN’T <br className="ourflex-br"/>
            OUR FLEX — IT’S OUR BASELINE
          </h2>

          {/* Image for mobile (between heading & text) */}
          <div className="ourFlex-imageWrapper ourFlex-mobileImage">
            <img
              src="/public/Integrity/images/dogi.png"
              alt="dog"
              className="ourFlex-image"
            />
          </div>

          <p className="ourFlex-text">
            We started Other Half because our own dogs were being let down by lazy
            formulas and low standards. Now? Every scoop we send out is our way of saying:
            <br />
            <span className="ourFlex-bold">“We got this.”</span>
            <br />
            (So you can go back to being the fun parent, not the worried one.)
          </p>

          <div className="ourFlex-buttons">
            <button className="ourFlex-btn ourFlex-btnPrimary">
              TAKE THE QUIZ
            </button>

            <button className="ourFlex-btn ourFlex-btnSecondary">
              EXPLORE OUR INGREDIENTS GLOSSARY
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurFlex;