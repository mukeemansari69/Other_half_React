import React from "react";
import { getImagePerformanceProps } from "../utils/imagePerformance.js";

const items = [
  {
    text: "Clean, science-backed",
    img: "/Home/images/slider-2.svg",
  },
  {
    text: "Designed to combat the root causes of bad breath, plaque and tartar in dogs",
    img: "/Home/images/slider-1.svg",
  },
  {
    text: "Pet food industry approved",
    img: "/Home/images/slider-3.svg",
  },
  {
    text: "Trusted by experts",
    img: "/Home/images/slider-5.webp",
  },
  {
    text: "A comprehensive oral health solution",
    img: "/Home/images/slide-4.svg",
  },
];

export default function Slider() {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-[#E8754C] flex justify-center overflow-hidden py-6 md:py-8">
      
      {/* ✅ 1920 CONTAINER */}
      <div className="w-full max-w-[1920px] overflow-hidden">
        
        <div className="flex gap-6 md:gap-8 w-max animate-infinite-slider group-hover:[animation-play-state:paused]">

          {loopItems.map((item, index) => (
            <div
              key={index}
              className="
              flex flex-col justify-between items-center
              min-w-[180px] sm:min-w-[220px] md:min-w-[240px]
              max-w-[260px] md:max-w-[320px]
              h-[110px] sm:h-[120px] md:h-[134px]
              gap-[24px] md:gap-[42px]
              px-2
              "
            >
              <p
                className="
                text-white text-center font-medium
                text-[13px] sm:text-[14px] md:text-[16px]
                leading-[150%] md:leading-[175%]
                font-[Poppins]
                "
              >
                "{item.text}"
              </p>

              <img
                {...getImagePerformanceProps(item.img)}
                alt="logo"
                className="
                max-w-[80px] sm:max-w-[100px] md:max-w-[120px]
                h-auto object-contain
                "
              />
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
