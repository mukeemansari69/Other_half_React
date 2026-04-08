import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from './Components/Header.jsx'
import Footer from './Components/Footer.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GuestOnlyRoute, ProtectedRoute } from './Routes/RouteGuard.jsx'

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
import Science from './Pages/Science.jsx';
import ClinicalStudies from './Pages/ClinicalStudies.jsx';
import Blog from './Pages/Blog.jsx';
import TermsConditionsPage from './Pages/TermsConditionsPage.jsx';
import ManageSubscriptionPage from './Pages/ManageSubscriptionPage.jsx';
import RefundPolicyPage from './Pages/RefundPolicyPage.jsx';
import PrivacyPolicyPage from './Pages/PrivacyPolicyPage.jsx';
import SubscriptionPolicyPage from './Pages/SubscriptionPolicyPage.jsx';
import ContactUsPage from './Pages/ContactUsPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import AccountDashboardPage from './Pages/AccountDashboardPage.jsx';
import AdminDashboardPage from './Pages/AdminDashboardPage.jsx';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/integrity" element={<Integrity />} />
          <Route path="/story" element={<Story />} />
          <Route path="/science" element={<Science />} />
          <Route path="/clinical" element={<ClinicalStudies />} />
          <Route path="/clinical-studies" element={<ClinicalStudies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/quizdesktop" element={<QuizDestopPage />} />
          <Route path="/collection" element={<OurCollection />} />
          <Route path="/faqPage" element={<FaqPage/>} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/manage-subscription" element={<ManageSubscriptionPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/subscription-policy" element={<SubscriptionPolicyPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/dailyduo" element={<DailyDuoProduct />} />
          <Route path="/doggie-dental" element={<DentalProduct />} />
          <Route path="/product" element={<Product />} />
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyRoute>
                <RegisterPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </AuthProvider>
      
    </Router>
    
  )
}

export default App
