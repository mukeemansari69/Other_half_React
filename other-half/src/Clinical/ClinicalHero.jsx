import { createElement, startTransition, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Beaker,
  FlaskConical,
  PawPrint,
  ShieldCheck,
} from "lucide-react";

import "/public/Clinical/css/clinicalStudies.css";

const EATING_DURATION_MS = 10000;
const BARK_DURATION_MS = 2200;
const CTA_REDIRECT_MS = 10000;

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
    label: "Smart Health Pathways",
    copy: "AI maps your dog’s behavior to nutrition and care, creating three adaptive pathways for complete wellness.",
    icon: FlaskConical,
  },
  {
    value: "5",
    label: "Vital Health Zones",
    copy: "Each recommendation is aligned across five key areas — digestion, immunity, coat, mobility, and oral health.",
    icon: ShieldCheck,
  },
  {
    value: "1",
    label: "AI Daily Plan",
    copy: "A single, easy-to-follow routine powered by AI — turning complex care into one simple daily habit.",
    icon: PawPrint,
  },
];
const dogStates = {
  eating: {
    label: "AI Nutrition Scan",
    title: "Analyzing feeding behavior...",
    copy: "AI tracks appetite and eating patterns to detect digestion health and nutritional balance in real time.",
  },

  bark: {
    label: "AI Behavior Insight",
    title: "Attention signal detected.",
    copy: "This behavior may reflect emotional needs or hidden discomfort. AI translates it into clear care guidance.",
  },

  play: {
    label: "AI Health Builder",
    title: "Create your dog’s smart routine.",
    copy: "Answer a few quick questions and get a personalized daily plan with tailored care and product recommendations.",
  },
};

export default function ClinicalHero({ isolated = false }) {
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
  const HeroHeading = isolated ? "h2" : "h1";
  const heroMarkup = (
    <section className="clinical-hero clinical-section clinical-section--hero">
      <div className="clinical-banner">
        <div className="clinical-hero__frame">
          <div className="grid clinical-hero__layout">
            <div className="clinical-hero__content">
              <span className="clinical-chip">AI BARK CHECK</span>
              <HeroHeading className="clinical-hero__title">
               Your Dog’s Behavior Speaks — Our AI Helps You Understand It.
              </HeroHeading>
              <p className="clinical-hero__text">
                Not every bark, pause, or habit is random. Our AI analyzes your dog’s behavior to uncover hidden health signals — and turns them into a clear, personalized care plan.
                <br />
                From low energy to unusual eating patterns or dental discomfort — small behavior changes can signal deeper issues.
Our AI connects these patterns with nutrition, routine, and health insights to guide you toward the right solution.
              </p>

              <div className="clinical-hero__actions">
                <button
                  type="button"
                  onClick={(event) => handleCtaClick(event, "/quiz", "hero-shop")}
                  disabled={isRedirecting}
                  className={`clinical-shop-button clinical-cta-target ${
                    activeCtaKey === "hero-shop" ? "clinical-cta-target--active" : ""
                  }`}
                >
                  <span>
                    {activeCtaKey === "hero-shop" && isRedirecting
                      ? "Playtime opening collection..."
                      : "Analyze Your Dog’s Behavior"}
                  </span>
                  <ArrowRight size={18} />
                </button>

                <Link
                  to="/quiz"
                  onClick={(event) => handleCtaClick(event, "/ai-pet-health", "hero-quiz")}
                  className={`clinical-secondary-button clinical-cta-target ${
                    activeCtaKey === "hero-quiz" ? "clinical-cta-target--active" : ""
                  } ${isRedirecting ? "clinical-cta-target--busy" : ""}`}
                  aria-disabled={isRedirecting}
                >
                  {activeCtaKey === "hero-quiz" && isRedirecting
                    ? "Dog is finding your routine..."
                    : "Get Personalized Routine"}
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
                    <strong>
                      {dogMode === "play"
                        ? "Shop click"
                        : dogMode === "bark"
                          ? "builds long-term health"
                          : "Auto feed"}
                    </strong>
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
                        A short behavior-based interaction where your dog moves, reacts, and
                        engages - making the experience feel alive and natural.
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
                        Carefully designed visuals, colors, and typography that maintain a
                        warm, clean, and pet-friendly clinical feel.
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
                  {clinicalStageStats.map(({ value, label, copy, icon }) => (
                    <article key={label} className="clinical-stage-stat">
                      <div className="clinical-stage-stat__icon">
                        {createElement(icon, { size: 18 })}
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
  );

  if (isolated) {
    return <div className="clinical-hero-host">{heroMarkup}</div>;
  }

  return heroMarkup;
}


