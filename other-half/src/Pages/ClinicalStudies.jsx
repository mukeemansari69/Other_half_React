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
import "./clinicalStudies.css";

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
    copy: "The banner starts in feed mode, then auto-switches to bark mode after 5 seconds.",
  },
  bark: {
    label: "Bark check",
    title: "Dog wants your attention now.",
    copy: "Hit the shop button and the pup jumps over to treat it like a playful pillow before opening collection.",
  },
  play: {
    label: "Play mode",
    title: "Dog is playing with the shop button.",
    copy: "The button gets squishy, the dog hops across, and collection opens after a 3 second beat.",
  },
};

const ClinicalStudies = () => {
  const navigate = useNavigate();
  const dogActorRef = useRef(null);
  const shopButtonRef = useRef(null);
  const barkTimeoutRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  const [dogMode, setDogMode] = useState("eating");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [travelVector, setTravelVector] = useState({ x: -320, y: -170 });

  useEffect(() => {
    barkTimeoutRef.current = window.setTimeout(() => {
      setDogMode((currentMode) => (currentMode === "eating" ? "bark" : currentMode));
    }, 5000);

    return () => {
      window.clearTimeout(barkTimeoutRef.current);
      window.clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const handleShopClick = () => {
    if (isRedirecting) {
      return;
    }

    window.clearTimeout(barkTimeoutRef.current);

    const dogRect = dogActorRef.current?.getBoundingClientRect();
    const buttonRect = shopButtonRef.current?.getBoundingClientRect();

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

    setDogMode("play");
    setIsRedirecting(true);

    redirectTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => navigate("/collection"));
    }, 3000);
  };

  const activeDogState = dogStates[dogMode];

  return (
    <main className={`clinical-page ${isRedirecting ? "clinical-page--play" : ""}`}>
      <section className="clinical-hero relative overflow-visible px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pb-24 lg:pt-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="clinical-hero__frame">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(480px,0.98fr)] lg:gap-10">
              <div className="relative z-20">
                <span className="clinical-chip">Clinical Studies</span>
                <h1 className="clinical-hero__title">
                  A modern clinical page with a living dog scene, not another static lab layout.
                </h1>
                <p className="clinical-hero__text">
                  This experience keeps your theme fonts and colors, then turns the science story
                  into motion: the dog eats, barks after 5 seconds, and when shoppers press the
                  button the pup dives into play mode before opening the collection page.
                </p>

                <div className="clinical-hero__actions">
                  <button
                    ref={shopButtonRef}
                    type="button"
                    onClick={handleShopClick}
                    disabled={isRedirecting}
                    className={`clinical-shop-button ${isRedirecting ? "clinical-shop-button--active" : ""}`}
                  >
                    <span>{isRedirecting ? "Playtime opening collection..." : "Shop the formulas"}</span>
                    <ArrowRight size={18} />
                  </button>

                  <Link to="/quiz" className="clinical-secondary-button">
                    Find the right routine
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

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {heroSignals.map((signal) => (
                    <article key={signal.label} className="clinical-signal-card">
                      <p className="clinical-signal-card__value">{signal.value}</p>
                      <p className="clinical-signal-card__label">{signal.label}</p>
                      <p className="clinical-signal-card__copy">{signal.copy}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="relative z-30">
                <div className="clinical-stage">
                  <div className="clinical-stage__glow clinical-stage__glow--one" aria-hidden="true" />
                  <div className="clinical-stage__glow clinical-stage__glow--two" aria-hidden="true" />

                  <div className="clinical-stage__hud">
                    <div className="clinical-stage__hud-item">
                      <span>Banner behavior</span>
                      <strong>{activeDogState.label}</strong>
                    </div>
                    <div className="clinical-stage__hud-item">
                      <span>Trigger</span>
                      <strong>{dogMode === "play" ? "Shop click" : dogMode === "bark" ? "Auto bark" : "Auto feed"}</strong>
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

                  <div className="grid gap-4 lg:grid-cols-2">
                    <article className="clinical-stage-note">
                      <div className="clinical-stage-note__icon">
                        <Beaker size={18} />
                      </div>
                      <div>
                        <p className="clinical-stage-note__eyebrow">Scene logic</p>
                        <p className="clinical-stage-note__text">
                          5 second feed animation, bark state, then CTA-triggered play motion.
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
                          Lime accent, deep green, warm neutrals, Luckiest Guy, and Poppins stay intact.
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6 lg:px-10 lg:pb-10">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="clinical-panel clinical-panel--story">
            <span className="clinical-chip clinical-chip--soft">Evidence Focus</span>
            <h2 className="clinical-section-title">
              The page feels playful in the hero, but the structure underneath stays disciplined.
            </h2>
            <p className="clinical-section-copy">
              The layout is built like a clean wellness control room: support zones, routine logic,
              and product stories stay easy to scan while motion adds personality instead of noise.
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

          <div className="grid gap-6 md:grid-cols-2">
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

      <section className="px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="clinical-section-header">
            <span className="clinical-chip clinical-chip--soft">Lab To Bowl</span>
            <h2 className="clinical-section-title">Three clean moves shape the whole clinical story.</h2>
            <p className="clinical-section-copy clinical-section-copy--wide">
              This keeps the page unique and animated without losing the product logic already present
              across your collection.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
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

      <section className="px-4 pb-12 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="clinical-section-header">
            <span className="clinical-chip clinical-chip--soft">Formula Studies</span>
            <h2 className="clinical-section-title">Each product gets its own study-style card.</h2>
            <p className="clinical-section-copy clinical-section-copy--wide">
              The visuals stay modern, but the product detail still leads shoppers directly into the
              collection and individual formula routes.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
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

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="clinical-cta">
            <div className="clinical-cta__shape clinical-cta__shape--one" aria-hidden="true" />
            <div className="clinical-cta__shape clinical-cta__shape--two" aria-hidden="true" />

            <span className="clinical-chip">Ready To Launch</span>
            <h2 className="clinical-cta__title">
              Keep the dog in motion, keep the science clear, and send shoppers into collection with energy.
            </h2>
            <p className="clinical-cta__copy">
              The page now works as a polished clinical studies experience with a premium animated
              hero, grounded product storytelling, and a playful CTA handoff into the shopping flow.
            </p>

            <div className="clinical-cta__actions">
              <button type="button" onClick={handleShopClick} className="clinical-shop-button">
                <span>Play and open collection</span>
                <ArrowRight size={18} />
              </button>

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
