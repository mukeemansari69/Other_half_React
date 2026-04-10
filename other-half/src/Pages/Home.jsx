import React from 'react'
import HeroBanner from '../Home/HeroBanner'
import Slider from '../Home/Slider'
import Health from '../Home/Health'
import Starter from '../Home/Starter'
import Marque from '../Home/Marque'
import Pup from '../Home/Pup'
import ScoopsSection from '../Home/ScoopsSection'
import Features from '../Home/Features'
import TrustedSection from '../Home/TrustedSection'
import SaveSection from '../Home/SaveSection'
import QualitySection from '../Home/QualitySection'
import Testimonials from '../Home/Testimonials'
import FAQ from '../Home/FAQ'
import { homeFaq } from '../faqData'
import HomeAuthPromptModal from '../Home/HomeAuthPromptModal.jsx'




const Home = () => {
  return (
    <>
   
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
    <FAQ heading={"BARKED QUESTIONS ANSWERED"} data={homeFaq}></FAQ>
    <Testimonials></Testimonials>
    <HomeAuthPromptModal />
   
   
    </>
  )
}

export default Home
