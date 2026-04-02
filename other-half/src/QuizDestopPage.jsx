import React from 'react'

import QuizBanner from './QuizDesktop/QuizBanner.jsx'
import Slider from './Home/Slider.jsx'
import QuizBannerCards from './QuizDesktop/QuizBannerCards.jsx'
import Starter from './Home/Starter.jsx'
import Marque from './Home/Marque.jsx'
import Features from './Home/Features.jsx'
import Testimonials from './Home/Testimonials.jsx'
import ReadyFor from './QuizDesktop/ReadyFor.jsx'


const QuizDestopPage = () => {
  return (
    
    <>
    
    <QuizBanner></QuizBanner>
<Slider></Slider>
<QuizBannerCards></QuizBannerCards>
<Starter></Starter>
<Marque></Marque>
<Features></Features>
<ReadyFor></ReadyFor>
<Testimonials></Testimonials>

    </>
  )
}

export default QuizDestopPage