import React, { useState } from "react";
import "/public/Glossary/css/NoMystery.css";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const data = [
  {
    letter: "C",
    title: "Collagen (Bovine)",
    desc: "A structural protein sourced from bovine connective tissue.",
    points: [
      "Collagen supports joint elasticity, cartilage",
    ],
    img: "/Glossary/images/rep.png",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12785756/",
  },
  {
    letter: "G",
    title: "GlucosaGreen® (Vegetarian Glucosamine)",
    desc: "A plant-based glucosamine alternative derived via fermentation.",
    points: ["Supports cartilage repair and reduces joint inflammation — ideal for dogs with shellfish allergies.Supports cartilage repair and reduces joint inflammation — ideal for dogs with shellfish allergies.", "Point two"],
    img: "/Glossary/images/gl.png",
      link: "https://pmc.ncbi.nlm.nih.gov/search/?term=GlucosaGreen%C2%AE+%28Vegetarian+Glucosamine",
  },
  {
    letter: "O",
    title: "OptiMSM® (Methylsulfonylmethane)",
    desc: "A highly pure, bioavailable form of MSM — a natural sulfur compound.",
    points: ["Reduces joint pain and inflammation, supports connective tissue, and enhances mobility.", "Point two"],
    img: "/Glossary/images/optiMSM.png",
    link: "https://pmc.ncbi.nlm.nih.gov/search/?term=OptiMSM%C2%AE+%28Methylsulfonylmethane%29&sort=relevance&size=10&display_snippets=show",
  },
  {
    letter: "C",
    title: "Chondroitin (Bovine)",
    desc: "A key component of cartilage sourced from bovine tracheal tissue.",
    points: ["Helps retain water in the joints, supports elasticity, and slows cartilage breakdown.", "Point two"],
    img: "/Glossary/images/optiMSM.png",
    link: "https://pmc.ncbi.nlm.nih.gov/search/?term=Chondroitin+%28Bovine%29&sort=relevance&size=10&display_snippets=show",
  },
   {
    letter: "T",
    title: "Turmeric Root",
    desc: "A golden spice packed with curcumin, a powerful anti-inflammatory compound.",
    points: ["Helps reduce stiffness and chronic inflammation associated with arthritis and aging.", "Point two"],
    img: "/Glossary/images/ter.png",
    link: "https://pmc.ncbi.nlm.nih.gov/search/?term=Turmeric+Root&sort=relevance&size=10&display_snippets=show",
  },
   {
    letter: "R",
    title: "Rephyll® (Black Pepper Extract)",
    desc: "A standardized black pepper extract containing piperine, which enhances nutrient absorption.",
    points: ["Enhances the absorption and bioavailability of other joint ingredients like turmeric and MSM.", "Point two"],
    img: "/Glossary/images/rep.png",
    link: "https://pmc.ncbi.nlm.nih.gov/search/?term=Rephyll%C2%AE+%28Black+Pepper+Extract%29&sort=relevance&size=10&display_snippets=show",
  },
   {
    letter: "A",
    title: "Ashwagandha Root",
    desc: "An adaptogenic herb that helps dogs manage stress and anxiety.",
    points: [
      "Supports stress reduction and calming behavior",
      "Boosts immune system and overall vitality"
    ],
    img: "/Glossary/images/As.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6979308/"
  },
  {
    letter: "A",
    title: "Alfalfa Meal",
    desc: "A nutrient-rich plant ingredient packed with vitamins and minerals.",
    points: [
      "Supports digestion and gut health",
      "Provides natural source of fiber and antioxidants"
    ],
    img: "/Glossary/images/al.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6769890/"
  },
  {
    letter: "A",
    title: "Anchovy Oil",
    desc: "A natural source of omega-3 fatty acids derived from fish.",
    points: [
      "Promotes healthy skin and shiny coat",
      "Supports joint and heart health"
    ],
    img: "/Glossary/images/an.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6722755/"
  },

  // ================= B =================
  {
    letter: "B",
    title: "Blueberries",
    desc: "A superfood rich in antioxidants and vitamins.",
    points: [
      "Supports brain health and cognitive function",
      "Helps fight oxidative stress"
    ],
    img: "/Glossary/images/bl.webp",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6520897/"
  },
  {
    letter: "B",
    title: "Beet Pulp",
    desc: "A highly digestible fiber source commonly used in dog food.",
    points: [
      "Improves digestion and stool quality",
      "Supports beneficial gut bacteria"
    ],
    img: "/Glossary/images/bt.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4494390/"
  },

  // ================= D =================
  {
    letter: "D",
    title: "Duck Protein",
    desc: "A lean and highly digestible protein source for dogs.",
    points: [
      "Supports muscle development and energy",
      "Ideal for dogs with food sensitivities"
    ],
    img: "/Glossary/images/dk.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5753635/"
  },
  {
    letter: "D",
    title: "Dandelion Root",
    desc: "A natural herb known for its detoxifying properties.",
    points: [
      "Supports liver function and digestion",
      "Acts as a natural diuretic and antioxidant"
    ],
    img: "/Glossary/images/dn.jpg",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5553762/"
  },

];

const NoMystery = () => {
  const [active, setActive] = useState("A");

  const filtered = data.filter((item) => item.letter === active);

  return (
    <section className="noMystery-section">
      <div className="noMystery-container">
        
        {/* Heading */}
        <div className="noMystery-header">
          <h2 className="noMystery-title">
            NO MYSTERY — JUST MASTERY
          </h2>
          <p className="noMystery-subtext">
           At PetPlus, we believe in radical transparency. Every scoop your dog gets is packed with purposeful, clinically studied ingredients — nothing hidden, nothing weird. Here's what goes into our formulas and why it matters.
          </p>
        </div>

        {/* Alphabet Filter */}
        <div className="noMystery-alphaWrapper">
          <div className="noMystery-alpha">
            {alphabet.map((char) => (
              <button
                key={char}
                onClick={() => setActive(char)}
                className={`noMystery-alphaItem ${
                  active === char ? "active" : ""
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="noMystery-grid">
          {filtered.map((item, index) => (
            <div key={index} className="noMystery-card">
              
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="noMystery-cardImg"
              />

              <div className="noMystery-cardContent">
                <h3 className="noMystery-cardTitle">
                  {item.title}
                </h3>

                <p className="noMystery-cardDesc">
                  {item.desc}
                </p>

                <ul className="noMystery-points">
                  {item.points.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>

                <a
  href={item.link}
  target="_blank"
  rel="noopener noreferrer"
  className="noMystery-readMore"
>
  READ MORE
</a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NoMystery;


