import React from 'react'
import Home from './Home.jsx'
import Product from './Product.jsx'
import OurStoryPage from './OurStoryPage.jsx'
import Header from './Components/Header.jsx'
import Footer from './Components/Footer.jsx'
import IntegrityPage from './IntegrityPage.jsx'
import GlossaryPage from './GlossaryPage.jsx'
import QuizDestopPage from './QuizDestopPage.jsx'






const App = () => {
  return (
   <>
   <Header></Header>
   <Home></Home>
  <Product></Product>
 <OurStoryPage></OurStoryPage>
 <IntegrityPage></IntegrityPage>
<GlossaryPage></GlossaryPage>
<QuizDestopPage></QuizDestopPage>
 
 <Footer></Footer>
  
   </>
  )
}

export default App