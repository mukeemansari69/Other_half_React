import React from 'react'
import Home from './Home.jsx'
import Headers from './Home/Header.jsx'
import ProductBanner from './ProductBanner.jsx'
import Marque from './Home/Marque.jsx'
import ScoopOne from './ScoopOne.jsx'
import Features from './Home/Features.jsx'
import NotAll from './NotAll.jsx'
import TrustedSection from './Home/TrustedSection.jsx'
import QualitySection from './Home/QualitySection.jsx'
import Footer from './Home/Footer.jsx'



const App = () => {
  return (
   <>
  {/*  <Home></Home> */}
  <Headers></Headers>
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

export default App