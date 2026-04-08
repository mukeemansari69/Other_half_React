// ScoopOne.jsx
import React, { useState, useRef } from "react";
import "/public/Product/css/ScoopOne.css";
const data = [
  {
    question: "Enhance Joint Mobility",
    answer:
      "Keep those zoomies strong! Our formula supports cartilage health and reduces stiffness—perfect for active or aging pups.",
  },
  { question: "Immunity Boost", answer: "Boost your pet's immune system naturally." },
  { question: "Soothe Allergies", answer: "Helps reduce itching and allergies." },
  { question: "Nourish Skin & Coat", answer: "For shiny coat and healthy skin." },
  { question: "Better Digestion", answer: "Supports gut health and digestion." },
  { question: "Healthy Aging", answer: "Promotes longevity and vitality." },
];

const ScoopOne = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const togglePlay = () => {
    handleVideoClick();
  };

  return (
    <section className="scoopone-container flex flex-col lg:flex-row">
      {/* VIDEO SECTION */}
      <div className="scoopone-video-wrapper">
        <video
          ref={videoRef}
          className="scoopone-video"
          src="public\Product\images\dog-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          onClick={handleVideoClick}
        />

        <div className="scoopone-video-controls">
          <button onClick={toggleMute}>
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="scoopone-content-wrapper flex flex-col justify-center">
        <p className="scoopone-how-it-works">HOW IT WORKS</p>
        <h2 className="scoopone-heading">SCOOP ONCE. SMILE FOREVER.</h2>

        <div className="scoopone-accordion">
          {data.map((item, index) => (
            <div
              key={index}
              className={`scoopone-accordion-item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <div
                className="scoopone-accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.question}</span>
                <div className="scoopone-icon">
                  {activeIndex === index ? "-" : "+"}
                </div>
              </div>

              <div className="scoopone-accordion-content">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScoopOne;
