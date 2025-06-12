import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryProvider } from "@/hooks/use-country";

// Importez votre composant Chatbot ici
import Chatbot from "./components/Chatbot"; 

import Index from "./pages/Index";
import Simulation from "./pages/Simulation";
import SimulationEmployee from "./pages/SimulationEmployee";
import SimulationEnterprise from "./pages/SimulationEnterprise";
import OptimizationGuide from "./pages/OptimizationGuide";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import CountrySelection from "./pages/CountrySelection";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from '@/components/PrivateRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="paye-afrique-ui-theme">
      <CountryProvider defaultCountry="benin">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/simulation/employee" element={<SimulationEmployee />} />
              <Route path="/simulation/enterprise" element={<SimulationEnterprise />} />
              <Route path="/optimization-guide" element={<OptimizationGuide />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/country-selection" element={<CountrySelection />} />
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Routes protégées */}
              <Route
                path="/enterprise/*"
                element={
                  <PrivateRoute>
                    <SimulationEnterprise />
                  </PrivateRoute>
                }
              />
              
              {/* Route par défaut pour les pages non trouvées */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Chatbot />
        </TooltipProvider>
      </CountryProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;