import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "/public/Home/css/health.css";
import img1 from "/Home/images/dog-1.svg";
import img2 from "/Home/images/dog-2.svg";
import img3 from "/Home/images/dog-3.svg";

const images = [img1, img2, img3];

const Health = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(slider);
  }, []);

  return (
    <section className="w-full bg-[#FAF9F5] flex justify-center health-container">
      
      {/* ✅ CENTER CONTAINER */}
      <div
        className="
        w-full
        max-w-[1440px]
        px-6 md:px-12 lg:px-[0px] xl:px-[0px]
        py-10 md:py-16 lg:py-[0px]
        flex flex-col lg:flex-row
        items-center
        justify-between
        gap-10 lg:gap-[0px]
        health-section"
      >

        {/* TEXT */}
        <div className="flex flex-col gap-8 max-w-[673px] text-center lg:text-left mobile-gap">

          <h1
            className="
            font-[Luckiest_Guy]
            text-[32px]
            md:text-[40px]
            lg:text-[48px]
            leading-[125%]
            text-[#1A1A1A]
            "
          >
            THEIR HEALTH GLOWS. YOUR LIFE FLOWS WITH OTHER HALF!
          </h1>

          {/* MOBILE STACK */}
          <div className="lg:hidden flex justify-center mobile-stack">
            <ImageStack images={images} index={index} />
          </div>

          <p
            className="
            font-poppins
            text-[16px]
            md:text-[18px]
            leading-[160%]
            text-[#1A1A1A]
            px-2 md:px-0 mt-5 md:mt-0
            "
          >
            Ditch the junk—Other Half crafts science-backed, human-grade
            supplements that pamper your pup with pure wellness. Think
            pumpkin-bacon yum, minus the fillers. Just pure, proven goodness for tail-wagging bliss!
          </p>

          <div className="flex justify-center lg:justify-start">
            <NavLink
  to="/collection"
  className="
    inline-flex
    items-center
    justify-center
    h-[55px]
    px-8
    rounded-full
    bg-[#0F4A12]
    text-[#EBF466]
    font-bold
    uppercase
    text-[16px]
    md:text-[18px]
    transition-all duration-300
    hover:bg-white hover:text-black
  "
>
  SHOP NOW
</NavLink>
          </div>

        </div>

        {/* DESKTOP STACK */}
        <div className="hidden lg:block">
          <ImageStack images={images} index={index} />
        </div>

      </div>
    </section>
  );
};

export default Health;


/* IMAGE STACK */

const ImageStack = ({ images, index }) => {

  const positions = [
    "translate-y-0 scale-100 z-30",
    "translate-y-6 scale-[0.96] z-20",
    "translate-y-12 scale-[0.92] z-10"
  ];

  return (
    <div className="relative w-[320px] h-[360px] md:w-[420px] md:h-[460px] lg:w-[620px] lg:h-[700px]">

     

      {images.map((img, i) => {

        const pos = (i - index + images.length) % images.length;

        return (
          <img
            key={i}
            src={img}
            alt="dog"
            className={`
            absolute
            w-full h-full
            object-cover
            rounded-[20px]
            shadow-xl
            transform-gpu
            transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            health-image
            ${positions[pos]}
            `}
          />
        );

      })}
    </div>
  );
};

