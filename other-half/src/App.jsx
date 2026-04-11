import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
import RouteMeta from "./Components/RouteMeta.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { GuestOnlyRoute, ProtectedRoute } from "./Routes/RouteGuard.jsx";

const Home = lazy(() => import("./Pages/Home.jsx"));
const ProductPage = lazy(() => import("./Pages/ProductPage.jsx"));
const Integrity = lazy(() => import("./Pages/IntegrityPage.jsx"));
const Story = lazy(() => import("./Pages/OurStoryPage.jsx"));
const Quiz = lazy(() => import("./Pages/Quiz.jsx"));
const GlossaryPage = lazy(() => import("./Pages/GlossaryPage.jsx"));
const QuizDestopPage = lazy(() => import("./Pages/QuizDestopPage.jsx"));
const OurCollection = lazy(() => import("./Pages/OurCollection.jsx"));
const FaqPage = lazy(() => import("./Pages/FaqPage.jsx"));
const DailyDuoProduct = lazy(() => import("./Product/DailyDuoProduct.jsx"));
const DentalProduct = lazy(() => import("./Product/DentalProduct.jsx"));
const Science = lazy(() => import("./Pages/Science.jsx"));
const ClinicalStudies = lazy(() => import("./Pages/ClinicalStudies.jsx"));
const Blog = lazy(() => import("./Pages/Blog.jsx"));
const TermsConditionsPage = lazy(() => import("./Pages/TermsConditionsPage.jsx"));
const ManageSubscriptionPage = lazy(() => import("./Pages/ManageSubscriptionPage.jsx"));
const RefundPolicyPage = lazy(() => import("./Pages/RefundPolicyPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicyPage.jsx"));
const SubscriptionPolicyPage = lazy(() => import("./Pages/SubscriptionPolicyPage.jsx"));
const ContactUsPage = lazy(() => import("./Pages/ContactUsPage.jsx"));
const LoginPage = lazy(() => import("./Pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./Pages/RegisterPage.jsx"));
const AccountDashboardPage = lazy(() => import("./Pages/AccountDashboardPage.jsx"));
const AdminDashboardPage = lazy(() => import("./Pages/AdminDashboardPage.jsx"));
const CartPage = lazy(() => import("./Pages/CartPage.jsx"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage.jsx"));
const ReviewPage = lazy(() => import("./Pages/ReviewPage.jsx"));

const RouteLoadingState = () => {
  return (
    <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
      <div className="mx-auto flex max-w-2xl items-center justify-center rounded-[32px] border border-[#E6DFCF] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Loading
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">
            Preparing the Page....
          </h1>
        </div>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <RouteMeta />
          <Header />
          <Suspense fallback={<RouteLoadingState />}>
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
              <Route path="/faqPage" element={<FaqPage />} />
              <Route path="/terms" element={<TermsConditionsPage />} />
              <Route path="/manage-subscription" element={<ManageSubscriptionPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/subscription-policy" element={<SubscriptionPolicyPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/dailyduo" element={<DailyDuoProduct />} />
              <Route path="/doggie-dental" element={<DentalProduct />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
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
                path="/review"
                element={
                  <ProtectedRoute>
                    <ReviewPage />
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
