import React from "react";
import "/public/OurStory/css/HowIt.css";


const HowIt = () => {
  return (
    <section className="howit-container">

      {/* ================= DESKTOP ================= */}
      <div className="howit-desktop">

        {/* LEFT TEXT */}
        <div className="howit-text">

          <p className="howit-label">• HOW IT STARTED</p>

          <h2 className="howit-heading">
            IT ALL BEGAN WITH A DOG NAMED OGGIE
          </h2>

          <p className="howit-para">
            Oggie was the kind of dog who left hair on everything and paw prints
            on your heart. He was goofy, loyal, a little dramatic — and always
            struggling with something: itchy skin, a sensitive stomach, joint
            stiffness, and breath that could clear a room.
          </p>

          <p className="howit-para">
            His humans (aka our founders) tried everything: premium foods,
            hyped-up chews, supplements with mystery ingredients. Nothing
            worked. So, like any good dog parent, they got a little obsessed.
            They dove into research, talked to vets, read every label, and asked
            a big question:
          </p>

          <div className="howit-quote">
            “What if dog health was built from scratch — with purpose, not profit?”
          </div>

          <p className="howit-para">
            The answer? Real ingredients. Real results. A daily scoop that
            actually makes a difference. <br></br> And just like that, Other Half was born.
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="howit-image-wrapper">
          <img
            src="/OurStory/images/howit.jpg"
            alt="dog"
            className="howit-image"
          />
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="howit-mobile">

        <p className="howit-label">• HOW IT STARTED</p>

        <h2 className="howit-heading mobile-center">
          IT ALL BEGAN WITH A DOG NAMED OGGIE
        </h2>

        <img
          src="/OurStory/images/howit.jpg"
          alt="dog"
          className="howit-image mobile-img"
        />

        <p className="howit-para mobile-text">
          Oggie was the kind of dog who left hair on everything and paw prints
          on your heart. He was goofy, loyal, a little dramatic — and always
          struggling with something: itchy skin, a sensitive stomach, joint
          stiffness, and breath that could clear a room.
        </p>

        <p className="howit-para mobile-text">
          His humans (aka our founders) tried everything: premium foods,
          hyped-up chews, supplements with mystery ingredients. Nothing worked.
          So, like any good dog parent, they got a little obsessed.
        </p>

        <div className="howit-quote mobile-quote">
          “What if dog health was built from scratch — with purpose, not profit?”
        </div>

        <p className="howit-para mobile-text">
          The answer? Real ingredients. Real results. A daily scoop that actually
          makes a difference.
        </p>

      </div>

    </section>
  );
};

export default HowIt;


