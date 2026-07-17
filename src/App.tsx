import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PaymentLinks from "./pages/PaymentLinks";
import JavaMigrationGuide from "./pages/JavaMigrationGuide";
import DatabaseSchemaGuide from "./pages/DatabaseSchemaGuide";
import Transactions from "./pages/Transactions";
import DashboardClients from "./pages/DashboardClients";
import DashboardReports from "./pages/DashboardReports";
import DashboardSettings from "./pages/DashboardSettings";
import RegisterCard from "./pages/RegisterCard";
import RegisterCardVariableExample from "./pages/RegisterCardVariableExample";
import RegisterCardLimitedVariable from "./pages/RegisterCardLimitedVariable";
import RegisterCardUnlimitedFixed from "./pages/RegisterCardUnlimitedFixed";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyCards from "./pages/MyCards";
import Subscriptions from "./pages/Subscriptions";
import Products from "./pages/Products";
import ApproveSubscriptionChange from "./pages/ApproveSubscriptionChange";
import SubscriptionExamples from "./pages/SubscriptionExamples";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import ProductLink from "./pages/ProductLink";
import EmailPreview from "./pages/EmailPreview";
import { MobileAppLayout } from "./components/mobile-app/MobileAppLayout";
import MobileHome from "./pages/mobile-app/MobileHome";
import MobileCards from "./pages/mobile-app/MobileCards";
import MobileSubscriptions from "./pages/mobile-app/MobileSubscriptions";
import MobilePayments from "./pages/mobile-app/MobilePayments";
import MobileProfile from "./pages/mobile-app/MobileProfile";
import MobileLogin from "./pages/mobile-app/MobileLogin";
import MobileSignup from "./pages/mobile-app/onboarding/MobileSignup";
import MobileVerifyEmail from "./pages/mobile-app/onboarding/MobileVerifyEmail";
import MobilePersonalInfo from "./pages/mobile-app/onboarding/MobilePersonalInfo";
import MobilePhoneVerify from "./pages/mobile-app/onboarding/MobilePhoneVerify";
import MobileDocument from "./pages/mobile-app/onboarding/MobileDocument";
import MobileSelfie from "./pages/mobile-app/onboarding/MobileSelfie";
import MobileReview from "./pages/mobile-app/onboarding/MobileReview";
import MobileKycStatus from "./pages/mobile-app/onboarding/MobileKycStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/subscription-examples" element={<SubscriptionExamples />} />
            <Route path="/pay/:linkId" element={<RegisterCard />} />
            <Route path="/pay-variable-example/:linkId" element={<RegisterCardVariableExample />} />
            <Route path="/pay-limited-variable/:linkId" element={<RegisterCardLimitedVariable />} />
            <Route path="/pay-unlimited-fixed/:linkId" element={<RegisterCardUnlimitedFixed />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/my-cards" element={<MyCards />} />
            <Route path="/product/:token" element={<ProductLink />} />
            <Route path="/approve-change/:token" element={<ApproveSubscriptionChange />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="links" element={<PaymentLinks />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="products" element={<Products />} />
              <Route path="clients" element={<DashboardClients />} />
              <Route path="reports" element={<DashboardReports />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
            <Route path="/app/login" element={<MobileLogin />} />
            <Route path="/app/signup" element={<MobileSignup />} />
            <Route path="/app/onboarding/verify-email" element={<MobileVerifyEmail />} />
            <Route path="/app/onboarding/personal" element={<MobilePersonalInfo />} />
            <Route path="/app/onboarding/phone" element={<MobilePhoneVerify />} />
            <Route path="/app/onboarding/document" element={<MobileDocument />} />
            <Route path="/app/onboarding/selfie" element={<MobileSelfie />} />
            <Route path="/app/onboarding/review" element={<MobileReview />} />
            <Route path="/app/onboarding/status" element={<MobileKycStatus />} />
            <Route path="/app" element={<MobileAppLayout />}>
              <Route index element={<MobileHome />} />
              <Route path="cards" element={<MobileCards />} />
              <Route path="subscriptions" element={<MobileSubscriptions />} />
              <Route path="payments" element={<MobilePayments />} />
              <Route path="profile" element={<MobileProfile />} />
            </Route>
            <Route path="/docs/java-migration" element={<JavaMigrationGuide />} />
            <Route path="/docs/database-schema" element={<DatabaseSchemaGuide />} />
            <Route path="/email-preview" element={<EmailPreview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
