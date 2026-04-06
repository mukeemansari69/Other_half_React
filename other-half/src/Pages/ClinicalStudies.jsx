import React, { startTransition, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Beaker,
  Bone,
  FlaskConical,
  HeartPulse,
  Microscope,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import {
  dailyDuoProductData,
  dogDentalProductData,
  everydayProductData,
} from "../productData";
import "/public/Clinical/css/clinicalStudies.css";

const EATING_DURATION_MS = 5000;
const BARK_DURATION_MS = 2200;
const CTA_REDIRECT_MS = 3000;

const heroSignals = [
  {
    value: "45+",
    label: "essential nutrients",
    copy: "Everyday is built around full-body support instead of one narrow benefit.",
  },
  {
    value: "3",
    label: "formula tracks",
    copy: "Daily wellness, dental care, and stacked support sit inside the same routine logic.",
  },
  {
    value: "1 scoop",
    label: "habit loop",
    copy: "The collection is designed to stay easy enough for daily compliance.",
  },
];

const clinicalStageStats = [
  {
    value: "3",
    label: "formula pathways",
    copy: "Daily nutrition, oral care, and bundle logic now read like one connected system.",
    icon: FlaskConical,
  },
  {
    value: "5",
    label: "support zones",
    copy: "Digestion, immunity, coat, mobility, and oral care keep the science story grounded.",
    icon: ShieldCheck,
  },
  {
    value: "1",
    label: "daily ritual",
    copy: "The whole page resolves into one simple bowl-time habit, not a complicated routine.",
    icon: PawPrint,
  },
];

const clinicalStageTracks = [
  {
    title: "Everyday Multivitamin",
    kicker: "Foundation",
    copy: "Full-body wellness language keeps this formula at the center of the routine.",
    level: 4,
  },
  {
    title: "Doggie Dental",
    kicker: "Targeted care",
    copy: "A tighter oral-care track supports breath and plaque care without extra friction.",
    level: 3,
  },
  {
    title: "Daily Duo",
    kicker: "Complete stack",
    copy: "The bundle carries the broadest support story, so it gets the strongest readout.",
    level: 5,
  },
];

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
    image: "/Default/images/col3.png",
    kicker: "Stacked routine",
    title: "Daily Duo Bundle",
    summary:
      "The combined system that brings daily nutrition and oral hygiene into one stronger rhythm.",
    highlights: dailyDuoProductData.qualityHighlights.map((item) => item.title),
    tags: ["Complete daily stack", "Body + mouth support", "Bundle value", "Easy repeat"],
    accent: "clinical-card--mint",
  },
];

const dogStates = {
  eating: {
    label: "Crunch loop",
    title: "Dog is eating from the bowl.",
    copy: "The hero keeps looping through feed mode for 5 seconds before switching into bark mode.",
  },
  bark: {
    label: "Bark check",
    title: "Dog wants your attention now.",
    copy: "After each feed cycle the dog barks for attention, then returns to the bowl and repeats the routine.",
  },
  play: {
    label: "Play mode",
    title: "Dog is chasing the selected CTA.",
    copy: "The clicked button gets the playful dog handoff, then the chosen route opens after a 3 second beat.",
  },
};

const ClinicalStudies = () => {
  const navigate = useNavigate();
  const dogActorRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  const [dogMode, setDogMode] = useState("eating");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [activeCtaKey, setActiveCtaKey] = useState("");
  const [travelVector, setTravelVector] = useState({ x: -320, y: -170 });

  useEffect(() => {
    if (isRedirecting) {
      return undefined;
    }

    cycleTimeoutRef.current = window.setTimeout(() => {
      setDogMode((currentMode) => (currentMode === "eating" ? "bark" : "eating"));
    }, dogMode === "eating" ? EATING_DURATION_MS : BARK_DURATION_MS);

    return () => {
      window.clearTimeout(cycleTimeoutRef.current);
    };
  }, [dogMode, isRedirecting]);

  useEffect(
    () => () => {
      window.clearTimeout(cycleTimeoutRef.current);
      window.clearTimeout(redirectTimeoutRef.current);
    },
    []
  );

  const handleCtaClick = (event, nextPath, ctaKey) => {
    event.preventDefault();

    if (isRedirecting) {
      return;
    }

    window.clearTimeout(cycleTimeoutRef.current);
    window.clearTimeout(redirectTimeoutRef.current);

    const dogRect = dogActorRef.current?.getBoundingClientRect();
    const buttonRect = event.currentTarget?.getBoundingClientRect?.();

    if (dogRect && buttonRect) {
      const dogCenterX = dogRect.left + dogRect.width * 0.5;
      const dogCenterY = dogRect.top + dogRect.height * 0.55;
      const buttonCenterX = buttonRect.left + buttonRect.width * 0.5;
      const buttonCenterY = buttonRect.top + buttonRect.height * 0.5;

      setTravelVector({
        x: buttonCenterX - dogCenterX,
        y: buttonCenterY - dogCenterY,
      });
    }

    setActiveCtaKey(ctaKey);
    setDogMode("play");
    setIsRedirecting(true);

    redirectTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => navigate(nextPath));
    }, CTA_REDIRECT_MS);
  };

  const activeDogState = dogStates[dogMode];

  return (
    <main className={`clinical-page ${isRedirecting ? "clinical-page--play" : ""}`}>
      <section className="clinical-hero clinical-section clinical-section--hero">
        <div className="clinical-banner">
          <div className="clinical-hero__frame">
            <div className="grid clinical-hero__layout">
              <div className="clinical-hero__content">
                <span className="clinical-chip">BARK CHECK</span>
                <h1 className="clinical-hero__title">
                 Your dog’s behavior speaks — we help you understand what it truly needs.
                </h1>
                <p className="clinical-hero__text">
                  When your dog seeks attention, it’s often more than just a playful moment—it can be a subtle signal of unmet physical, emotional, or nutritional needs. From low energy levels to digestive discomfort or even oral health issues, these small behaviors can reflect deeper imbalances in their daily routine.
                  Our clinically balanced formulas are designed to recognize and support these signals at their root. By combining essential nutrients, targeted ingredients, and behavior-based insights, we help transform everyday attention-seeking moments into opportunities for better health. Instead of ignoring these cues, we turn them into a consistent, supportive routine that nourishes your dog from the inside out—supporting vitality, comfort, and long-term well-being.
                </p>

                <div className="clinical-hero__actions">
                  <button
                    type="button"
                    onClick={(event) => handleCtaClick(event, "/collection", "hero-shop")}
                    disabled={isRedirecting}
                    className={`clinical-shop-button clinical-cta-target ${activeCtaKey === "hero-shop" ? "clinical-cta-target--active" : ""}`}
                  >
                    <span>
                      {activeCtaKey === "hero-shop" && isRedirecting
                        ? "Playtime opening collection..."
                        : "Shop the formulas"}
                    </span>
                    <ArrowRight size={18} />
                  </button>

                  <Link
                    to="/quiz"
                    onClick={(event) => handleCtaClick(event, "/quiz", "hero-quiz")}
                    className={`clinical-secondary-button clinical-cta-target ${activeCtaKey === "hero-quiz" ? "clinical-cta-target--active" : ""} ${isRedirecting ? "clinical-cta-target--busy" : ""}`}
                    aria-disabled={isRedirecting}
                  >
                    {activeCtaKey === "hero-quiz" && isRedirecting
                      ? "Dog is finding your routine..."
                      : "Find the right routine"}
                  </Link>
                </div>

                <div className="clinical-status-box">
                  <div className="clinical-status-box__header">
                    <PawPrint size={18} />
                    <span>{activeDogState.label}</span>
                  </div>
                  <h2 className="clinical-status-box__title">{activeDogState.title}</h2>
                  <p className="clinical-status-box__copy">{activeDogState.copy}</p>
                </div>

                <div className="grid clinical-signal-grid">
                  {heroSignals.map((signal) => (
                    <article key={signal.label} className="clinical-signal-card">
                      <p className="clinical-signal-card__value">{signal.value}</p>
                      <p className="clinical-signal-card__label">{signal.label}</p>
                      <p className="clinical-signal-card__copy">{signal.copy}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="clinical-hero__visual">
                <div className="clinical-stage">
                  <div className="clinical-stage__glow clinical-stage__glow--one" aria-hidden="true" />
                  <div className="clinical-stage__glow clinical-stage__glow--two" aria-hidden="true" />

                  <div className="clinical-stage__hud">
                    <div className="clinical-stage__hud-item">
                      <span>Less complexity. </span>
                      <strong>{activeDogState.label}</strong>
                    </div>
                    <div className="clinical-stage__hud-item">
                      <span>Every small action</span>
                      <strong>{dogMode === "play" ? "Shop click" : dogMode === "bark" ? "builds long-term health" : "Auto feed"}</strong>
                    </div>
                  </div>

                  <div className={`clinical-dog-scene clinical-dog-scene--${dogMode}`}>
                    <div className="clinical-dog-scene__orbit clinical-dog-scene__orbit--one" aria-hidden="true" />
                    <div className="clinical-dog-scene__orbit clinical-dog-scene__orbit--two" aria-hidden="true" />
                    <div className="clinical-dog-scene__floor" aria-hidden="true" />

                    <div className={`clinical-bowl ${dogMode === "play" ? "clinical-bowl--hidden" : ""}`}>
                      <span className="clinical-bowl__food" />
                    </div>

                    <div className="clinical-dog-scene__scanner" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div
                      ref={dogActorRef}
                      className={`clinical-dog-actor clinical-dog-actor--${dogMode}`}
                      style={{
                        "--clinical-travel-x": `${travelVector.x}px`,
                        "--clinical-travel-y": `${travelVector.y}px`,
                      }}
                    >
                      <div className="clinical-dog">
                        <span className="clinical-dog__shadow" />
                        <span className="clinical-dog__body" />
                        <span className="clinical-dog__chest" />
                        <span className="clinical-dog__tail" />
                        <span className="clinical-dog__leg clinical-dog__leg--front" />
                        <span className="clinical-dog__leg clinical-dog__leg--rear" />
                        <span className="clinical-dog__leg clinical-dog__leg--back" />
                        <span className="clinical-dog__neck" />
                        <span className="clinical-dog__head">
                          <span className="clinical-dog__ear clinical-dog__ear--back" />
                          <span className="clinical-dog__ear clinical-dog__ear--front" />
                          <span className="clinical-dog__muzzle" />
                          <span className="clinical-dog__nose" />
                          <span className="clinical-dog__eye" />
                          <span className="clinical-dog__collar" />
                        </span>
                      </div>
                    </div>

                    <div className="clinical-dog-scene__bark" aria-hidden={dogMode !== "bark"}>
                      <span className="clinical-dog-scene__bark-tag">Woof!</span>
                      <span className="clinical-dog-scene__bark-wave clinical-dog-scene__bark-wave--one" />
                      <span className="clinical-dog-scene__bark-wave clinical-dog-scene__bark-wave--two" />
                      <span className="clinical-dog-scene__bark-wave clinical-dog-scene__bark-wave--three" />
                    </div>
                  </div>

                  <div className="grid clinical-stage-notes">
                    <article className="clinical-stage-note">
                      <div className="clinical-stage-note__icon">
                        <Beaker size={18} />
                      </div>
                      <div>
                        <p className="clinical-stage-note__eyebrow">Scene logic</p>
                        <p className="clinical-stage-note__text">
                           A short behavior-based interaction where your dog moves, reacts, and engages—making the experience feel alive and natural.
                        </p>
                      </div>
                    </article>

                    <article className="clinical-stage-note">
                      <div className="clinical-stage-note__icon">
                        <BadgeCheck size={18} />
                      </div>
                      <div>
                        <p className="clinical-stage-note__eyebrow">Theme locked</p>
                        <p className="clinical-stage-note__text">
                         Carefully designed visuals, colors, and typography that maintain a warm, clean, and pet-friendly clinical feel.  
                        </p>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="clinical-stage-dashboard">
                  <div className="clinical-stage-dashboard__header">
                    <div>
                      <p className="clinical-stage-dashboard__eyebrow">Clinical Snapshot</p>
                      <h3 className="clinical-stage-dashboard__title">
                        Motion up top, structured evidence rhythm below.
                      </h3>
                    </div>
                    <div className="clinical-stage-dashboard__badge">
                      <span aria-hidden="true" />
                      LIVE HEALTH SYSTEM
                    </div>
                  </div>


                  <div className="grid clinical-stage-dashboard__stats">
                    {clinicalStageStats.map(({ value, label, copy, icon: Icon }) => (
                      <article key={label} className="clinical-stage-stat">
                        <div className="clinical-stage-stat__icon">
                          {React.createElement(Icon, { size: 18 })}
                        </div>
                        <p className="clinical-stage-stat__value">{value}</p>
                        <p className="clinical-stage-stat__label">{label}</p>
                        <p className="clinical-stage-stat__copy">{copy}</p>
                      </article>
                    ))}
                  </div>

                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="clinical-section clinical-section--story">
        <div className="grid clinical-section__inner clinical-evidence-layout">
          <div className="clinical-panel clinical-panel--story">
            <span className="clinical-chip clinical-chip--soft">Evidence Focus</span>
            <h2 className="clinical-section-title">
              The page feels playful in the hero, but the structure underneath stays disciplined.
            </h2>
            <p className="clinical-section-copy">
              Everything comes down to one smooth routine that’s easy to follow, easy to maintain, and powerful over time.
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
              Supports gut health, immune strength, coat quality, joint mobility, and oral hygiene—covering the most critical aspects of your dog’s well-being.
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
              The visuals stay modern, but the product detail still leads shoppers directly into the
              collection and individual formula routes.
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
             A modern approach to dog wellness that blends behavior, nutrition, and simplicity—helping you move from confusion to clarity with every step.
            </p>

            <div className="clinical-cta__actions">
              <button
                type="button"
                onClick={(event) => handleCtaClick(event, "/collection", "footer-shop")}
                disabled={isRedirecting}
                className={`clinical-shop-button clinical-cta-target ${activeCtaKey === "footer-shop" ? "clinical-cta-target--active" : ""}`}
              >
                <span>
                  {activeCtaKey === "footer-shop" && isRedirecting
                    ? "Playtime opening collection..."
                    : "Play and open collection"}
                </span>
                <ArrowRight size={18} />
              </button>

              <Link
                to="/quiz"
                onClick={(event) => handleCtaClick(event, "/quiz", "footer-quiz")}
                className={`clinical-secondary-button clinical-secondary-button--dark clinical-cta-target ${activeCtaKey === "footer-quiz" ? "clinical-cta-target--active" : ""} ${isRedirecting ? "clinical-cta-target--busy" : ""}`}
                aria-disabled={isRedirecting}
              >
                {activeCtaKey === "footer-quiz" && isRedirecting
                  ? "Dog is taking you to the quiz..."
                  : "Take the quiz"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ClinicalStudies;
