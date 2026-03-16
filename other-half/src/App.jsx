import React from 'react'
import Header from './Header'
import HeroBanner from './HeroBanner'
import Slider from './Slider'
import Health from './Health'
import Starter from './Starter'
import Marque from './Marque'
import Pup from './Pup'
import ScoopsSection from './ScoopsSection'
import Features from './Features'
import TrustedSection from './TrustedSection'
import SaveSection from './SaveSection'
import QualitySection from './QualitySection'

const App = () => {
  return (
    <>
    <Header ></Header>
    <HeroBanner></HeroBanner>
    <Slider></Slider>
    <Health></Health>
    <Starter></Starter>
    <Marque></Marque>
    <Pup></Pup>
    <ScoopsSection></ScoopsSection>
    <Features></Features>
    <TrustedSection></TrustedSection>
    <SaveSection></SaveSection>
    <QualitySection></QualitySection>
    </>
  )
}

export default App