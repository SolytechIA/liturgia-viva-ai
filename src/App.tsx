import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { PublicLayout } from "@/components/PublicLayout";
import { PrivateLayout } from "@/components/PrivateLayout";
import { AuthProvider } from "@/hooks/useAuth";

import Landing from "./pages/Landing";
import ComoFunciona from "./pages/ComoFunciona";
import Assinar from "./pages/Assinar";
import Sobre from "./pages/Sobre";
import { Login, Cadastro } from "./pages/Auth";
import BemVindo from "./pages/BemVindo";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import LeituraDoDia from "./pages/LeituraDoDia";
import Arquivo from "./pages/Arquivo";
import MeuPlano from "./pages/MeuPlano";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminFinanceiro from "./pages/admin/AdminFinanceiro";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
            <Route path="/bem-vindo" element={<BemVindo />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Privadas */}
            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/leitura" element={<LeituraDoDia />} />
              <Route path="/dashboard/arquivo" element={<Arquivo />} />
              <Route path="/dashboard/plano" element={<MeuPlano />} />
            </Route>

            {/* Admin (acesso restrito por is_admin) */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/financeiro" element={<AdminFinanceiro />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
