import React, { useEffect, useRef, useState } from "react";
import "/public/OurStory/css/dogPeople.css";

const data = [
  {
    name: "AJ Patel & Oggie",
    role: "Co-Founder",
    desc: "AJ Patel started this company to help dogs like Oggie — a pup with a sensitive stomach and bad breath.",
    img: "/OurStory/images/random.png",
  },
  {
    name: "Mike Watts & Theo",
    role: "Co-Founder",
    desc: "Helping dogs live healthier lives with better nutrition and care.",
    img: "/OurStory/images/aj-patel.jpg",
  },
  {
    name: "Priya & Boomer",
    role: "Head of formulation",
    desc: "Crafting high-quality supplements that dogs actually love.",
    img: "/OurStory/images/random.png",
  },
];

const DogPeople = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const cardWidth = 300;

  // ✅ screen detect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto slide ONLY mobile/tablet
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  return (
    <section className="bg-[#FAF9F5] w-full dog-section">

      {/* Heading */}
      <div className="text-center ">
        <h2 className="dog-heading">
          MADE BY DOG PEOPLE, FOR DOG PEOPLE
        </h2>
        <p className="dog-subtext mt-4">
          Meet a few members of our tail-wagging, treat-stealing, supplement-obsessed pack.
        </p>
      </div>

      {/* Slider Wrapper */}
      <div className="dog-slider-wrapper">

        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: isMobile
              ? `translateX(calc(50% - ${index * cardWidth + cardWidth / 2}px))`
              :`none`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {data.map((item, i) => (
            <div key={i} className="dog-card">
              <img src={item.img} alt="" loading="lazy" decoding="async" className="dog-img" />

              <div className="dog-overlay">
                <h3>{item.name}</h3>
                <p className="role">{item.role}</p>
                <p className="desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {data.map((_, i) => (
          <div
            key={i}
            className={`indicator ${i === index ? "active" : ""}`}
          />
        ))}
      </div>

    </section>
  );
};

export default DogPeople;

