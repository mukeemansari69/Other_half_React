import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bone,
  ChevronLeft,
  CircleCheckBig,
  Droplets,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stars,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import "/public/QuizDesktop/css/Quiz.css";

const focusMeta = {
  gut: {
    label: "Digestive rhythm",
    detail: "Better stool quality, calmer digestion, and more predictable meals.",
    icon: Droplets,
  },
  dental: {
    label: "Breath and oral care",
    detail: "Daily support for breath, plaque, and easy no-brush care.",
    icon: Sparkles,
  },
  mobility: {
    label: "Joint comfort",
    detail: "Support for stiffness, slower movement, and everyday mobility.",
    icon: Activity,
  },
  skin: {
    label: "Skin and coat",
    detail: "Comfort, coat softness, and support for itch-prone dogs.",
    icon: Stars,
  },
  vitality: {
    label: "Daily wellness",
    detail: "Energy, overall resilience, and head-to-tail everyday support.",
    icon: HeartPulse,
  },
};

const recommendationMeta = {
  everyday: {
    title: "45 in 1 Everyday Daily Multivitamin",
    eyebrow: "Best match for whole-body daily support",
    description:
      "A strong fit when your dog needs broader support across digestion, energy, skin, coat, and healthy aging without adding extra complexity.",
    route: "/product",
    cta: "View Everyday",
    image: "/Default/images/col1.png",
    routine:
      "One scoop daily for body-wide support that feels easy to keep consistent.",
    bullets: [
      "Supports joints, digestion, immunity, skin, and coat",
      "Best when the goal is a simpler one-product routine",
      "A practical daily baseline for steady long-term wellness",
    ],
  },
  dental: {
    title: "Doggie Dental Powder",
    eyebrow: "Best match for mouth-first support",
    description:
      "A stronger fit when breath, plaque, tartar, or mouth comfort is the clearest concern and you want a focused no-brush routine.",
    route: "/doggie-dental",
    cta: "View Doggie Dental",
    image: "/Product/images/dogi-dental-powder.png",
    routine:
      "Sprinkle daily for oral support that fits into a normal feeding routine.",
    bullets: [
      "Great when breath and plaque are the most visible issue",
      "No-brush format makes consistency easier at home",
      "Useful for daily oral care without adding a complicated ritual",
    ],
  },
  duo: {
    title: "Daily Duo Bundle",
    eyebrow: "Best match for full-body plus mouth support",
    description:
      "A stronger fit when your dog needs support in more than one area and you want one routine that covers body wellness and oral care together.",
    route: "/dailyduo",
    cta: "View Daily Duo",
    image: "/Default/images/col3.png",
    routine:
      "Use a combined body + mouth routine when you want broader coverage with less guesswork.",
    bullets: [
      "Ideal when dental support matters alongside broader wellness goals",
      "Combines multivitamin support with daily mouth care",
      "A stronger all-in routine when one product feels too narrow",
    ],
  },
};

const quizData = [
  {
    id: "main-concern",
    eyebrow: "Question 1",
    question: "What feels most off with your dog right now?",
    helper: "Start with the signal that you would most love to improve first.",
    options: [
      {
        title: "Tummy feels unpredictable",
        description: "Gas, soft stool, or digestion that changes from day to day.",
        scores: { gut: 3, vitality: 1 },
      },
      {
        title: "Breath or teeth stand out",
        description: "Bad breath, plaque, or the feeling that the mouth needs more care.",
        scores: { dental: 3 },
      },
      {
        title: "Movement looks slower",
        description: "Hesitating on stairs, slower jumps, or stiffness after rest.",
        scores: { mobility: 3, vitality: 1 },
      },
      {
        title: "A few things feel off at once",
        description: "You notice more than one issue and want broader support.",
        scores: { gut: 2, dental: 2, mobility: 2, skin: 1, vitality: 1, bundleIntent: 2 },
      },
    ],
  },
  {
    id: "energy",
    eyebrow: "Question 2",
    question: "How does your dog's energy feel lately?",
    helper: "This helps us understand whether you need maintenance or stronger daily support.",
    options: [
      {
        title: "Still full of zoomies",
        description: "Energy feels playful, steady, and age-appropriate.",
        scores: { vitality: 1 },
      },
      {
        title: "Mostly good, not peak",
        description: "Still active, but not as bright or bouncy as usual.",
        scores: { vitality: 2 },
      },
      {
        title: "Lower than usual",
        description: "Less playful, a little flatter, and slower to get going.",
        scores: { vitality: 3, mobility: 1 },
      },
      {
        title: "Noticeably tired",
        description: "Resting more, slower walks, and less enthusiasm overall.",
        scores: { vitality: 4, mobility: 1 },
      },
    ],
  },
  {
    id: "digestion",
    eyebrow: "Question 3",
    question: "How does digestion look after meals?",
    helper: "Digestive stability often shapes comfort, stool quality, and routine confidence.",
    options: [
      {
        title: "Easy and consistent",
        description: "Meals feel routine and bathroom habits stay predictable.",
        scores: { vitality: 1 },
      },
      {
        title: "Sensitive after treats",
        description: "Rich foods or changes can throw things off a little.",
        scores: { gut: 2 },
      },
      {
        title: "Gas or soft stool happens often",
        description: "Digestion feels like an area that needs more support.",
        scores: { gut: 3 },
      },
      {
        title: "Frequent tummy drama",
        description: "Digestion feels like one of the clearest ongoing issues.",
        scores: { gut: 4, skin: 1 },
      },
    ],
  },
  {
    id: "mouth",
    eyebrow: "Question 4",
    question: "What is the mouth-care situation right now?",
    helper: "We are checking how much dedicated dental support should influence the recommendation.",
    options: [
      {
        title: "Fresh enough",
        description: "Nothing major is standing out in breath or plaque right now.",
        scores: { vitality: 1 },
      },
      {
        title: "Could use a tune-up",
        description: "Breath is a little off and I want more support than treats alone.",
        scores: { dental: 2 },
      },
      {
        title: "Plaque or strong breath is obvious",
        description: "Oral care feels like a real concern, not just a nice-to-have.",
        scores: { dental: 4 },
      },
      {
        title: "I want a no-brush routine that actually fits life",
        description: "I need dental support that is easy to stick with every day.",
        scores: { dental: 4, bundleIntent: 1 },
      },
    ],
  },
  {
    id: "coat",
    eyebrow: "Question 5",
    question: "How does skin and coat feel lately?",
    helper: "This helps us understand whether a broader wellness product is the better fit.",
    options: [
      {
        title: "Shiny and soft",
        description: "Coat looks healthy and skin is not a regular issue.",
        scores: { vitality: 1 },
      },
      {
        title: "Dry or a little dull",
        description: "Coat quality could use more nourishment or consistency.",
        scores: { skin: 2, vitality: 1 },
      },
      {
        title: "Itchy or scratching more",
        description: "Skin comfort feels like one of the signals I keep noticing.",
        scores: { skin: 3 },
      },
      {
        title: "Coat and tummy feel connected",
        description: "The skin looks off and digestion also seems a little sensitive.",
        scores: { skin: 2, gut: 2, bundleIntent: 1 },
      },
    ],
  },
  {
    id: "mobility",
    eyebrow: "Question 6",
    question: "What does movement look like day to day?",
    helper: "Movement clues help us balance mobility support with general wellness needs.",
    options: [
      {
        title: "Moves with ease",
        description: "Walks, jumps, and everyday movement still feel smooth.",
        scores: { vitality: 1 },
      },
      {
        title: "A little slower after naps",
        description: "Movement is okay overall but not quite as fluid as before.",
        scores: { mobility: 2 },
      },
      {
        title: "Hesitates on stairs or jumps",
        description: "You notice some stiffness or reduced confidence in movement.",
        scores: { mobility: 3 },
      },
      {
        title: "Stiffness is becoming a pattern",
        description: "Mobility support feels like it should be part of the daily routine.",
        scores: { mobility: 4 },
      },
    ],
  },
  {
    id: "routine-style",
    eyebrow: "Question 7",
    question: "What kind of wellness routine will you realistically stick with?",
    helper: "The best routine is the one that actually fits your household.",
    options: [
      {
        title: "One scoop and done",
        description: "I want the simplest daily support possible.",
        scores: { vitality: 2 },
      },
      {
        title: "Mouth care matters most",
        description: "If I start anywhere, I want dental support first.",
        scores: { dental: 3 },
      },
      {
        title: "I want body + mouth support together",
        description: "Give me the more complete routine if it stays practical.",
        scores: { dental: 2, gut: 1, mobility: 1, skin: 1, vitality: 1, bundleIntent: 4 },
      },
      {
        title: "I want the strongest all-around support",
        description: "I care more about full coverage than keeping it ultra minimal.",
        scores: { gut: 1, mobility: 1, skin: 1, vitality: 2, bundleIntent: 3 },
      },
    ],
  },
];

const buildProfile = (answers) => {
  const scores = {
    gut: 0,
    dental: 0,
    mobility: 0,
    skin: 0,
    vitality: 0,
    bundleIntent: 0,
  };

  answers.forEach((answer) => {
    Object.entries(answer.scores).forEach(([key, value]) => {
      scores[key] += value;
    });
  });

  const focusKeys = Object.keys(focusMeta).sort((firstKey, secondKey) => {
    return scores[secondKey] - scores[firstKey];
  });

  const topFocuses = focusKeys.filter((key) => scores[key] > 0).slice(0, 3);
  const nonDentalPriorityCount = focusKeys
    .filter((key) => key !== "dental")
    .filter((key) => scores[key] >= 4).length;

  let recommendationKey = "everyday";

  if (scores.dental >= 5 && (nonDentalPriorityCount >= 1 || scores.bundleIntent >= 4)) {
    recommendationKey = "duo";
  } else if (
    scores.dental >= 5 &&
    scores.dental >= scores.gut &&
    scores.dental >= scores.mobility &&
    scores.dental >= scores.skin
  ) {
    recommendationKey = "dental";
  }

  const primaryFocus = topFocuses[0];
  const leadScore = primaryFocus ? scores[primaryFocus] : 0;
  const supportSummary = topFocuses.map((key) => focusMeta[key].label);

  return {
    scores,
    topFocuses,
    leadScore,
    supportSummary,
    recommendationKey,
    recommendation: recommendationMeta[recommendationKey],
  };
};

const formatStepLabel = (step) => {
  return `${step + 1}`.padStart(2, "0");
};

const Quiz = () => {
  const { token, user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [saveState, setSaveState] = useState({ type: "", message: "" });
  const submittedSignatureRef = useRef("");

  const currentQuestion = quizData[step];
  const progress = (step / quizData.length) * 100;
  const profile = buildProfile(answers);
  const resultProfile = buildProfile(answers);

  const handleAnswer = (option) => {
    setAnswers((currentAnswers) => [...currentAnswers, option]);
    setStep((currentStep) => currentStep + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      return;
    }

    setAnswers((currentAnswers) => currentAnswers.slice(0, -1));
    setStep((currentStep) => currentStep - 1);
  };

  const handleRestart = () => {
    submittedSignatureRef.current = "";
    setAnswers([]);
    setStep(0);
    setSaveState({ type: "", message: "" });
  };

  const visibleFocuses =
    profile.topFocuses.length > 0
      ? profile.topFocuses
      : ["gut", "dental", "mobility"];

  useEffect(() => {
    if (step !== quizData.length || answers.length !== quizData.length) {
      return;
    }

    const nextResult = buildProfile(answers);
    const payload = {
      recommendationKey: nextResult.recommendationKey,
      recommendationTitle: nextResult.recommendation.title,
      topFocuses: nextResult.topFocuses,
      scores: nextResult.scores,
      answers: answers.map((answer, index) => ({
        questionId: quizData[index]?.id || `question-${index + 1}`,
        title: answer.title,
      })),
    };
    const submissionSignature = JSON.stringify(payload);

    if (submittedSignatureRef.current === submissionSignature) {
      return;
    }

    submittedSignatureRef.current = submissionSignature;

    let isActive = true;

    const saveQuizResult = async () => {
      setSaveState({ type: "loading", message: "Saving your dog's result..." });

      try {
        const response = await apiRequest("/quiz/submissions", {
          method: "POST",
          body: payload,
          token,
        });

        if (isActive) {
          setSaveState({
            type: "success",
            message:
              response.message ||
              (user ? "Your dog's result has been saved to your account." : "Your result has been saved."),
          });
        }
      } catch (error) {
        if (isActive) {
          setSaveState({
            type: "error",
            message: error.message || "We could not save your dog's quiz result.",
          });
        }
      }
    };

    saveQuizResult();

    return () => {
      isActive = false;
    };
  }, [answers, step, token, user]);

  if (step >= quizData.length) {
    return (
      <main className="quiz-page">
        <section className="quiz-page__hero quiz-page__hero--compact">
          <div className="quiz-page__shell">
            <div className="quiz-page__hero-copy">
              <span className="quiz-page__kicker">Your dog's care match</span>
              <h1 className="quiz-page__hero-title">A daily routine shaped around what your dog is showing you.</h1>
              <p className="quiz-page__hero-text">
                We looked at the signals you shared and picked the routine that feels
                strongest for the pattern showing up across energy, digestion, movement,
                skin, and oral care so your next step feels more personal than random.
              </p>
            </div>
          </div>
        </section>

        <section className="quiz-page__experience quiz-page__experience--result">
          <div className="quiz-page__shell">
            <div className="quiz-page__result-card">
              <div className="quiz-page__result-header">
                <div className="quiz-page__result-copy">
                  <span className="quiz-page__result-kicker">
                    {resultProfile.recommendation.eyebrow}
                  </span>
                  <h2 className="quiz-page__result-title">
                    {resultProfile.recommendation.title}
                  </h2>
                  <p className="quiz-page__result-text">
                    {resultProfile.recommendation.description}
                  </p>

                  <div className="quiz-page__result-highlights">
                    {resultProfile.topFocuses.map((key) => {
                      const Icon = focusMeta[key].icon;

                      return (
                        <article key={key} className="quiz-page__focus-pill">
                          <Icon size={16} />
                          <span>{focusMeta[key].label}</span>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="quiz-page__result-media">
                  <div className="quiz-page__result-image-wrap">
                    <img
                      src={resultProfile.recommendation.image}
                      alt={resultProfile.recommendation.title}
                      loading="lazy"
                      decoding="async"
                      className="quiz-page__result-image"
                    />
                  </div>
                </div>
              </div>

              <div className="quiz-page__result-grid">
                <article className="quiz-page__result-panel">
                  <p className="quiz-page__result-panel-title">Why it matches</p>
                  <div className="quiz-page__score-list">
                    {resultProfile.topFocuses.map((key) => (
                      <div key={key} className="quiz-page__score-row">
                        <div className="quiz-page__score-row-top">
                          <span>{focusMeta[key].label}</span>
                          <span>{resultProfile.scores[key]} pts</span>
                        </div>
                        <div className="quiz-page__score-track">
                          <div
                            className="quiz-page__score-fill"
                            style={{
                              width: `${Math.min(
                                100,
                                (resultProfile.scores[key] / 10) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="quiz-page__score-detail">{focusMeta[key].detail}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="quiz-page__result-panel">
                  <p className="quiz-page__result-panel-title">Suggested routine</p>
                  <p className="quiz-page__result-routine">
                    {resultProfile.recommendation.routine}
                  </p>
                  <ul className="quiz-page__result-bullets">
                    {resultProfile.recommendation.bullets.map((bullet) => (
                      <li key={bullet}>
                        <CircleCheckBig size={16} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="quiz-page__result-actions">
                <Link
                  to={resultProfile.recommendation.route}
                  className="quiz-page__primary-button"
                >
                  <span>{resultProfile.recommendation.cta}</span>
                  <ArrowRight size={18} />
                </Link>

                <button
                  type="button"
                  className="quiz-page__secondary-button"
                  onClick={handleRestart}
                >
                  Restart quiz
                </button>
              </div>

              {saveState.message ? (
                <div
                  className={`mt-4 rounded-full px-4 py-3 text-sm font-medium ${
                    saveState.type === "success"
                      ? "bg-[#EEF6E7] text-[#0F4A12]"
                      : saveState.type === "error"
                        ? "bg-[#FFF1EE] text-[#A13A2C]"
                        : "bg-[#FBF3D6] text-[#8A5A09]"
                  }`}
                >
                  {saveState.message}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <section className="quiz-page__hero">
        <div className="quiz-page__shell quiz-page__hero-layout">
          <div className="quiz-page__hero-copy">
            <span className="quiz-page__kicker">2 minute care finder</span>
            <h1 className="quiz-page__hero-title">
              Find the care routine that fits your dog and your real daily life.
            </h1>
            <p className="quiz-page__hero-text">
              Answer a few quick questions about what you are noticing. We turn that into a
              practical starting point, not a generic guess.
            </p>

            <div className="quiz-page__hero-points">
              <div className="quiz-page__hero-point">
                <ShieldCheck size={18} />
                <span>Built around real dog-parent concerns</span>
              </div>
              <div className="quiz-page__hero-point">
                <Bone size={18} />
                <span>Saved to your account when you are logged in</span>
              </div>
              <div className="quiz-page__hero-point">
                <Sparkles size={18} />
                <span>Clear next step without information overload</span>
              </div>
            </div>
          </div>

          <div className="quiz-page__hero-visual">
            <div className="quiz-page__dog-scene">
              <div className="quiz-page__dog-scene-glow quiz-page__dog-scene-glow--one" />
              <div className="quiz-page__dog-scene-glow quiz-page__dog-scene-glow--two" />
              <img
                src="/Default/images/mkm.png"
                alt="Happy dog ready for the quiz"
                loading="lazy"
                decoding="async"
                className="quiz-page__dog-image"
              />

              <div className="quiz-page__floating-card quiz-page__floating-card--one">
                <HeartPulse size={16} />
                <span>Energy</span>
              </div>
              <div className="quiz-page__floating-card quiz-page__floating-card--two">
                <Droplets size={16} />
                <span>Digestion</span>
              </div>
              <div className="quiz-page__floating-card quiz-page__floating-card--three">
                <Sparkles size={16} />
                <span>Oral care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quiz-page__experience">
        <div className="quiz-page__shell quiz-page__layout">
          <article className="quiz-page__card">
            <div className="quiz-page__progress-top">
              <span className="quiz-page__progress-kicker">
                Step {formatStepLabel(step)} of {formatStepLabel(quizData.length)}
              </span>
              <span className="quiz-page__progress-copy">
                {Math.round(progress)}% complete
              </span>
            </div>

            <div className="quiz-page__progress-track">
              <div
                className="quiz-page__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div key={currentQuestion.id} className="quiz-page__question-stage">
              <span className="quiz-page__question-kicker">{currentQuestion.eyebrow}</span>
              <h2 className="quiz-page__question">{currentQuestion.question}</h2>
              <p className="quiz-page__question-helper">{currentQuestion.helper}</p>

              <div className="quiz-page__options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.title}
                    type="button"
                    className="quiz-page__option"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="quiz-page__option-index">
                      {formatStepLabel(index)}
                    </span>
                    <div className="quiz-page__option-copy">
                      <span className="quiz-page__option-title">{option.title}</span>
                      <span className="quiz-page__option-description">
                        {option.description}
                      </span>
                    </div>
                    <ArrowRight size={18} className="quiz-page__option-arrow" />
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-page__card-footer">
              <button
                type="button"
                className="quiz-page__back-button"
                onClick={handleBack}
                disabled={step === 0}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>

              <p className="quiz-page__footer-note">
                These answers help shape an everyday product match. They are not medical advice.
              </p>
            </div>
          </article>

          <aside className="quiz-page__insight-card">
            <div className="quiz-page__insight-top">
              <span className="quiz-page__insight-kicker">What we are noticing</span>
              <h2 className="quiz-page__insight-title">
                Your answers are already painting a clearer picture of your dog's needs.
              </h2>
            </div>

            <div className="quiz-page__focus-list">
              {visibleFocuses.map((key) => {
                const Icon = focusMeta[key].icon;

                return (
                  <article key={key} className="quiz-page__focus-card">
                    <div className="quiz-page__focus-icon">
                      <Icon size={18} />
                    </div>
                    <div className="quiz-page__focus-copy">
                      <p className="quiz-page__focus-title">{focusMeta[key].label}</p>
                      <p className="quiz-page__focus-text">{focusMeta[key].detail}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="quiz-page__answers-panel">
              <p className="quiz-page__answers-panel-title">Recent answers</p>
              {answers.length > 0 ? (
                <div className="quiz-page__answer-chips">
                  {answers.slice(-3).map((answer) => (
                    <span key={`${answer.title}-${answer.description}`} className="quiz-page__answer-chip">
                      {answer.title}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="quiz-page__answers-empty">
                  Start the first question and we will surface the strongest care signals here.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Quiz;



