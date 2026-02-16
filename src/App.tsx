import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GardenProvider } from "@/context/GardenContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Spaces from "./pages/Spaces";
import Crops from "./pages/Crops";
import Scanner from "./pages/Scanner";
import UsersPage from "./pages/UsersPage";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GardenProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/spaces" element={<Spaces />} />
              <Route path="/crops" element={<Crops />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </GardenProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
