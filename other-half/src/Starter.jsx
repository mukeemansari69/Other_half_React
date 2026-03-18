import React from "react";

export default function Starter() {
  return (
    <section
      aria-label="starter-duo"
      className="w-full bg-[#FAF9F5] text-[#1A1A1A] flex justify-center"
    >
      <div className="w-full max-w-[1920px] pb-1 px-6 flex flex-col md:flex-row items-center">

        {/* ✅ DESKTOP IMAGE (same as before) */}
        <div className="hidden md:flex md:w-[1065px] w-full justify-center items-start">
          <img
            src="/images/strater-duo.svg"
            alt="Starter duo product"
            className="max-w-full h-auto md:h-[738px] object-contain"
          />
        </div>

        {/* TEXT CONTAINER */}
        <div className="md:w-[609px] w-full flex flex-col gap-6 md:gap-8 items-start mt-6 md:mt-0">
          
          {/* Heading */}
          <h1
            className="text-[34px] md:text-[48px] leading-[125%] w-full text-center md:text-left"
            style={{ fontFamily: "'Luckiest Guy', cursive", fontWeight: 400 }}
          >
            THE STARTER DUO
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 w-full justify-center md:justify-start">
            <div
              className="text-[16px] font-[500]"
              style={{ fontFamily: "Poppins, sans-serif"}}
            >
              Best
            </div>

            <div className="flex items-center gap-1">
  {Array.from({ length: 5 }).map((_, i) => (
    <svg
      key={i}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="#F7C948"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.27 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  ))}
</div>

            <div
              className="text-[16px] font-[500]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              10,000+ Reviews
            </div>
          </div>

          {/* Subtext */}
          <div
            className="text-[18px] font-[500] leading-[152%] flex flex-col gap-4 text-center md:text-left"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <p>
              The Multitaskers Your Dog Didn’t Know They Needed — One scoop for
              gut, joint, and immune support. The other for dental domination.
            </p>

            <p className="font-[700]">
              Together? They’re basically superhero sidekicks.
            </p>
          </div>

          {/* ✅ MOBILE IMAGE (NEW - only mobile me show hogi) */}
          <div className="flex md:hidden w-full justify-center">
            <img
              src="/images/strater-duo.svg"
              alt="Starter duo product"
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* Tick List */}
          <div className="flex flex-col gap-4">
            <TickItem title="Immunity, digestion, joints?" subtitle="Handled." />
            <TickItem title="Fresh breath and clean chompers?" subtitle="Nailed it." />
            <TickItem title="Daily Duo?" subtitle="Doubled up on wellness." />
          </div>

          <div
            className="text-[18px] font-[500] leading-[152%] text-[#1A1A1A]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Why settle for one when you can double the good stuff?
          </div>

          {/* Button */}
          <div className="pt-2 w-full flex justify-center md:justify-start">
            <a
              href="#"
              className="
              inline-block h-[55px] rounded-[333px]
              flex items-center justify-center
              px-8 py-[14px]
              bg-[#0F4A12] text-[#EBF466]
              font-[700] uppercase text-[18px]
              transition duration-200 ease-in-out
              border-2 border-transparent
              hover:bg-white hover:text-black
              "
              style={{ fontFamily: "Poppins, sans-serif",marginBottom: "30px" }}
            >
              Shop Daily Duo Now
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

/* Tick Item Component */

function TickItem({ title, subtitle }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#E8754C" />
          <path
            d="M17 8.5L10.5 15 7 11.5"
            stroke="#fff"
            strokeWidth="1.8"
          />
        </svg>
      </div>

      <div className="text-[20px]" style={{ fontFamily: "Poppins, sans-serif" }}>
        <span className="font-[700]">{title} </span>
        <span className="font-[500]">{subtitle}</span>
      </div>
    </div>
  );
}