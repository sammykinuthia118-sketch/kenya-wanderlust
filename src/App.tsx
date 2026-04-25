import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatWidget from "./components/AIChatWidget";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import DestinationDetail from "./pages/DestinationDetail";
import TripPlanner from "./pages/TripPlanner";
import Booking from "./pages/Booking";
import Accommodations from "./pages/Accommodations";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/destination/:slug" element={<DestinationDetail />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/install" element={<Install />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <AIChatWidget />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
