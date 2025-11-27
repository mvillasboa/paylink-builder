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
            <Route path="/docs/java-migration" element={<JavaMigrationGuide />} />
            <Route path="/docs/database-schema" element={<DatabaseSchemaGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
