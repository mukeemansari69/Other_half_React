import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, BadgeCheck, Microscope, ShieldCheck } from "lucide-react";

import Features from "../Home/Features";
import Marque from "../Home/Marque";
import ScienceHero from "../Science/ScienceHero";
import {
  dailyDuoProductData,
  dogDentalProductData,
  everydayProductData,
} from "../productData";
import { formatStoreCurrency } from "../../shared/storefrontConfig.js";

const formatPrice = (value) => formatStoreCurrency(value);

const scienceHighlights = [
  {
    title: "Complete Daily Nutrition",
    text: "A powerful blend of clinically proven ingredients that supports your dog's overall health - from digestion to immunity and long-term vitality.",
    icon: ShieldCheck,
  },
  {
    title: "Gut & Immune Support",
    text: "Formulated to improve digestion, strengthen immunity, and help your dog absorb nutrients better for a healthier and more active life.",
    icon: BadgeCheck,
  },
  {
    title: "Dental & Skin Care",
    text: "Helps reduce plaque buildup, freshens breath, and promotes a healthier coat and skin - keeping your dog looking and feeling great.",
    icon: Microscope,
  },
];

const products = [
  {
    id: "everyday",
    anchor: "everyday-science",
    route: "/product",
    detailClass: "science-product-detail--foundation",
    cardTag: "Foundation Formula",
    cardImage: "/Default/images/col1.png",
    detailImage: "/Science/images/everyday.png",
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
    detailClass: "science-product-detail--dental",
    cardTag: "Oral Care System",
    cardImage: "/Default/images/col2.png",
    detailImage: "/Product/images/dogi-dental-powder.png",
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
    route: "/daily-duo",
    detailClass: "science-product-detail--duo",
    cardTag: "Stacked Routine",
    cardImage: "/Science/images/dailyduo.png",
    detailImage: "/Science/images/dailyduo.png",
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

const getDisplayPrice = (product) => product?.pricing?.unitDiscountedPrice ?? 0;
const getDisplayCompareAtPrice = (product) =>
  product?.pricing?.unitCompareAtPrice ?? 0;
const hasDiscount = (product) =>
  getDisplayCompareAtPrice(product) > 0 &&
  getDisplayPrice(product) > 0 &&
  getDisplayCompareAtPrice(product) > getDisplayPrice(product);
const getDiscountLabel = (product) =>
  hasDiscount(product) && product?.pricing?.discountPercent
    ? `${product.pricing.discountPercent}% OFF on subscription`
    : "";
const getBenefits = (product) => (product?.benefits ?? []).slice(0, 4).map((item) => item.text);
const getTags = (product) => (product?.tags ?? []).slice(0, 4);

const ButtonLink = ({ to, children, dark = true }) => (
  <NavLink
    to={to}
    className={dark ? "science-button" : "science-button science-button--light"}
  >
    {children}
    <ArrowRight size={16} />
  </NavLink>
);

const Science = () => {
  return (
    <main className="science-page">
      <ScienceHero />

      <Marque />

      <section className="science-section science-section--highlights">
        <div className="science-container science-highlight-grid">
          {scienceHighlights.map(({ title, text, icon: Icon }) => (
            <article key={title} className="science-highlight-card">
              <div className="science-highlight-card__icon">
                {React.createElement(Icon, { size: 22 })}
              </div>
              <h2 className="science-highlight-card__title">{title}</h2>
              <p className="science-highlight-card__text">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="science-products" className="science-section science-section--products">
        <div className="science-container ">
          <div className="science-products-heading">
            <h2 className="science-products-heading__title">
              Three Products, Three Science Stories.
            </h2>
            <p className="science-products-heading__text">
              From stronger immunity to better digestion and happier smiles - our
              science-driven formulas help your dog live a longer, healthier, and more joyful
              life.
            </p>
          </div>

          <div className="science-product-grid">
            {products.map((item) => (
              <article key={item.id} className="science-product-card">
                <span className="science-product-card__tag">{item.cardTag}</span>

                <div className="science-product-card__image-wrap">
                  <img
                    src={item.cardImage}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="science-product-card__image"
                  />
                </div>

                <h3 className="science-product-card__title">{item.title}</h3>
                <p className="science-product-card__text">{item.description}</p>

                <div className="science-product-card__tags">
                  {getTags(item.product).map((tag) => (
                    <span key={tag} className="science-product-card__tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="science-product-card__price">
                  <p className="science-product-card__price-label">Per product</p>
                  {hasDiscount(item.product) ? (
                    <p className="science-product-card__price-label">
                      <span className="line-through">
                        MRP {formatPrice(getDisplayCompareAtPrice(item.product))}
                      </span>
                    </p>
                  ) : null}
                  <p className="science-product-card__price-value">
                    {hasDiscount(item.product) ? "Now " : ""}
                    {formatPrice(getDisplayPrice(item.product))}
                  </p>
                  {getDiscountLabel(item.product) ? (
                    <p className="science-product-card__price-label">
                      {getDiscountLabel(item.product)}
                    </p>
                  ) : null}
                </div>

                <div className="science-product-card__action">
                  <ButtonLink to={item.route}>Buy This Product </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="science-section science-section--details">
        <div className="science-container science-detail-list">
          {products.map((item, index) => (
            <article
              id={item.anchor}
              key={item.id}
              className={`science-product-detail ${item.detailClass} ${
                index % 2 === 1 ? "science-product-detail--reverse" : ""
              }`}
            >
              <div className="science-product-detail__layout">
                <div className="science-product-detail__media">
                  <img
                    src={item.detailImage}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="science-product-detail__image"
                  />
                </div>

                <div className="science-product-detail__content">
                  <span className="science-product-detail__badge">Product u Want</span>
                  <h2 className="science-product-detail__title">{item.title}</h2>
                  <p className="science-product-detail__text">{item.product.description}</p>

                  <div className="science-product-detail__grid">
                    <div className="science-product-detail__panel">
                      <h3 className="science-product-detail__panel-title">How to make it</h3>
                      <div className="science-step-list">
                        {item.making.map((step, stepIndex) => (
                          <div key={step} className="science-step-item">
                            <div className="science-step-item__number">{stepIndex + 1}</div>
                            <p className="science-step-item__text">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="science-product-detail__stack">
                      <div className="science-product-detail__panel">
                        <h3 className="science-product-detail__panel-title">Key benefits</h3>
                        <div className="science-benefit-list">
                          {getBenefits(item.product).map((benefit) => (
                            <span key={benefit} className="science-benefit-pill">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="science-product-detail__panel">
                        <h3 className="science-product-detail__panel-title">Best for</h3>
                        <div className="science-best-for-list">
                          {item.bestFor.map((point) => (
                            <div key={point} className="science-best-for-item">
                              <div className="science-best-for-item__icon">
                                <BadgeCheck size={14} />
                              </div>
                              <p className="science-best-for-item__text">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="science-product-detail__cta">
                        <p className="science-product-detail__cta-label">Per Product Price</p>
                        {hasDiscount(item.product) ? (
                          <p className="science-product-detail__cta-text">
                            MRP {formatPrice(getDisplayCompareAtPrice(item.product))}
                          </p>
                        ) : null}
                        <p className="science-product-detail__cta-price">
                          {hasDiscount(item.product) ? "Now " : ""}
                          {formatPrice(getDisplayPrice(item.product))}
                        </p>
                        <p className="science-product-detail__cta-text">
                          Final subscription total changes with the selected months.
                        </p>
                        <div className="science-product-detail__cta-action">
                          <ButtonLink to={item.route} dark={false}>
                            Visit product
                          </ButtonLink>
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

      <section className="science-section science-section--cta">
        <div className="science-container">
          <div className="science-final-cta">
            <span className="science-final-cta__eyebrow">Ready to Upgrade Your Dog's Health?</span>
            <h2 className="science-final-cta__title">
              Find the Perfect Formula for Your Dog's Unique Needs.
            </h2>
            <p className="science-final-cta__text">
              Whether you want to support their digestion, boost their immunity, or give
              their teeth some extra love - we've got a science-backed solution that fits
              your dog and your routine.
            </p>

            <div className="science-final-cta__actions">
              <ButtonLink to="/collection" dark={false}>
                Visit collection
              </ButtonLink>
              <ButtonLink to="/quiz#quiz-questions">Take the quiz</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Science;

