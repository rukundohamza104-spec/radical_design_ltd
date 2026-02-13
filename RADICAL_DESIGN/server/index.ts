import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  adminLogin,
  adminLogout,
  verifyAdmin,
  getDashboardStats,
  getContactMessages,
  deleteContactMessage,
  markMessageRead,
  getGallery,
  createGalleryImage,
  deleteGalleryImageHandler,
  updateGalleryImageHandler,
  getServicesHandler,
  getVisibleServicesHandler,
  createService,
  deleteServiceHandler,
  updateServiceHandler,
  getSettingsHandler,
  updateSettingsHandler,
  changeAdminPassword,
  getAboutContentHandler,
  updateAboutContentHandler,
  requestPasswordReset,
  resetPassword,
  verifyOTPHandler,
} from "./routes/admin";
import { submitContactForm } from "./routes/contact";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Contact form submission
  app.post("/api/contact", submitContactForm);

  // Public services endpoint (returns only visible services)
  app.get("/api/services", getVisibleServicesHandler);

  // Public about content endpoint (so main website can fetch)
  app.get("/api/about", getAboutContentHandler);

  // Admin authentication
  app.post("/api/admin/login", adminLogin);
  app.post("/api/admin/logout", adminLogout);

  // Protected admin routes
  app.get("/api/admin/dashboard", verifyAdmin, getDashboardStats);

  // Messages management
  app.get("/api/admin/messages", verifyAdmin, getContactMessages);
  app.delete("/api/admin/messages/:id", verifyAdmin, deleteContactMessage);
  app.patch("/api/admin/messages/:id/read", verifyAdmin, markMessageRead);

  // Gallery management (GET is public, others require admin)
  app.get("/api/admin/gallery", getGallery);
  app.post("/api/admin/gallery", verifyAdmin, createGalleryImage);
  app.delete("/api/admin/gallery/:id", verifyAdmin, deleteGalleryImageHandler);
  app.patch("/api/admin/gallery/:id", verifyAdmin, updateGalleryImageHandler);

  // Services management
  app.get("/api/admin/services", verifyAdmin, getServicesHandler);
  app.post("/api/admin/services", verifyAdmin, createService);
  app.delete("/api/admin/services/:id", verifyAdmin, deleteServiceHandler);
  app.patch("/api/admin/services/:id", verifyAdmin, updateServiceHandler);

  // Settings management
  app.get("/api/admin/settings", verifyAdmin, getSettingsHandler);
  app.patch("/api/admin/settings", verifyAdmin, updateSettingsHandler);
  app.post("/api/admin/settings/password", verifyAdmin, changeAdminPassword);

  // Password reset (public endpoints)
  app.post("/api/admin/forgot-password", requestPasswordReset);
  app.post("/api/admin/verify-otp", verifyOTPHandler);
  app.post("/api/admin/reset-password", resetPassword);

  // About content management
  app.get("/api/admin/about", verifyAdmin, getAboutContentHandler);
  app.patch("/api/admin/about", verifyAdmin, updateAboutContentHandler);

  return app;
}
