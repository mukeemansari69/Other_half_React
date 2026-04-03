import React from "react";
import ProductBanner from "../Product/ProductBanner.jsx";
import { dailyDuoProductData } from "../productData";

import Marque from "../Home/Marque";
import ScoopOne from "../Product/ScoopOne";
import Features from "../Home/Features";
import NotAll from "../Product/NotAll";
import TrustedSection from "../Home/TrustedSection";
import QualitySection from "../Home/QualitySection";

const DailyduoProduct = () => {

  // ✅ DEBUG (check karo console me)
  console.log("Daily Duo Data:", dailyDuoProductData);

  // ✅ IMPORTANT FIX (error se bachne ke liye)
  if (!dailyDuoProductData) {
    return <h1>Product Data Not Found ❌</h1>;
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

export default DailyduoProduct;