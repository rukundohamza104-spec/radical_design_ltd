import { RequestHandler } from "express";
import {
  getMessages,
  addMessage,
  deleteMessage,
  markMessageAsRead,
  searchMessages,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
  getServices,
  addService,
  deleteService,
  updateService,
  getSettings,
  updateSettings,
  getAboutContent,
  updateAboutContent,
  createPasswordResetToken,
  verifyPasswordResetToken,
  usePasswordResetToken,
  getAdminCredentials,
  updateAdminPassword,
  updateAdminEmail,
  createPasswordResetOTP,
  verifyPasswordResetOTP,
  markOTPAsVerified,
  incrementOTPAttempts,
  getVerifiedOTP,
  clearVerifiedOTP,
} from "../db";
import { sendPasswordResetOTPEmail } from "../email";

// Admin auth (simple for demo - in production use proper JWT/sessions)
let adminSessions: Record<string, boolean> = {};

export const adminLogin: RequestHandler = (req, res) => {
  const { password } = req.body;
  const credentials = getAdminCredentials();

  if (password === credentials.password) {
    const sessionId = Math.random().toString(36).substr(2, 9);
    adminSessions[sessionId] = true;
    res.json({ success: true, sessionId });
  } else {
    res.status(401).json({ success: false, error: "Invalid password" });
  }
};

export const adminLogout: RequestHandler = (req, res) => {
  const { sessionId } = req.body;
  delete adminSessions[sessionId];
  res.json({ success: true });
};

export const verifyAdmin: RequestHandler = (req, res, next) => {
  const sessionId = req.headers["x-admin-session"] as string;

  if (!sessionId || !adminSessions[sessionId]) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

// Dashboard stats
export const getDashboardStats: RequestHandler = (req, res) => {
  const messages = getMessages();
  const unreadMessages = messages.filter(m => !m.read).length;
  const galleryImages = getGalleryImages();
  const services = getServices();

  res.json({
    totalMessages: messages.length,
    unreadMessages,
    totalGalleryImages: galleryImages.length,
    totalServices: services.length,
    recentActivity: messages.slice(-5).reverse(),
  });
};

// Messages
export const getContactMessages: RequestHandler = (req, res) => {
  const query = req.query.q as string;
  const messages = query ? searchMessages(query) : getMessages();
  res.json(messages.reverse());
};

export const deleteContactMessage: RequestHandler = (req, res) => {
  const { id } = req.params;
  deleteMessage(id);
  res.json({ success: true });
};

export const markMessageRead: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  markMessageAsRead(id, read);
  res.json({ success: true });
};

// Gallery
export const getGallery: RequestHandler = (req, res) => {
  const images = getGalleryImages();
  res.json(images);
};

export const createGalleryImage: RequestHandler = (req, res) => {
  const { title, category, imageUrl, visible } = req.body;

  if (!title || !category || !imageUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const image = addGalleryImage({
    title,
    category,
    imageUrl,
    visible: visible ?? true,
  });
  res.json(image);
};

export const deleteGalleryImageHandler: RequestHandler = (req, res) => {
  const { id } = req.params;
  deleteGalleryImage(id);
  res.json({ success: true });
};

export const updateGalleryImageHandler: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const image = updateGalleryImage(id, updates);
  res.json(image);
};

// Services
export const getServicesHandler: RequestHandler = (req, res) => {
  const services = getServices();
  res.json(services);
};

// Public endpoint for visible services only
export const getVisibleServicesHandler: RequestHandler = (req, res) => {
  const services = getServices();
  const visibleServices = services.filter(s => s.visible);
  res.json(visibleServices);
};

export const createService: RequestHandler = (req, res) => {
  const { name, description, category, imageUrl, visible } = req.body;

  if (!name || !description || !category || !imageUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const service = addService({
    name,
    description,
    category,
    imageUrl,
    visible: visible ?? true,
  });
  res.json(service);
};

export const deleteServiceHandler: RequestHandler = (req, res) => {
  const { id } = req.params;
  deleteService(id);
  res.json({ success: true });
};

export const updateServiceHandler: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const service = updateService(id, updates);
  res.json(service);
};

// Settings
export const getSettingsHandler: RequestHandler = (req, res) => {
  const settings = getSettings();
  res.json(settings);
};

export const updateSettingsHandler: RequestHandler = (req, res) => {
  const updates = req.body;

  // Don't allow direct password change through this endpoint for security
  if (updates.password) {
    return res.status(400).json({ error: "Use dedicated password endpoint" });
  }

  const settings = updateSettings(updates);
  res.json(settings);
};

export const changeAdminPassword: RequestHandler = (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const credentials = getAdminCredentials();

  if (currentPassword !== credentials.password) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Update password in persistent storage
    updateAdminPassword(newPassword);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};

// About Content
export const getAboutContentHandler: RequestHandler = (req, res) => {
  const content = getAboutContent();
  res.json(content);
};

export const updateAboutContentHandler: RequestHandler = (req, res) => {
  const updates = req.body;
  const content = updateAboutContent(updates);
  res.json(content);
};

// Password Reset via OTP
export const requestPasswordReset: RequestHandler = async (req, res) => {
  try {
    // Get email from request body (user-provided during reset) or from credentials
    const { email } = req.body;
    const resetEmail = email || getAdminCredentials().email;

    if (!resetEmail) {
      return res.status(400).json({ error: "Email address is required" });
    }

    // Generate OTP code (6 digits) - tied to the provided email
    const otpCode = createPasswordResetOTP(resetEmail);

    console.log(`[PASSWORD RESET] OTP generated for ${resetEmail}`);
    console.log(`[PASSWORD RESET] OTP code: ${otpCode}`);
    console.log(`[PASSWORD RESET] OTP expires in 10 minutes`);

    // Send OTP email asynchronously (don't wait for it to complete)
    sendPasswordResetOTPEmail(resetEmail, "Admin", otpCode)
      .then((result) => {
        if (result.success) {
          console.log(`[PASSWORD RESET] OTP email sent successfully to ${resetEmail}`);
        } else {
          console.error(`[PASSWORD RESET] Failed to send OTP email: ${result.error}`);
        }
      })
      .catch((error) => {
        console.error("[PASSWORD RESET] OTP email sending error:", error);
      });

    // Always respond with success to avoid revealing email delivery issues
    // In development, also return the OTP for testing
    const isDevelopment = process.env.NODE_ENV !== "production";
    res.json({
      success: true,
      message: "Verification code sent to your email. Please check your inbox.",
      ...(isDevelopment && { otpCode }), // Only expose in dev
    });
  } catch (error) {
    console.error("Failed to generate OTP:", error);
    res.status(500).json({ error: "Failed to process password reset request" });
  }
};

// Verify OTP Code
export const verifyOTPHandler: RequestHandler = (req, res) => {
  try {
    const { otpCode, email } = req.body;

    if (!otpCode) {
      return res.status(400).json({ error: "OTP code is required" });
    }

    // Use provided email or fall back to admin credentials email
    const verifyEmail = email || getAdminCredentials().email;

    if (!verifyEmail) {
      return res.status(400).json({ error: "Email is required for verification" });
    }

    // Import the database function - use a different name to avoid conflict
    const isOTPValid = verifyPasswordResetOTP(verifyEmail, otpCode);

    if (!isOTPValid) {
      // Increment attempt counter
      incrementOTPAttempts(verifyEmail, otpCode);
      return res.status(401).json({ error: "Invalid or expired verification code" });
    }

    // Mark OTP as verified
    markOTPAsVerified(verifyEmail, otpCode);

    res.json({
      success: true,
      message: "Verification successful. You can now reset your password.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Failed to verify OTP code" });
  }
};

export const resetPassword: RequestHandler = (req, res) => {
  const { newPassword, email } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Use provided email or fall back to admin credentials email
    const resetEmail = email || getAdminCredentials().email;

    if (!resetEmail) {
      return res.status(400).json({ error: "Email is required for password reset" });
    }

    // Check if OTP is verified for this email
    const verifiedOTP = getVerifiedOTP(resetEmail);
    if (!verifiedOTP) {
      return res.status(401).json({ error: "Please verify your email first" });
    }

    // Update the admin password in persistent storage
    updateAdminPassword(newPassword);

    // Clear the verified OTP
    clearVerifiedOTP(resetEmail);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Failed to reset password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
