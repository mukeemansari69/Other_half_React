import React from "react";
import "/public/Integrity/css/highstandardsfeature.css";


const features = [
  {
    title: "100% Human-Grade",
    text: "Yep, your dog’s supplements are made with ingredients you’d find in your own pantry.",
    icon: "/public/Integrity/images/sf-1.png",
  },
  {
    title: "No Fillers, Ever",
    text: "If it doesn’t serve your dog’s health, it’s cut. Ruthlessly.",
    icon: "/public/Integrity/images/sf2.png",
  },
  {
    title: "Vet-Approved, Science-Obsessed",
    text: "Every product is built with vet input, not boardroom buzzwords.",
    icon: "/public/Integrity/images/sf3.png",
  },
  {
    title: "No Fake Flavors, Colors, or Junk",
    text: "No ‘bacon dust.’ No ‘beef essence.’ Just real ingredients. The way it should be.",
    icon: "/public/Integrity/images/sf4.png",
  },
];

const HighStandardsFeature = () => {
  return (
    <section className="highstandardsfeature-section">
         {/* LEFT DOG */}
        <div className="highstandardsfeature-dog relative">
          <img
            src="/public/Integrity/images/snooz-dog.png"
            alt="dog"
            className="highstandardsfeature-dogimg"
          />
          <img
            src="/public/Integrity/images/snooz.png"
            alt="zzz"
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
              <img src={features[0].icon} className="highstandardsfeature-icon" />
              <h4>{features[0].title}</h4>
              <p>{features[0].text}</p>
            </div>

            <div className="highstandardsfeature-card">
              <img src={features[1].icon} className="highstandardsfeature-icon" />
              <h4>{features[1].title}</h4>
              <p>{features[1].text}</p>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="highstandardsfeature-row flex">
            <div className="highstandardsfeature-empty"></div>

            <div className="highstandardsfeature-card">
              <img src={features[2].icon} className="highstandardsfeature-icon" />
              <h4>{features[2].title}</h4>
              <p>{features[2].text}</p>
            </div>

            <div className="highstandardsfeature-card">
              <img src={features[3].icon} className="highstandardsfeature-icon" />
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