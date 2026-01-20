import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import Index from "./pages/Index";
import Media from "./pages/Media";
import FAQ from "./pages/FAQ";
import GameContent from "./pages/GameContent";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteSettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/media" element={<Media />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/game-content" element={<GameContent />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SiteSettingsProvider>
  </QueryClientProvider>
);

export default App;
