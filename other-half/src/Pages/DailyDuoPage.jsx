import React from "react";

import Features from "../Home/Features";
import Marque from "../Home/Marque";
import QualitySection from "../Home/QualitySection";
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
