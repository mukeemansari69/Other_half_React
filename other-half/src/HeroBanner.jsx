export default function HeroBanner() {
  return (
    <section
      className="
      w-full
      bg-no-repeat
      bg-cover
      bg-center
      pt-[41px] pb-[41px] px-[24px]
      lg:pt-[160px] lg:pb-[160px] lg:px-[120px]
      "
      style={{
        backgroundImage: "url('/images/banner-img.png')",
      }}
    >
      {/* Desktop Background */}
      <style>
        {`
          @media (min-width: 1024px){
            section{
             /*  background-image:url('/mobile-banner.png'); */
            }
          }
        `}
      </style>

      <div className="max-w-[1920px] mx-auto">

        {/* TEXT CONTAINER */}
        <div
          className="
          max-w-[795px]
          flex
          flex-col
          gap-[21px]
          lg:gap-[53px]
          text-center
          lg:text-left
          "
        >

          {/* HEADING */}
          <h1
            className="
            font-[Luckiest_Guy]
            text-[38px]
            leading-[122%]
            lg:text-[80px]
            lg:leading-[125%]
            text-[#1A1A1A]
            "
          >
            Better Health, One Scoop At A Time.
          </h1>

          {/* SUB HEADING */}
          <p
            className="
            font-[Poppins]
            text-[16px]
            lg:text-[20px]
            leading-[150%]
            text-[#1A1A1A]
            max-w-[620px]
            mx-auto
            lg:mx-0
            "
          >
            Fix Every Pup Problem with the Daily Duo, Perfectly Matched to Their
            Breed, Age, and Tail-Wagging Needs!
          </p>

          {/* BUTTONS */}
          <div
            className="
            flex
            gap-[12px]
            justify-center
            lg:justify-start
            "
          >

            {/* LEARN MORE */}
            <button
              className="
              px-[30px]
              py-[14px]
              rounded-[333px]
              bg-[#FAF9F5]
              text-black
              font-semibold
              text-[18px]
              uppercase
              transition
              hover:bg-[#0F4A12]
              hover:text-[#EBF466]
              "
            >
              Learn More
            </button>

            {/* SHOP NOW */}
            <button
              className="
              px-[30px]
              py-[14px]
              rounded-[333px]
              bg-[#0F4A12]
              text-[#EBF466]
              font-bold
              text-[18px]
              uppercase
              transition
              hover:bg-[#FAF9F5]
              hover:text-black
              "
            >
              Shop Now
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}