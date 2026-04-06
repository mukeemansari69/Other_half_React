import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";

import ClinicalHero from "../Clinical/ClinicalHero";
import HomeHeroSection from "./HomeHeroSection";
import ScienceHero from "../Science/ScienceHero";

import "swiper/css";
import "/public/Home/css/heroBanner.css";

const heroSlides = [
  {
    id: "home",
    label: "Home banner",
    render: () => <HomeHeroSection />,
  },
  {
    id: "clinical",
    label: "Clinical banner",
    render: () => <ClinicalHero isolated />,
  },
  {
    id: "science",
    label: "Science banner",
    render: () => <ScienceHero />,
  },
];

export default function HeroBanner() {
  const swiperRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section
      className="home-hero-slider"
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}   // ✅ hover pause
      onMouseLeave={() => swiperRef.current?.autoplay.start()} // ✅ resume
    >
      <div className="home-hero-slider__shell">
        <Swiper
          modules={[Autoplay, A11y]}
          slidesPerView={1}
          loop
          speed={850}
          grabCursor
          allowTouchMove

          // ✅ AUTOPLAY
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}

          // ✅ HEIGHT FIX
          autoHeight={true}
          observer={true}
          observeParents={true}

          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveSlide(swiper.realIndex);
          }}

          onSlideChange={(swiper) => {
            setActiveSlide(swiper.realIndex);
          }}

          className="home-hero-slider__swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="home-hero-slider__slide">
                {slide.render()}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PAGINATION */}
        <div className="home-hero-slider__pagination">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`home-hero-slider__indicator ${
                activeSlide === index ? "is-active" : ""
              }`}
              onClick={() => swiperRef.current?.slideToLoop(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}