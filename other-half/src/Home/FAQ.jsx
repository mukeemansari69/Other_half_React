import { useState, useRef } from "react";
import "/public/Home/css/faq.css";

export default function FAQ({ heading, data }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const refs = useRef([]);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* 🔥 Dynamic Heading */}
        <h2
          className="text-center text-[#1A1A1A]"
          style={{
            fontFamily: "Luckiest Guy",
            fontSize: "clamp(34px, 5vw, 48px)",
            lineHeight: "125%",
          }}
        >
          {heading}
        </h2>

        <div className="flex flex-col gap-3">
          {data.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center text-left px-4 py-4 md:px-5 md:py-5"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(16px, 2vw, 20px)",
                    fontWeight: 500,
                  }}
                >
                  <span className={isActive ? "text-[#0F4A12] font-bold" : ""}>
                    {item.question}
                  </span>

                  <div className={`icon ${isActive ? "active" : ""}`}></div>
                </button>

                <div
                  ref={(el) => (refs.current[index] = el)}
                  className="px-4 md:px-5 overflow-hidden transition-all duration-300"
                  style={{
                    height: isActive
                      ? `${refs.current[index]?.scrollHeight}px`
                      : "0px",
                  }}
                >
                  <p
                    className="pb-4"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 1.5vw, 16px)",
                      lineHeight: "160%",
                    }}
                  >
                    {item.answer}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}