import React, { useEffect, useState } from "react";

import img1 from "/dog-1.svg";
import img2 from "/dog-2.svg";
import img3 from "/dog-3.svg";
import img4 from "/dog-2.svg";
import img5 from "/dog-1.svg";

const images = [img1, img2, img3, img4, img5];

const Health = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="
      w-full max-w-[1920px] mx-auto
      bg-[#FAF9F5]
      px-[240px] py-[120px]
      flex justify-between items-center
      gap-[111px]
      max-lg:px-[120px]
      max-md:flex-col
      max-md:px-[16px]
      max-md:py-[32px]
      max-md:gap-[27px]
      "
    >
      {/* TEXT SECTION */}

      <div className="flex flex-col gap-6 max-w-[673px] max-md:items-center text-center md:text-left">

        <h1
          className="
          font-[Luckiest_Guy]
          text-[48px]
          leading-[125%]
          text-[#1A1A1A]
          max-md:text-[32px]
          max-md:w-[366px]
          "
        >
          THEIR HEALTH GLOWS. YOUR LIFE FLOWS WITH OTHER HALF!
        </h1>

        <p
          className="
          font-poppins
          font-medium
          text-[18px]
          leading-[152%]
          text-[#1A1A1A]
          max-w-[673px]
          max-md:w-[398px]
          "
        >
          Ditch the junk—Other Half crafts science-backed, human-grade
          supplements that pamper your pup with pure wellness. Think
          pumpkin-bacon yum, minus the fillers. Just pure, proven goodness
          for tail-wagging bliss!
        </p>

        <button
          className="
          w-[161px] h-[55px]
          rounded-full
          bg-[#0F4A12]
          text-[#EBF466]
          font-bold
          text-[18px]
          uppercase
          transition-all
          hover:bg-white
          hover:text-black
          max-md:w-[197px]
          "
        >
          SHOP NOW
        </button>
      </div>

      {/* IMAGE STACK */}

      <div className="relative w-[656px] h-[700px] max-md:w-full max-md:h-[424px]">

        {images.map((img, i) => {
          const pos = (i - index + images.length) % images.length;

          const styles = [
            "translate-y-[0px] scale-100 z-50 opacity-100",
            "translate-y-[15px] scale-95 z-40 opacity-90",
            "translate-y-[30px] scale-90 z-30 opacity-80",
            "translate-y-[45px] scale-[0.85] z-20 opacity-70",
            "translate-y-[60px] scale-[0.8] z-10 opacity-60",
          ];

          return (
            <img
              key={i}
              src={img}
              alt="dog"
              className={`
              absolute
              w-[620px] h-[700px]
              object-cover
              rounded-[20px]
              transition-all duration-700 ease-in-out
              ${styles[pos]}
              max-md:w-full max-md:h-[424px]
              `}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Health;