import React from "react";

import "/public/OurStory/css/StoryBanner.css";

const StoryBanner = () => {
  return (
    <section className="story-banner flex items-center justify-center">
      <div className="story-overlay flex items-center justify-center">
        <div className="story-content flex flex-col items-center text-center">
          <h1 className="story-heading">WE&apos;RE YOUR DOG&apos;S PetPlus PARTNER</h1>

          <p className="story-subtext">
            We&apos;re here for the belly rubs, the breath checks, the better poops,
            and the dogs that make it all worth it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StoryBanner;
