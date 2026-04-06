import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

import "/public/Science/css/science.css";

export default function ScienceHero() {
  return (
    <section className="science-hero">
      <div className="science-container science-banner">
        <span className="science-eyebrow">FOR DOGS YOU CALL FAMILY</span>
        <h1 className="science-hero__title">Smarter Health for Your Dog, Backed by Science</h1>
        <p className="science-hero__text">
          Clinically studied ingredients designed to support digestion, immunity, dental
          health, and overall wellbeing - because your dog deserves more than just basic
          nutrition.
        </p>

        <div className="science-hero__actions">
          <NavLink to="/integrity" className="science-button">
            Shop Now
            <ArrowRight size={16} />
          </NavLink>

          <NavLink to="/integrity" className="science-button science-button--outline">
            Explore Ingredients
            <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>
    </section>
  );
}
