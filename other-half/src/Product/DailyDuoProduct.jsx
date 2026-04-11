import React from "react";
import ProductBanner from "./ProductBanner.jsx";
import { dailyDuoProductData } from "../productData";

import Marque from "../Home/Marque";
import ScoopOne from "../Product/ScoopOne";
import Features from "../Home/Features";
import NotAll from "../Product/NotAll";
import TrustedSection from "../Home/TrustedSection";
import QualitySection from "../Home/QualitySection";

const DailyDuoProduct = () => {
  if (!dailyDuoProductData) {
    return <h1>Product data not found.</h1>;
  }

  return (
    <>
      <ProductBanner productData={dailyDuoProductData} />
      <Marque />
      <ScoopOne />
      <Features />
      <NotAll />
      <TrustedSection />
      <QualitySection />
    </>
  );
};

export default DailyDuoProduct;
