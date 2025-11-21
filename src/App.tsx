import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PaymentLinks from "./pages/PaymentLinks";
import Transactions from "./pages/Transactions";
import DashboardClients from "./pages/DashboardClients";
import DashboardReports from "./pages/DashboardReports";
import DashboardSettings from "./pages/DashboardSettings";
import RegisterCard from "./pages/RegisterCard";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyCards from "./pages/MyCards";
import ApproveSubscriptionChange from "./pages/ApproveSubscriptionChange";
import Subscriptions from "./pages/Subscriptions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pay/:linkId" element={<RegisterCard />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/my-cards" element={<MyCards />} />
          <Route path="/approve-change/:token" element={<ApproveSubscriptionChange />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="links" element={<PaymentLinks />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="clients" element={<DashboardClients />} />
            <Route path="reports" element={<DashboardReports />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
