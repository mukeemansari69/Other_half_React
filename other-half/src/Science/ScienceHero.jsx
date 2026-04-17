import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

import "/public/Science/css/science.css";

export default function ScienceHero() {
  return (
    <section className="science-hero">
      <div className="science-container science-banner">
        <span className="science-eyebrow">FOR DOGS YOU CALL FAMILY ❤️</span>
        <h1 className="science-hero__title">Smarter Health for Your Dog, Powered by AI Intelligence</h1>
        <p className="science-hero__text">
         We combine smart AI analysis with clinically trusted nutrition to understand your dog’s needs — and deliver a personalized health routine that actually works.
        </p>

        <div className="science-hero__actions">
          <NavLink to="/ai-pet-health" className="science-button">
           Analyze My Dog with AI
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


