import React from "react";
import "/public/QuizDesktop/css/QuizBannerCards.css";

const cardData = [
  {
    title: "Moving Slower Than Usual",
    desc: "Less zoomies, more 'meh.' If your pup’s stiff, limping, or avoiding stairs, their joints might be waving a white flag.",
    img: "/public/QuizDesktop/images/d1.jpg",
  },
  {
    title: "Gut Drama Meets Itchy Chaos",
    desc: "Frequent tummy issues? Gassy nights? Random scratching fits? Sounds like their gut and skin are throwing tantrums.",
    img: "/public/QuizDesktop/images/dc2.png",
  },
  {
    title: "Breath That Bites Back",
    desc: "If your dog’s kisses make you flinch, their mouth might need more than a dental chew. Constant licking’s a clue too.",
    img: "/public/QuizDesktop/images/d3.jpg",
  },
];

const QuizBannerCards = () => {
  return (
    <section className="QuizBannerCards">
      <div className="QuizBannerCards__container">

        {/* Heading */}
        <h2 className="QuizBannerCards__heading">
        Common Signs Your Dog Might Not &nbsp;
        <br className="QuizBannerCards-mobile"/>
 Be Feeling Their Best
        </h2>

        {/* Cards */}
        <div className="QuizBannerCards__grid">
          {cardData.map((card, index) => (
            <div key={index} className="QuizBannerCards__card">
              <img
                src={card.img}
                alt={card.title}
                className="QuizBannerCards__image"
              />
              <h3 className="QuizBannerCards__cardTitle">
                {card.title}
              </h3>
              <p className="QuizBannerCards__cardDesc">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="QuizBannerCards__bottom">
          <p className="QuizBannerCards__notice">
            Noticing any of these?
          </p>
          <p className="QuizBannerCards__subNotice">
            You're already doing the right thing by paying attention. 
            Let’s get them feeling their best — naturally.
          </p>
        </div>

        {/* Button */}
        <div className="QuizBannerCards__btnWrap">
          <button className="QuizBannerCards__btn">
            TAKE QUIZ NOW
          </button>
        </div>

      </div>
    </section>
  );
};

export default QuizBannerCards;