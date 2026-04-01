import React from 'react'
import Home from './Home.jsx'
import Product from './Product.jsx'
import OurStoryPage from './OurStoryPage.jsx'
import Header from './Home/Header.jsx'
import Footer from './Home/Footer.jsx'
import NoFiller from './NoFiller.jsx'
import Marque from './Home/Marque.jsx'
import HighStandards from './HighStandards.jsx'
import HighStandardsFeature from './HighStandardsFeature.jsx'
import OurProcess from './OurProcess.jsx'
import Obsess from './Obsess.jsx'
import OurFlex from './OurFlex.jsx'



const App = () => {
  return (
   <>
   <Header></Header>
   {/* <Home></Home>
  <Product></Product>
 <OurStoryPage></OurStoryPage> */}
 <NoFiller></NoFiller>
 <Marque> </Marque>
 <HighStandards></HighStandards>
 <HighStandardsFeature></HighStandardsFeature>
 <OurProcess></OurProcess>
 <Obsess></Obsess>
 <OurFlex></OurFlex>
 <Footer></Footer>
  
   </>
  )
}

export default App