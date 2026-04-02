
import "./QuizBanner.css";

const QuizBanner = () => {
  return (
    <section className="QuizBanner">
      <div className="QuizBanner__overlay"></div>

      <div className="QuizBanner__container">
        {/* Top avatars + text */}
        <div className="QuizBanner__reviews">
          <div className="QuizBanner__avatars">
            <img src="/public/QuizDesktop/images/user1.jpg" alt="" />
            <img src="/public/QuizDesktop/images/user2.jpg" alt="" />
            <img src="/public/QuizDesktop/images/user3.jpg" alt="" />
            <img src="/public/QuizDesktop/images/user4.jpg" alt="" />
          </div>
          <p className="QuizBanner__reviewText">
            Loved by 50000+ of pet parents.
          </p>
        </div>

        {/* Heading */}
        <h1 className="QuizBanner__heading">
          IS YOUR DOG GASSY, SMELLY, OR ALWAYS ‘OFF’?
        </h1>

        {/* Subtext */}
        <p className="QuizBanner__subtext">
          We see you, pet parent. You're doing your best – but your dog’s gut,
          breath, or energy still feels… meh. That’s why we created{" "}
          <span>Daily Duo</span>: a 2-scoop solution to get your dog feeling
          (and smelling) their best self again.
        </p>

        {/* Buttons */}
        <div className="QuizBanner__buttons">
          <button className="QuizBanner__btn QuizBanner__btn--primary">
            Start The Quiz Now
          </button>
          <button className="QuizBanner__btn QuizBanner__btn--secondary">
            Continue Reading
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuizBanner;