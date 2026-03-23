import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Discover from "./pages/Discover";
import Projects from "./pages/Projects";
import GroupBuy from "./pages/GroupBuy";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Tab layout with bottom navigation */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Discover />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/groupbuy" element={<GroupBuy />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Full-screen project detail (no tab bar) */}
          <Route path="/project/:id" element={<ProjectDetail />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
