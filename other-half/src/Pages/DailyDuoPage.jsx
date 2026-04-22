import React from "react";

import Features from "../Home/Features";
import Marque from "../Home/Marque";
import QualitySection from "../Home/QualitySection";
import Testimonials from "../Home/Testimonials.jsx";
import TrustedSection from "../Home/TrustedSection";
import NotAll from "../Product/NotAll";
import ProductBanner from "../Product/ProductBanner.jsx";
import ScoopOne from "../Product/ScoopOne";
import { dailyDuoProductData } from "../productData";

const DailyDuoPage = () => {
  if (!dailyDuoProductData) {
    return <h1>Product data not found.</h1>;
  }

  return (
    <>
      <ProductBanner productData={dailyDuoProductData} />
      <Testimonials
        reviewProductId={dailyDuoProductData.id}
        kicker="Verified dog parent feedback"
        heading="BODY SUPPORT AND BETTER BREATH, BACKED BY REVIEWS."
        description={`${dailyDuoProductData.review.rating} average rating from ${dailyDuoProductData.review.count} reviews, with seeded early feedback from dog parents using the full Daily Duo routine.`}
        ctaLabel="Write a review after your order"
        ctaTo="/review"
      />
      <Marque />
      <ScoopOne />
      <Features />
      <NotAll />
      <TrustedSection />
      <QualitySection />
    </>
  );
};

export default DailyDuoPage;
