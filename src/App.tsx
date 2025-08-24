import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Assessments from "./pages/Assessments";
import Insights from "./pages/Insights";
import Consent from "./pages/Consent";
import Crisis from "./pages/Crisis";
import Settings from "./pages/Settings";
import RiskFlags from "./pages/RiskFlags";
import Outcomes from "./pages/Outcomes";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/crisis" element={<Crisis />} />
            <Route path="/risk-flags" element={<RiskFlags />} />
            <Route path="/outcomes" element={<Outcomes />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
