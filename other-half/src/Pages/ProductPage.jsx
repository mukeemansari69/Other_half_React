import React from "react";

import Features from "../Home/Features";
import Marque from "../Home/Marque";
import QualitySection from "../Home/QualitySection";
import Testimonials from "../Home/Testimonials.jsx";
import TrustedSection from "../Home/TrustedSection";
import NotAll from "../Product/NotAll";
import ProductBanner from "../Product/ProductBanner";
import ScoopOne from "../Product/ScoopOne";
import { everydayProductData } from "../productData";

const ProductPage = () => {
  return (
    <>
      <ProductBanner productData={everydayProductData} />
      <Testimonials
        reviewProductId={everydayProductData.id}
        kicker="Verified dog parent feedback"
        heading="REAL EVERYDAY ROUTINES. REAL DAILY WINS."
        description={`${everydayProductData.review.rating} average rating from ${everydayProductData.review.count} reviews, plus early customer feedback from dogs using the multivitamin in their daily routine.`}
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

export default ProductPage;
