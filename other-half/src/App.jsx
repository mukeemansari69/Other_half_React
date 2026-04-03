import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from './Components/Header.jsx'
import Footer from './Components/Footer.jsx'

import Home from './Pages/Home.jsx';
import Product from './Pages/Product.jsx';
import Integrity from './Pages/IntegrityPage.jsx';
import Story from './Pages/OurStoryPage.jsx';
import Quiz from './Pages/Quiz.jsx';
import GlossaryPage from './Pages/GlossaryPage.jsx';
import QuizDestopPage from './Pages/QuizDestopPage.jsx';
import OurCollection from './Pages/OurCollection.jsx';
import FaqPage from './Pages/FaqPage.jsx';
import DailyDuoProduct from './Product/DailyDuoProduct.jsx';
import DentalProduct from './Product/DentalProduct.jsx';


const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        
        <Route path="/integrity" element={<Integrity />} />
        <Route path="/story" element={<Story />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/quizdesktop" element={<QuizDestopPage />} />
        <Route path="/collection" element={<OurCollection />} />
        <Route path="/faqPage" element={<FaqPage/>} />
        <Route path="/dailyduo" element={<DailyDuoProduct />} />
        <Route path="/doggie-dental" element={<DentalProduct />} />
        <Route path="/product" element={<Product />} />     
      </Routes>
      <Footer />
      
    </Router>
    
  )
}

export default App
