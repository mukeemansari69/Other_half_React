import React from "react";
import ProductBanner from "./ProductBanner.jsx";
import { dogDentalProductData } from "../productData";
import Marque from "../Home/Marque";
import ScoopOne from "../Product/ScoopOne";
import Features from "../Home/Features";
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
