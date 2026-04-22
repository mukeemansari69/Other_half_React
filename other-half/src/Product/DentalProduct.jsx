import React from "react";
import ProductBanner from "./ProductBanner.jsx";
import { dogDentalProductData } from "../productData";
import Marque from "../Home/Marque";
import ScoopOne from "../Product/ScoopOne";
import Features from "../Home/Features";
import Testimonials from "../Home/Testimonials.jsx";
import NotAll from "../Product/NotAll";
import TrustedSection from "../Home/TrustedSection";
import QualitySection from "../Home/QualitySection";

const DentalProduct = () => {
  if (!dogDentalProductData) {
    return <h1>Product data not found.</h1>;
  }

  return (
    <>
      <ProductBanner productData={dogDentalProductData} />
      <Testimonials
        reviewProductId={dogDentalProductData.id}
        kicker="Verified dog parent feedback"
        heading="REAL FEEDBACK FROM HOMES THAT CHOSE THE NO-BRUSH ROUTINE."
        description={`${dogDentalProductData.review.rating} average rating from ${dogDentalProductData.review.count} reviews and early customer feedback focused on breath, plaque support, and easier daily dental care.`}
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

export default DentalProduct;
