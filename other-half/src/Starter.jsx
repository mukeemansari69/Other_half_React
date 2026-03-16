import React from "react";

/**
 * Place images in public/images/
 * - /images/starter-product-desktop.png
 * - /images/starter-product-mobile.png
 *
 * Component name: Starter
 */

export default function Starter() {
  return (
    <section
      aria-label="starter-duo"
      className="w-full bg-[#FAF9F5] text-[#1A1A1A] pb-1 px-6 flex flex-col md:flex-row items-center"
    >
      {/* IMAGE */}
      <div className="order-2 md:order-1 md:w-[1065px] w-full flex justify-center items-start">
        <img
          src="/images/strater-duo.svg"
          alt="Starter duo product"
          className="max-w-full h-auto md:h-[738px] object-contain"
        />
      </div>

      {/* TEXT CONTAINER */}
      <div className="order-1 md:order-2 md:w-[609px] w-full flex flex-col gap-6 md:gap-8 items-start mt-6 md:mt-0">
        {/* Heading */}
        <h1
          className="text-[34px] md:text-[48px] leading-[125%]"
          style={{ fontFamily: "'Luckiest Guy', cursive", fontWeight: 400 }}
        >
          THE STARTER DUO
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-3 w-full ">
          <div
            className="text-[16px] font-[500]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Best
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2 max-w-[116px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#F7C948"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.553L19.335 24 12 19.771 4.665 24l1.636-8.697L.6 9.75l7.732-1.732L12 .587z" />
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
          className="text-[18px] font-[500] leading-[152%] flex flex-col gap-4"
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

        {/* Tick List */}
        <div className="flex flex-col gap-4">
          <TickItem
            title="Immunity, digestion, joints?"
            subtitle="Handled."
          />
          <TickItem
            title="Fresh breath and clean chompers?"
            subtitle="Nailed it."
          />
          <TickItem
            title="Daily Duo?"
            subtitle="Doubled up on wellness."
          />
        </div>
        <div
  className="text-[18px] font-[500] leading-[152%] text-[#1A1A1A]"
  style={{ fontFamily: "Poppins, sans-serif" }}
>
 Why settle for one when you can double the good stuff?
</div>
      
        {/* CTA Button */}
        <div className="pt-2">
          <a
            href="#"
            className="inline-block h-[55px] rounded-[333px] flex items-center justify-center px-8 py-[14px]
            bg-[#0F4A12] text-[#EBF466] font-[700] uppercase text-[18px] leading-[100%]
            transition duration-200 ease-in-out border-2 border-transparent
            hover:bg-white hover:text-black"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Shop Daily Duo Now
          </a>
        </div>
      </div>
    </section>
  );
}

/* Tick Item Component */

function TickItem({ title, subtitle }) {
  return (
    <div className="flex items-center gap-4">
      {/* Tick Icon */}
      <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="12" fill="#E8754C" />
          <path
            d="M17 8.5L10.5 15 7 11.5"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div
        className="text-[20px]"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <span className="font-[700]">{title} </span>
        <span className="font-[500]">{subtitle}</span>
      </div>
    </div>
  );
}