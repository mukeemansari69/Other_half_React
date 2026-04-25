import React from "react";
import "/public/Integrity/css/highstandardsfeature.css";


const features = [
  {
    title: "100% Human-Grade",
    text: "Yep, your dog’s supplements are made with ingredients you’d find in your own pantry.",
    icon: "/Integrity/images/sf-1.webp",
  },
  {
    title: "No Fillers, Ever",
    text: "If it doesn’t serve your dog’s health, it’s cut. Ruthlessly.",
    icon: "/Integrity/images/sf2.webp",
  },
  {
    title: "Vet-Approved, Science-Obsessed",
    text: "Every product is built with vet input, not boardroom buzzwords.",
    icon: "/Integrity/images/sf3.webp",
  },
  {
    title: "No Fake Flavors, Colors, or Junk",
    text: "No ‘bacon dust.’ No ‘beef essence.’ Just real ingredients. The way it should be.",
    icon: "/Integrity/images/sf4.webp",
  },
];

const HighStandardsFeature = () => {
  return (
    <section className="highstandardsfeature-section">
         {/* LEFT DOG */}
        <div className="highstandardsfeature-dog relative">
          <img
            src="/Integrity/images/snooz-dog.webp"
            alt="dog"
            loading="lazy"
            decoding="async"
            className="highstandardsfeature-dogimg"
          />
          <img
            src="/Integrity/images/snooz.webp"
            alt="zzz"
            loading="lazy"
            decoding="async"
            className="highstandardsfeature-snooze"
          />
        </div>
      
      <div className="highstandardsfeature-wrapper flex">

       

        {/* RIGHT CONTENT */}
        <div className="highstandardsfeature-content">

          {/* ROW 1 */}
          <div className="highstandardsfeature-row flex">
            <div className="highstandardsfeature-empty"></div>

            <div className="highstandardsfeature-card">
              <img src={features[0].icon} loading="lazy" decoding="async" className="highstandardsfeature-icon" />
              <h4>{features[0].title}</h4>
              <p>{features[0].text}</p>
            </div>

            <div className="highstandardsfeature-card">
              <img src={features[1].icon} loading="lazy" decoding="async" className="highstandardsfeature-icon" />
              <h4>{features[1].title}</h4>
              <p>{features[1].text}</p>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="highstandardsfeature-row flex">
            <div className="highstandardsfeature-empty"></div>

            <div className="highstandardsfeature-card">
              <img src={features[2].icon} loading="lazy" decoding="async" className="highstandardsfeature-icon" />
              <h4>{features[2].title}</h4>
              <p>{features[2].text}</p>
            </div>

            <div className="highstandardsfeature-card">
              <img src={features[3].icon} loading="lazy" decoding="async" className="highstandardsfeature-icon" />
              <h4>{features[3].title}</h4>
              <p>{features[3].text}</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HighStandardsFeature;


