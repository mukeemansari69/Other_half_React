import React, { useEffect, useState } from "react";

import img1 from "/images/dog-1.svg";
import img2 from "/images/dog-2.svg";
import img3 from "/images/dog-3.svg";

const images = [img1, img2, img3];

const Health = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500); // thoda slow

    return () => clearInterval(slider);
  }, []);

  return (
    <section
      className="
      w-full
      bg-[#FAF9F5]
      px-6 md:px-12 lg:px-[120px] xl:px-[240px]
      py-10 md:py-16 lg:py-[120px]
      flex flex-col lg:flex-row
      items-center
      justify-between
      gap-10 lg:gap-[111px]
      "
    >
      {/* TEXT */}

      <div className="flex flex-col gap-8 max-w-[673px] text-center lg:text-left">

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

        <div className="lg:hidden flex justify-center">
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
          <button
            className="
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
          </button>
        </div>

      </div>

      {/* DESKTOP STACK */}

      <div className="hidden lg:block">
        <ImageStack images={images} index={index} />
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

      {/* decoration cards */}

      <div className="absolute inset-0 bg-[#F9F3D3] rounded-[20px] translate-x-4 translate-y-4"></div>
      <div className="absolute inset-0 bg-[#F4E7A1] rounded-[20px] translate-x-8 translate-y-8"></div>

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
            ${positions[pos]}
            `}
          />
        );

      })}
    </div>
  );
};