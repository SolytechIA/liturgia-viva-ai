import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { PublicLayout } from "@/components/PublicLayout";
import { PrivateLayout } from "@/components/PrivateLayout";

import Landing from "./pages/Landing";
import ComoFunciona from "./pages/ComoFunciona";
import Assinar from "./pages/Assinar";
import Sobre from "./pages/Sobre";
import { Login, Cadastro } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import LeituraDoDia from "./pages/LeituraDoDia";
import Arquivo from "./pages/Arquivo";
import MeuPlano from "./pages/MeuPlano";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/assinar" element={<Assinar />} />
            <Route path="/sobre" element={<Sobre />} />
          </Route>

          {/* Auth (sem header público) */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Privadas */}
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/leitura" element={<LeituraDoDia />} />
            <Route path="/dashboard/arquivo" element={<Arquivo />} />
            <Route path="/dashboard/plano" element={<MeuPlano />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
