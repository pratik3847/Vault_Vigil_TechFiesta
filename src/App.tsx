import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TransactionSimulator from "./pages/TransactionSimulator";
import FraudAnalysis from "./pages/FraudAnalysis";
import RiskScoring from "./pages/RiskScoring";
import DecisionEngine from "./pages/DecisionEngine";
import ScamLinkDetection from "./pages/ScamLinkDetection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/simulator" element={<TransactionSimulator />} />
          <Route path="/analysis" element={<FraudAnalysis />} />
          <Route path="/link-analysis" element={<ScamLinkDetection />} />
          <Route path="/risk" element={<RiskScoring />} />
          <Route path="/decision" element={<DecisionEngine />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
