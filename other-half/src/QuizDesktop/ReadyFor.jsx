import React from "react";
import "/public/QuizDesktop/css//ReadyFor.css";

const ReadyFor = () => {
  return (
    <section className="ReadyFor">
      <div className="ReadyFor__container">
        
        <div className="ReadyFor__box">
          
          {/* Left Content */}
          <div className="ReadyFor__left">
            <h2 className="ReadyFor__heading">
              READY FOR A <br className="ReadyFor-mobile"/>
              HEALTHIER, HAPPIER <br  className="ReadyFor-mobile" />
              PUP?
            </h2>
          </div>

          {/* Right Content */}
          <div className="ReadyFor__right">
            <p className="ReadyFor__text">
              Take The Short Quiz. It’s Free, Fun, And Backed By Real Science.
            </p>

            <button className="ReadyFor__btn">
              Get Your Formula
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ReadyFor;

