import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMessages from "./pages/admin/Messages";
import AdminGallery from "./pages/admin/Gallery";
import AdminServices from "./pages/admin/Services";
import AdminContent from "./pages/admin/Content";
import AdminSettings from "./pages/admin/Settings";
import AdminAbout from "./pages/admin/About";
import AdminLayout from "./components/AdminLayout";
import ForgotPassword from "./pages/admin/ForgotPassword";
import VerifyOTP from "./pages/admin/VerifyOTP";
import ResetPassword from "./pages/admin/ResetPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/verify-otp" element={<VerifyOTP />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Admin pages */}
              <Route
                path="/admin/messages"
                element={
                  <AdminRoute>
                    <AdminMessages />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <AdminRoute>
                    <AdminGallery />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <AdminRoute>
                    <AdminServices />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/content"
                element={
                  <AdminRoute>
                    <AdminContent />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/about"
                element={
                  <AdminRoute>
                    <AdminAbout />
                  </AdminRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
