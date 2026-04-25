import React, { Suspense, lazy } from 'react'
import HeroBanner from '../Home/HeroBanner'
import { homeFaq } from '../faqData'
import HomeAuthPromptModal from '../Home/HomeAuthPromptModal.jsx'

const Slider = lazy(() => import('../Home/Slider'))
const Health = lazy(() => import('../Home/Health'))
const Starter = lazy(() => import('../Home/Starter'))
const Marque = lazy(() => import('../Home/Marque'))
const Pup = lazy(() => import('../Home/Pup'))
const ScoopsSection = lazy(() => import('../Home/ScoopsSection'))
const Features = lazy(() => import('../Home/Features'))
const TrustedSection = lazy(() => import('../Home/TrustedSection'))
const SaveSection = lazy(() => import('../Home/SaveSection'))
const QualitySection = lazy(() => import('../Home/QualitySection'))
const Testimonials = lazy(() => import('../Home/Testimonials'))
const FAQ = lazy(() => import('../Home/FAQ'))

const Home = () => {
  return (
    <>
   
    <HeroBanner></HeroBanner>
    <Suspense fallback={null}>
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
    </Suspense>
   
   
    </>
  )
}

export default Home
