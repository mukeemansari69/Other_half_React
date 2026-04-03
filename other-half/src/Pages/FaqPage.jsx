import React from 'react'
import FaqBanner from '../Faq/FaqBanner'
import FAQ from '../Home/FAQ'
import { subscriptionFaq, productFaq} from '../faqData'
import FaqFooter from '../Faq/FaqFooter'

const FaqPage = () => {
  return (
    
    <>
    <FaqBanner />
    <FAQ
  heading="SUBSCRIPTION FAQs"
  data={subscriptionFaq}
/>
<FAQ
  heading="Products FAQs"
  data={productFaq}
/>
<FaqFooter />
    </>
  )
}

export default FaqPage