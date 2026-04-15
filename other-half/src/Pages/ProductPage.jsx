import React from "react";

import Features from "../Home/Features";
import Marque from "../Home/Marque";
import QualitySection from "../Home/QualitySection";
import TrustedSection from "../Home/TrustedSection";
import NotAll from "../Product/NotAll";
import ProductBanner from "../Product/ProductBanner";
import ScoopOne from "../Product/ScoopOne";
import { everydayProductData } from "../productData";

const ProductPage = () => {
  return (
    <>
      <ProductBanner productData={everydayProductData} />
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
