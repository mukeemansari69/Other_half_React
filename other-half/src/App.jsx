import React from 'react'
import Home from './Home.jsx'
import Product from './Product.jsx'
import OurStoryPage from './OurStoryPage.jsx'
import Header from './Home/Header.jsx'
import Footer from './Home/Footer.jsx'
import IntegrityPage from './IntegrityPage.jsx'
import Glossary from './Glossary.jsx'
import Features from './Home/Features.jsx'
import OurMission from './Our-Story/OurMission.jsx'
import NoMystery from './NoMystery.jsx'




const App = () => {
  return (
   <>
   <Header></Header>
   {/* <Home></Home>
  <Product></Product>
 <OurStoryPage></OurStoryPage>
 <IntegrityPage></IntegrityPage> */}
 <Glossary></Glossary>
 <Features></Features>
 <NoMystery></NoMystery>
 <OurMission></OurMission>
 
 <Footer></Footer>
  
   </>
  )
}

export default App