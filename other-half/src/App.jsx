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

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/integrity" element={<Integrity />} />
        <Route path="/story" element={<Story />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/quizdesktop" element={<QuizDestopPage />} />
        
      </Routes>

      <Footer />
    </Router>
  )
}

export default App