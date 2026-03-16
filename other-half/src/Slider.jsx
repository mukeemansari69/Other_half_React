import React from "react";

const items = [
  {
    text: "Clean, science-backed",
    img: "/images/slider-2.svg",
  },
  {
    text: "Designed to combat the root causes of bad breath, plaque and tartar in dogs",
    img: "/images/slider-1.svg",
  },
  {
    text: "Pet food industry approved",
    img: "/images/slider-3.svg",
  },
  {
    text: "Trusted by experts",
    img: "/images/slider-5.png",
  },
  {
    text: "A comprehensive oral health solution",
    img: "/images/slide-4.svg",
  },
];

export default function Slider() {
  const loopItems = [...items, ...items, ...items]; // seamless loop

  return (
    <div className="w-full overflow-hidden bg-[#E8754C] py-8 group">
      <div className="flex gap-8 w-max animate-infinite-slider group-hover:[animation-play-state:paused]">

        {loopItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between items-center min-w-[240px] max-w-[350px] h-[134px] gap-[42px]"
          >
            <p className="text-white text-center font-medium text-[16px] leading-[175%] font-[Poppins]">
              "{item.text}"
            </p>

            <img
              src={item.img}
              alt="logo"
              className="max-w-[120px] h-auto object-contain"
            />
          </div>
        ))}

      </div>
    </div>
  );
}