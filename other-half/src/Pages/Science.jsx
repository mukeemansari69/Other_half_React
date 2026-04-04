import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, BadgeCheck, Beaker, Microscope, ShieldCheck } from "lucide-react";

import Marque from "../Home/Marque";
import Features from "../Home/Features";
import { dailyDuoProductData, dogDentalProductData, everydayProductData } from "../productData";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const scienceHighlights = [
  {
    title: "Same brand theme",
    text: "Luckiest Guy headings, green and lime palette, rounded cards, aur playful layout ko preserve kiya gaya hai.",
    icon: ShieldCheck,
  },
  {
    title: "Hover product cards",
    text: "Banner ke neeche teen cards diye gaye hain jo current collection style ko match karte hain aur hover par zyada alive feel karte hain.",
    icon: BadgeCheck,
  },
  {
    title: "Deep product details",
    text: "Har formula ke liye alag science section hai jahan benefits, tags, routine logic, aur CTA button diya gaya hai.",
    icon: Microscope,
  },
];

const products = [
  {
    id: "everyday",
    anchor: "everyday-science",
    route: "/product",
    cardTag: "Foundation Formula",
    cardImage: "/Default/images/col1.png",
    detailImage: "/Product/images/p1.png",
    tone: "bg-[#F4FAE8]",
    accent: "text-[#0F4A12]",
    title: "Everyday Daily Multivitamin",
    description: "A single scoop for joints, digestion, immunity, skin, and coat support.",
    product: everydayProductData,
    making: [
      "Build the base around wide-coverage actives already listed in your data like bovine colostrum, spirulina, turmeric, glucosamine, MSM, and probiotics.",
      "Keep the format scoopable so the formula fits directly into a feeding routine instead of becoming extra work for the owner.",
      "Use size-based plans so the same product works from small dogs to XL dogs.",
    ],
    bestFor: [
      "Full-body daily support",
      "Dogs with multiple wellness goals",
      "Simple one-product routines",
    ],
  },
  {
    id: "dental",
    anchor: "dental-science",
    route: "/doggie-dental",
    cardTag: "Oral Care System",
    cardImage: "/Default/images/col2.png",
    detailImage: "/Product/images/dogi-dental-powder.png",
    tone: "bg-[#FFF1EA]",
    accent: "text-[#E8744A]",
    title: "Doggie Dental Powder",
    description: "A no-brush powder routine focused on plaque, tartar, breath, and gums.",
    product: dogDentalProductData,
    making: [
      "Start with oral-care outcomes first: fresh breath, cleaner teeth, healthier gums, and less plaque build-up.",
      "Choose a sprinkle format so daily compliance becomes easier than brushing.",
      "Support the story with your existing tags like plaque control, probiotics, enzymes, seaweed, and oral care.",
    ],
    bestFor: [
      "Bad breath concerns",
      "Low-brush households",
      "Dogs needing easy oral support",
    ],
  },
  {
    id: "duo",
    anchor: "duo-science",
    route: "/dailyduo",
    cardTag: "Stacked Routine",
    cardImage: "/Default/images/col3.png",
    detailImage: "/Product/images/multi.png",
    tone: "bg-[#F0FFF3]",
    accent: "text-[#56C271]",
    title: "Daily Duo Bundle",
    description: "A paired routine that combines whole-body wellness with oral care in one stack.",
    product: dailyDuoProductData,
    making: [
      "Pair the multivitamin logic with the dental routine so more health goals get handled in one feeding moment.",
      "Reduce decision fatigue by packaging both formulas as one clear stack instead of asking shoppers to build their own bundle.",
      "Keep the value story visible with bundle-based plans and direct product navigation.",
    ],
    bestFor: [
      "Customers wanting the strongest routine",
      "Dogs needing body + mouth support",
      "Higher value repeat-purchase shoppers",
    ],
  },
];

const getStartingPrice = (product) => product?.sizes?.[0]?.plans?.[0]?.price ?? 0;
const getBenefits = (product) => (product?.benefits ?? []).slice(0, 4).map((item) => item.text);
const getTags = (product) => (product?.tags ?? []).slice(0, 4);

const ButtonLink = ({ to, children, dark = true }) => (
  <NavLink
    to={to}
    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold uppercase tracking-[0.08em] transition ${
      dark
        ? "bg-[#0F4A12] text-[#EBF466] hover:bg-[#1A1A1A] hover:text-white"
        : "bg-white text-[#1A1A1A] hover:bg-[#EBF466]"
    }`}
  >
    {children}
    <ArrowRight size={16} />
  </NavLink>
);

const Science = () => {
  return (
    <main className="w-full overflow-hidden bg-[#FFFCF2] text-[#1A1A1A]">
      <section
        className="px-6 py-16 lg:px-[120px] lg:py-28"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,252,242,0.96) 0%, rgba(255,252,242,0.88) 45%, rgba(255,252,242,0.45) 100%), url('/Home/images/banner-img.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-[1440px]">
          <span className="inline-flex rounded-full bg-[#EBF466] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
            The science behind the products
          </span>
          <h1 className="mt-6 max-w-[860px] font-[Luckiest_Guy] text-[42px] leading-[1.08] sm:text-[56px] lg:text-[88px]">
            Science That Matches Your Current Theme.
          </h1>
          <p className="mt-6 max-w-[760px] text-[17px] leading-[1.85] text-[#1A1A1A]/78 lg:text-[20px]">
            Yeh naya page aapke existing code ko read karke banaya gaya hai.
            Is mein same font structure, same brand colors, banner style, hover cards,
            aur three product-specific science sections include kiye gaye hain.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/collection">Shop the science</ButtonLink>
            <a
              href="#science-products"
              className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/15 bg-white px-6 py-3 text-[14px] font-semibold uppercase tracking-[0.08em] transition hover:bg-[#0F4A12] hover:text-[#EBF466]"
            >
              Explore products
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <Marque />

      <section className="px-6 py-16 lg:px-[120px] lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-3">
          {scienceHighlights.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[30px] border border-[#1A1A1A]/8 bg-white p-7 shadow-[0_18px_44px_rgba(0,0,0,0.05)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4A12] text-[#EBF466]">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-[24px] font-semibold leading-[1.25]">{title}</h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-[#1A1A1A]/74">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="science-products" className="scroll-mt-28 px-6 pb-16 lg:px-[120px] lg:pb-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center">
            <h2 className="font-[Luckiest_Guy] text-[38px] leading-[1.1] lg:text-[64px]">
              Three Products, Three Science Stories.
            </h2>
            <p className="mx-auto mt-4 max-w-[720px] text-[16px] leading-[1.8] text-[#1A1A1A]/74">
              Banner ke neeche aapki request ke mutabiq three hover cards add ki gayi hain.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {products.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col rounded-[30px] border border-[#1A1A1A]/8 bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(15,74,18,0.16)]"
              >
                <span className="absolute left-0 top-6 rounded-r-full bg-[#E8744A] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
                  {item.cardTag}
                </span>

                <div className="mt-10 rounded-[24px] bg-[#FAF9F5] p-6 transition group-hover:bg-[#EBF466]">
                  <img
                    src={item.cardImage}
                    alt={item.title}
                    className="mx-auto h-[240px] w-full object-contain transition duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <h3 className="mt-6 text-[28px] font-semibold leading-[1.2]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-[#1A1A1A]/75">{item.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {getTags(item.product).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#EBF466] px-3 py-1.5 text-[12px] font-semibold text-[#0F4A12]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-[22px] bg-[#F7FAF1] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                    Starting from
                  </p>
                  <p className="mt-2 text-[30px] font-bold text-[#0F4A12]">
                    {formatPrice(getStartingPrice(item.product))}
                  </p>
                </div>

                <div className="mt-6">
                  <ButtonLink to={item.route}>Go to product page</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-[120px] lg:pb-24">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
          {products.map((item, index) => (
            <article
              id={item.anchor}
              key={item.id}
              className={`overflow-hidden rounded-[36px] border border-[#1A1A1A]/8 ${item.tone} shadow-[0_24px_70px_rgba(0,0,0,0.06)]`}
            >
              <div className={`grid gap-0 lg:grid-cols-[1fr_1.2fr] ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="flex min-h-[320px] items-center justify-center bg-[#1A1A1A] p-8">
                  <img src={item.detailImage} alt={item.title} className="h-[280px] w-full max-w-[340px] object-contain" />
                </div>

                <div className="p-8 lg:p-10">
                  <span className={`inline-flex rounded-full bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${item.accent}`}>
                    science section
                  </span>
                  <h2 className="mt-5 font-[Luckiest_Guy] text-[34px] leading-[1.08] lg:text-[54px]">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-[16px] leading-[1.85] text-[#1A1A1A]/78">
                    {item.product.description}
                  </p>

                  <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
                    <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                      <h3 className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#0F4A12]">
                        How to make it
                      </h3>
                      <div className="mt-5 space-y-4">
                        {item.making.map((step, stepIndex) => (
                          <div key={step} className="flex gap-4 rounded-[20px] bg-[#FAF9F5] p-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF466] text-[15px] font-bold text-[#0F4A12]">
                              {stepIndex + 1}
                            </div>
                            <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/78">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                        <h3 className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#0F4A12]">
                          Key benefits
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {getBenefits(item.product).map((benefit) => (
                            <span
                              key={benefit}
                              className="rounded-full border border-[#0F4A12]/10 bg-[#F7FAF1] px-3 py-2 text-[13px] font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                        <h3 className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#0F4A12]">
                          Best for
                        </h3>
                        <div className="mt-4 space-y-3">
                          {item.bestFor.map((point) => (
                            <div key={point} className="flex gap-3">
                              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F4A12] text-[#EBF466]">
                                <BadgeCheck size={14} />
                              </div>
                              <p className="text-[15px] leading-[1.75] text-[#1A1A1A]/78">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[28px] bg-[#0F4A12] p-6 text-white shadow-[0_14px_32px_rgba(15,74,18,0.16)]">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#EBF466]">
                          Current site data
                        </p>
                        <p className="mt-3 text-[32px] font-bold leading-none">
                          {formatPrice(getStartingPrice(item.product))}
                        </p>
                        <p className="mt-3 text-[15px] leading-[1.75] text-white/80">
                          Existing route button ke saath connected pricing snapshot.
                        </p>
                        <div className="mt-5">
                          <ButtonLink to={item.route} dark={false}>Open product</ButtonLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Features />

      <section className="px-6 py-16 lg:px-[120px] lg:py-24">
        <div className="mx-auto max-w-[1440px] rounded-[40px] bg-[#1A1A1A] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] lg:p-12">
          <span className="inline-flex rounded-full bg-[#EBF466] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
            Added extra section
          </span>
          <h2 className="mt-5 max-w-[780px] font-[Luckiest_Guy] text-[36px] leading-[1.08] text-[#FFFCF2] lg:text-[58px]">
            A Good Science Page Should Also Push The Next Action.
          </h2>
          <p className="mt-4 max-w-[760px] text-[16px] leading-[1.85] text-white/76">
            Is liye final CTA bhi add kiya gaya hai taa-ke user reading ke baad
            ya collection par jaye ya quiz ke through correct product tak pohanche.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/collection" dark={false}>Visit collection</ButtonLink>
            <ButtonLink to="/quiz">Take the quiz</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Science;
