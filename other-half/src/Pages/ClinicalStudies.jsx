import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bone,
  FlaskConical,
  HeartPulse,
  Microscope,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import ClinicalHero from "../Clinical/ClinicalHero";
import {
  dailyDuoProductData,
  dogDentalProductData,
  everydayProductData,
} from "../productData";

const evidenceAreas = [
  {
    title: "Digestive stability",
    description:
      "We keep gut support front and center with probiotics, pumpkin, and routine-friendly delivery that fits a real feeding schedule.",
    icon: HeartPulse,
  },
  {
    title: "Oral care that sticks",
    description:
      "The dental powder story focuses on easy compliance, fresher breath, and daily plaque support without adding a complicated ritual.",
    icon: Sparkles,
  },
  {
    title: "Mobility and healthy aging",
    description:
      "Glucosamine, MSM, and whole-body support make the routine feel preventive, not reactive.",
    icon: Stethoscope,
  },
  {
    title: "Layered daily support",
    description:
      "The duo bundle combines nutrition and oral care so more wellness goals get covered in one calm habit loop.",
    icon: ShieldCheck,
  },
];

const clinicalFlow = [
  {
    step: "01",
    title: "Map the support zone",
    text: "We start with the outcomes already present in the theme: digestion, immunity, oral health, coat support, and mobility.",
    icon: Microscope,
  },
  {
    step: "02",
    title: "Choose the easiest ritual",
    text: "Powder formats and scoop-based delivery keep the science usable in an everyday bowl, not trapped in a perfect-world plan.",
    icon: Bone,
  },
  {
    step: "03",
    title: "Stack what belongs together",
    text: "When a dog needs broader support, the system scales into the Daily Duo without making the routine feel heavier.",
    icon: FlaskConical,
  },
];

const formulaStudies = [
  {
    id: "everyday",
    route: "/product",
    image: "/Default/images/col1.png",
    kicker: "Whole-body baseline",
    title: "Everyday Daily Multivitamin",
    summary:
      "A full-spectrum powder routine built around joints, digestion, immunity, skin, and coat support.",
    highlights: everydayProductData.qualityHighlights.map((item) => item.title),
    tags: everydayProductData.tags.slice(0, 4),
    accent: "clinical-card--lime",
  },
  {
    id: "dental",
    route: "/doggie-dental",
    image: "/Product/images/dogi-dental-powder.png",
    kicker: "Oral care engine",
    title: "Doggie Dental Powder",
    summary:
      "A no-brush daily ritual aimed at cleaner teeth, better breath, and easier plaque support for real households.",
    highlights: dogDentalProductData.qualityHighlights.map((item) => item.title),
    tags: dogDentalProductData.tags.slice(0, 4),
    accent: "clinical-card--peach",
  },
  {
    id: "duo",
    route: "/dailyduo",
    image: "/Default/images/col4.png",
    kicker: "Stacked routine",
    title: "Daily Duo Bundle",
    summary:
      "The combined system that brings daily nutrition and oral hygiene into one stronger rhythm.",
    highlights: dailyDuoProductData.qualityHighlights.map((item) => item.title),
    tags: ["Complete daily stack", "Body + mouth support", "Bundle value", "Easy repeat"],
    accent: "clinical-card--mint",
  },
];

const ClinicalStudies = () => {
  return (
    <main className="clinical-page">
      <ClinicalHero />

      <section className="clinical-section clinical-section--story">
        <div className="grid clinical-section__inner clinical-evidence-layout">
          <div className="clinical-panel clinical-panel--story">
            <span className="clinical-chip clinical-chip--soft">Evidence Focus</span>
            <h2 className="clinical-section-title">
              The page feels playful in the hero, but the structure underneath stays
              disciplined.
            </h2>
            <p className="clinical-section-copy">
              Everything comes down to one smooth routine that's easy to follow, easy to
              maintain, and powerful over time.
            </p>

            <div className="clinical-story-list">
              <article className="clinical-story-list__item">
                <Microscope size={18} />
                <p>Ingredient-led support language stays aligned with the current product data.</p>
              </article>
              <article className="clinical-story-list__item">
                <ShieldCheck size={18} />
                <p>Claims stay grounded around digestion, immunity, oral care, and routine compliance.</p>
              </article>
              <article className="clinical-story-list__item">
                <PawPrint size={18} />
                <p>The dog animation is expressive enough to feel premium without breaking professionalism.</p>
              </article>
            </div>
          </div>

          <div className="grid clinical-evidence-grid">
            {evidenceAreas.map(({ title, description, icon: Icon }) => (
              <article key={title} className="clinical-evidence-card">
                <div className="clinical-evidence-card__icon">
                  {React.createElement(Icon, { size: 20 })}
                </div>
                <h3 className="clinical-evidence-card__title">{title}</h3>
                <p className="clinical-evidence-card__copy">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="clinical-section clinical-section--flow">
        <div className="clinical-section__inner">
          <div className="clinical-section-header">
            <span className="clinical-chip clinical-chip--soft">Lab To Bowl</span>
            <h2 className="clinical-section-title">Three clean moves shape the whole clinical story.</h2>
            <p className="clinical-section-copy clinical-section-copy--wide">
              Supports gut health, immune strength, coat quality, joint mobility, and oral
              hygiene-covering the most critical aspects of your dog's well-being.
            </p>
          </div>

          <div className="grid clinical-flow-grid">
            {clinicalFlow.map(({ step, title, text, icon: Icon }) => (
              <article key={step} className="clinical-flow-card">
                <div className="clinical-flow-card__top">
                  <span className="clinical-flow-card__step">{step}</span>
                  <div className="clinical-flow-card__icon">
                    {React.createElement(Icon, { size: 20 })}
                  </div>
                </div>
                <h3 className="clinical-flow-card__title">{title}</h3>
                <p className="clinical-flow-card__copy">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="clinical-section clinical-section--formulas">
        <div className="clinical-section__inner">
          <div className="clinical-section-header">
            <span className="clinical-chip clinical-chip--soft">Formula Studies</span>
            <h2 className="clinical-section-title">Each product gets its own study-style card.</h2>
            <p className="clinical-section-copy clinical-section-copy--wide">
              The visuals stay modern, but the product detail still leads shoppers directly
              into the collection and individual formula routes.
            </p>
          </div>

          <div className="grid clinical-formula-grid">
            {formulaStudies.map((study) => (
              <article key={study.id} className={`clinical-formula-card ${study.accent}`}>
                <div className="clinical-formula-card__media">
                  <div className="clinical-formula-card__halo" aria-hidden="true" />
                  <img
                    src={study.image}
                    alt={study.title}
                    className="clinical-formula-card__image"
                  />
                </div>

                <span className="clinical-formula-card__kicker">{study.kicker}</span>
                <h3 className="clinical-formula-card__title">{study.title}</h3>
                <p className="clinical-formula-card__copy">{study.summary}</p>

                <div className="clinical-formula-card__highlights">
                  {study.highlights.map((highlight) => (
                    <div key={highlight} className="clinical-formula-card__highlight">
                      <BadgeCheck size={14} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="clinical-formula-card__tags">
                  {study.tags.map((tag) => (
                    <span key={tag} className="clinical-formula-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link to={study.route} className="clinical-formula-card__button">
                  View formula
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="clinical-section clinical-section--cta">
        <div className="clinical-section__inner">
          <div className="clinical-cta">
            <div className="clinical-cta__shape clinical-cta__shape--one" aria-hidden="true" />
            <div className="clinical-cta__shape clinical-cta__shape--two" aria-hidden="true" />

            <span className="clinical-chip">READY FOR BETTER CARE</span>
            <h2 className="clinical-cta__title">
              Keep your dog active, your care simple, and your routine built on real science.
            </h2>
            <p className="clinical-cta__copy">
              A modern approach to dog wellness that blends behavior, nutrition, and
              simplicity-helping you move from confusion to clarity with every step.
            </p>

            <div className="clinical-cta__actions">
              <Link to="/collection" className="clinical-shop-button">
                <span>Open collection</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/quiz" className="clinical-secondary-button clinical-secondary-button--dark">
                Take the quiz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ClinicalStudies;
