import React, { useState } from "react";
import "./Quiz.css";

const quizData = [
  {
    question: "How is your dog’s energy level?",
    options: [
      { text: "Very active", value: "healthy" },
      { text: "Slightly low", value: "joint" },
      { text: "Very tired", value: "joint" },
      { text: "Lazy all day", value: "digestive" }
    ]
  },
  {
    question: "Does your dog have digestion issues?",
    options: [
      { text: "Never", value: "healthy" },
      { text: "Sometimes", value: "digestive" },
      { text: "Often", value: "digestive" },
      { text: "Always", value: "digestive" }
    ]
  },
  {
    question: "Does your dog scratch frequently?",
    options: [
      { text: "No", value: "healthy" },
      { text: "Sometimes", value: "skin" },
      { text: "Often", value: "skin" },
      { text: "Always", value: "skin" }
    ]
  },
  {
    question: "How is your dog’s breath?",
    options: [
      { text: "Fresh", value: "healthy" },
      { text: "Bad", value: "dental" },
      { text: "Very bad", value: "dental" },
      { text: "Strong odor", value: "dental" }
    ]
  },
  {
    question: "Does your dog limp?",
    options: [
      { text: "No", value: "healthy" },
      { text: "Rarely", value: "joint" },
      { text: "Often", value: "joint" },
      { text: "Always", value: "joint" }
    ]
  },
  {
    question: "How do your dog’s eyes look?",
    options: [
      { text: "Clear and bright", value: "healthy" },
      { text: "Slightly red", value: "allergy" },
      { text: "Cloudy or watery", value: "eye_health" },
      { text: "Yellowish tint", value: "liver" }
    ]
  },
  {
    question: "How is your dog’s weight?",
    options: [
      { text: "Ideal weight", value: "healthy" },
      { text: "Slightly overweight", value: "metabolic" },
      { text: "Underweight / Ribs showing", value: "nutrition" },
      { text: "Suddenly losing weight", value: "internal" }
    ]
  },
  {
    question: "Does your dog shake its head or scratch its ears?",
    options: [
      { text: "No, never", value: "healthy" },
      { text: "Rarely", value: "ear_health" },
      { text: "Frequently", value: "ear_infection" },
      { text: "Constantly with whining", value: "ear_infection" }
    ]
  },
  {
    question: "How often does your dog drink water or urinate?",
    options: [
      { text: "Normal amount", value: "healthy" },
      { text: "Drinking more than usual", value: "kidney" },
      { text: "Very frequent urination", value: "urinary_tract" },
      { text: "Struggling to urinate", value: "urinary_tract" }
    ]
  },
  {
    question: "How is your dog's coat (fur)?",
    options: [
      { text: "Shiny and smooth", value: "healthy" },
      { text: "Dull or dry", value: "nutrition" },
      { text: "Patchy hair loss", value: "skin_parasites" },
      { text: "Very oily or smelly", value: "skin" }
    ]
  }
];

const suggestions = {
  joint: {
    title: "Joint Pain Detected",
    product: "Daily Duo Joint Support",
    routine: "Light exercise + joint supplement + warm rest"
  },
  digestive: {
    title: "Gut Health Issue",
    product: "Daily Duo Gut Balance",
    routine: "Probiotic + hydration + clean diet"
  },
  skin: {
    title: "Skin Allergy Signs",
    product: "Daily Duo Skin Care",
    routine: "Omega oils + grooming + clean bedding"
  },
  dental: {
    title: "Dental Problem",
    product: "Daily Duo Dental Care",
    routine: "Brush + dental chews + vet check"
  },
  healthy: {
    title: "Your Dog is Healthy 🎉",
    product: "Daily Duo Maintenance",
    routine: "Balanced diet + play + love ❤️"
  }
};

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (value) => {
    setAnswers([...answers, value]);
    setStep(step + 1);
  };

  const getResult = () => {
    const count = {};
    answers.forEach((a) => {
      count[a] = (count[a] || 0) + 1;
    });

    let max = 0;
    let result = "healthy";

    for (let key in count) {
      if (count[key] > max) {
        max = count[key];
        result = key;
      }
    }

    return suggestions[result];
  };

  const progress = (step / quizData.length) * 100;

  if (step >= quizData.length) {
    const result = getResult();

    return (
      <section className="Quiz">
        <div className="Quiz__card">
          <h2>{result.title}</h2>
          <p><strong>Recommended:</strong> {result.product}</p>
          <p>{result.routine}</p>
          <button onClick={() => { setStep(0); setAnswers([]); }}>
            Restart Quiz
          </button>
        </div>
      </section>
    );
  }

  const current = quizData[step];

  return (
    <section className="Quiz">
      <div className="Quiz__card">

        <div className="Quiz__progress">
          <div
            className="Quiz__progressFill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <h2 className="Quiz__question">{current.question}</h2>

        <div className="Quiz__options">
          {current.options.map((opt, i) => (
            <button
              key={i}
              className="Quiz__option"
              onClick={() => handleAnswer(opt.value)}
            >
              {opt.text}
            </button>
          ))}
        </div>

        <p className="Quiz__step">
          Question {step + 1} / {quizData.length}
        </p>

      </div>
    </section>
  );
};

export default Quiz;