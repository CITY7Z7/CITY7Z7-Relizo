import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TracksPage from "./pages/TracksPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import AddTrackPage from "./pages/AddTrackPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import ReleasesPage from "./pages/ReleasesPage";
import DistributorsPage from "./pages/DistributorsPage";
import PromotionPage from "./pages/PromotionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="*"
            element={
              <RequireAuth>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/tracks" element={<TracksPage />} />
                    <Route path="/tracks/new" element={<AddTrackPage />} />
                    <Route path="/tracks/:id" element={<TrackDetailPage />} />
                    <Route path="/albums" element={<AlbumsPage />} />
                    <Route path="/albums/:id" element={<AlbumDetailPage />} />
                    <Route path="/releases" element={<ReleasesPage />} />
                    <Route path="/release-planning" element={<Navigate to="/releases" replace />} />
                    <Route path="/distributors" element={<DistributorsPage />} />
                    <Route path="/distribution-promotion" element={<Navigate to="/distributors" replace />} />
                    <Route path="/promotion" element={<PromotionPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
