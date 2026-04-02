import React from "react";
import "/public/Integrity/css/nofiller.css";

const NoFiller = () => {
  return (
    <section className="nofiller-section flex items-center justify-center">
      <div className="nofiller-overlay"></div>

      <div className="nofiller-content text-center flex flex-col items-center justify-center">
        <h2 className="nofiller-heading">
          WE’RE OTHER HALF — no FILLERS, no FAKES.
        </h2>
        <p className="nofiller-subtext">
          Every scoop we make is obsessively clean, vet-formulated, and actually
          does something. Because your dog’s health isn’t where we experiment.
        </p>
      </div>
    </section>
  );
};

export default NoFiller;