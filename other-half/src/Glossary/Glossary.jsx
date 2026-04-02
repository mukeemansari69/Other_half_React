import React from "react";
import "/public/Glossary/css/glossary.css";

const Glossary = () => {
  return (
    <section className="glossary-section flex items-center justify-center">
      <div className="glossary-overlay"></div>

      <div className="glossary-content text-center flex flex-col items-center justify-center">
        <h2 className="glossary-heading">
         INGREDIENT GLOSSARY
        </h2>
        <p className="glossary-subtext">
         What’s inside your dog’s daily scoop — and why it matters.
        </p>
      </div>
    </section>
  );
};

export default Glossary;