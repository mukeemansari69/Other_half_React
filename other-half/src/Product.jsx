import React from 'react'
import Header from './Home/Header'
import ProductBanner from './Product/ProductBanner'
import Marque from './Home/Marque'
import ScoopOne from './Product/ScoopOne'
import Features from './Home/Features'
import NotAll from './Product/NotAll'
import TrustedSection from './Home/TrustedSection'
import QualitySection from './Home/QualitySection'
import Footer from './Home/Footer'

const Product = () => {
  return (
    <>
    <Header></Header>
    <ProductBanner></ProductBanner>
    <Marque></Marque>
    <ScoopOne></ScoopOne>
    <Features></Features>
    <NotAll></NotAll>
    <TrustedSection></TrustedSection>
    <QualitySection></QualitySection>
    <Footer></Footer>
  
    </>
  )
}

export default Product