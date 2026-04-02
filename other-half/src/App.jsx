import React from 'react'
import Home from './Home.jsx'
import Product from './Product.jsx'
import OurStoryPage from './OurStoryPage.jsx'
import Header from './Home/Header.jsx'
import Footer from './Home/Footer.jsx'
import IntegrityPage from './IntegrityPage.jsx'
import GlossaryPage from './GlossaryPage.jsx'
import QuizBanner from './QuizBanner.jsx'
import Slider from './Home/Slider.jsx'
import QuizBannerCards from './QuizBannerCards.jsx'
import Starter from './Home/Starter.jsx'
import Marque from './Home/Marque.jsx'
import Features from './Home/Features.jsx'
import Testimonials from './Home/Testimonials.jsx'
import ReadyFor from './ReadyFor.jsx'






const App = () => {
  return (
   <>
   <Header></Header>
   {/* <Home></Home>
  <Product></Product>
 <OurStoryPage></OurStoryPage>
 <IntegrityPage></IntegrityPage>
<GlossaryPage></GlossaryPage> */}
<QuizBanner></QuizBanner>
<Slider></Slider>
<QuizBannerCards></QuizBannerCards>
<Starter></Starter>
<Marque></Marque>
<Features></Features>
<ReadyFor></ReadyFor>
<Testimonials></Testimonials>
 
 <Footer></Footer>
  
   </>
  )
}

export default App