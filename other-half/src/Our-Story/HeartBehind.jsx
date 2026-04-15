import React, { useRef, useState } from "react";
import "/public/OurStory/css/heart-behind.css";


const HeartBehind = () => {
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  const [playing, setPlaying] = useState(true);

  const toggleVideo = () => {
    const isMobile = window.innerWidth <= 768;

    const video = isMobile
      ? mobileVideoRef.current
      : desktopVideoRef.current;

    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }

    setPlaying(!playing);
  };

  const steps = [
    {
      num: "01",
      title: "Built on Love, Not Labels",
      text: "PetPlus was born from real-life dog struggles — not market trends. We started this to help our own pups when nothing else worked.",
    },
    {
      num: "02",
      title: "Purpose Over Fluff",
      text: "Every ingredient earns its place. No filler. No artificial flavors. Just vet-backed, human-grade goodness.",
    },
    {
      num: "03",
      title: "Simple Routines. Real Results.",
      text: "We believe small habits = big change. That’s why our scoops are made for real life — easy to serve, hard to forget.",
    },
  ];

  return (
    <section className="heart-behind">

      {/* DESKTOP */}
      <div className="hb-desktop">
        <div className="hb-video-wrapper">
          <video
            ref={desktopVideoRef}
            autoPlay
            loop
            muted
            className="hb-video"
          >
            <source src="/Home/images/dog1.mp4" type="video/mp4" />
          </video>

          <button onClick={toggleVideo} className="hb-video-btn">
            {playing ? "❚❚" : "▶"}
          </button>
        </div>

        {/* TEXT */}
        <div className="hb-content text-center hb-desktop-content">
          <p className="hb-subtitle">• PHILOSOPHY</p>

          <h2 className="hb-title">
            THE HEART BEHIND <br /> OGGIE
          </h2>

          <div className="flex flex-col items-center">
            {steps.map((item, i) => (
              <div key={i} className="hb-step text-center">
                <div className="hb-circle">{item.num}</div>
                <h2 className="hb-subheading">{item.title}</h2>
                <p className="hb-para">{item.text}</p>
                {i !== steps.length - 1 && <div className="hb-line"></div>}
              </div>
            ))}
          </div>
        </div>

        <img src="/OurStory/images/small-dog.png" alt="dog" className="hb-dog" />
      </div>

      {/* MOBILE */}
     {/* ================= MOBILE ================= */}
<div className="hb-mobile">

  {/* VIDEO */}
  <div className="hb-m-video-wrapper">
    <video
      ref={mobileVideoRef}
      autoPlay
      loop
      muted
      className="hb-m-video"
    >
      <source src="/Home/images/dog1.mp4" type="video/mp4" />
    </video>

    <button onClick={toggleVideo} className="hb-m-btn">
      {playing ? "❚❚" : "▶"}
    </button>
  </div>

  {/* TEXT */}
  <div className="hb-m-content">

    <p className="hb-m-subtitle">• PHILOSOPHY</p>

    <h2 className="hb-m-title">
      THE HEART BEHIND OGGIE
    </h2>

    <div className="hb-m-steps">
      {steps.map((item, i) => (
        <div key={i} className="hb-m-step">

          <div className="hb-m-circle">{item.num}</div>

          <h3 className="hb-m-step-title">{item.title}</h3>

          <p className="hb-m-step-text">{item.text}</p>

          {i !== steps.length - 1 && (
            <div className="hb-m-line"></div>
          )}
        </div>
      ))}
    </div>

  </div>
</div>

    </section>
  );
};

export default HeartBehind;


