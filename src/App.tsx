import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GardenProvider } from "@/context/GardenContext";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Spaces from "./pages/Spaces";
import Crops from "./pages/Crops";
import Scanner from "./pages/Scanner";
import UsersPage from "./pages/UsersPage";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <GardenProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/shop" element={
                <AppLayout>
                  <Shop />
                </AppLayout>
              } />
              <Route path="/" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/spaces" element={<AppLayout><Spaces /></AppLayout>} />
              <Route path="/crops" element={<AppLayout><Crops /></AppLayout>} />
              <Route path="/scanner" element={<AppLayout><Scanner /></AppLayout>} />
              <Route path="/users" element={<AppLayout><UsersPage /></AppLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GardenProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
