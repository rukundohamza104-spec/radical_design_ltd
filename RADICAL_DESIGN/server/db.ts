import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

interface GalleryImage {
  id: string;
  title: string;
  category: "Stickers" | "Banners" | "Mugs" | "Branding" | "Events";
  imageUrl: string;
  visible: boolean;
  createdAt: string;
}

interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string;
  mission: string;
  vision: string;
  values: Array<{
    title: string;
    description: string;
  }>;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  visible: boolean;
  createdAt: string;
}

interface AdminSettings {
  phone: string;
  address: string;
  email: string;
  maintenanceMode: boolean;
}

interface PasswordResetToken {
  token: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

interface PasswordResetOTP {
  code: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
  attempts: number;
}

interface AdminCredentials {
  password: string;
  email: string;
}

const getFilePath = (filename: string) => path.join(DATA_DIR, filename);

const readJson = (filename: string) => {
  const filepath = getFilePath(filename);
  if (!fs.existsSync(filepath)) {
    return [];
  }
  const data = fs.readFileSync(filepath, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeJson = (filename: string, data: any) => {
  const filepath = getFilePath(filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

// Contact Messages
export const getMessages = (): ContactMessage[] => readJson("messages.json");

export const addMessage = (message: Omit<ContactMessage, "id" | "date" | "read">) => {
  const messages = getMessages();
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false,
  };
  messages.push(newMessage);
  writeJson("messages.json", messages);
  return newMessage;
};

export const deleteMessage = (id: string) => {
  const messages = getMessages();
  const filtered = messages.filter(msg => msg.id !== id);
  writeJson("messages.json", filtered);
};

export const markMessageAsRead = (id: string, read: boolean) => {
  const messages = getMessages();
  const msg = messages.find(m => m.id === id);
  if (msg) {
    msg.read = read;
    writeJson("messages.json", messages);
  }
};

export const searchMessages = (query: string): ContactMessage[] => {
  const messages = getMessages();
  return messages.filter(msg =>
    msg.name.toLowerCase().includes(query.toLowerCase()) ||
    msg.email.toLowerCase().includes(query.toLowerCase()) ||
    msg.message.toLowerCase().includes(query.toLowerCase())
  );
};

// Gallery
export const getGalleryImages = (): GalleryImage[] => readJson("gallery.json");

export const addGalleryImage = (image: Omit<GalleryImage, "id" | "createdAt">) => {
  const images = getGalleryImages();
  const newImage: GalleryImage = {
    ...image,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  images.push(newImage);
  writeJson("gallery.json", images);
  return newImage;
};

export const deleteGalleryImage = (id: string) => {
  const images = getGalleryImages();
  const filtered = images.filter(img => img.id !== id);
  writeJson("gallery.json", filtered);
};

export const updateGalleryImage = (id: string, updates: Partial<GalleryImage>) => {
  const images = getGalleryImages();
  const image = images.find(img => img.id === id);
  if (image) {
    Object.assign(image, updates);
    writeJson("gallery.json", images);
  }
  return image;
};

// Services
export const getServices = (): Service[] => readJson("services.json");

export const addService = (service: Omit<Service, "id" | "createdAt">) => {
  const services = getServices();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  services.push(newService);
  writeJson("services.json", services);
  return newService;
};

export const deleteService = (id: string) => {
  const services = getServices();
  const filtered = services.filter(svc => svc.id !== id);
  writeJson("services.json", filtered);
};

export const updateService = (id: string, updates: Partial<Service>) => {
  const services = getServices();
  const service = services.find(svc => svc.id === id);
  if (service) {
    Object.assign(service, updates);
    writeJson("services.json", services);
  }
  return service;
};

// Admin Settings
const DEFAULT_SETTINGS: AdminSettings = {
  phone: "0788 470 294",
  address: "Chic Building, 2nd Floor, Room F019C",
  email: "info@radicaldesign.com",
  maintenanceMode: false,
};

export const getSettings = (): AdminSettings => {
  const settings = readJson("settings.json");
  return settings.length > 0 ? settings[0] : DEFAULT_SETTINGS;
};

export const updateSettings = (updates: Partial<AdminSettings>) => {
  const settings = getSettings();
  const updated = { ...settings, ...updates };
  writeJson("settings.json", [updated]);
  return updated;
};

// About Content
const DEFAULT_ABOUT: AboutContent = {
  heroTitle: "About RADICAL DESIGN",
  heroSubtitle: "Your trusted partner in printing and media solutions",
  storyTitle: "Our Story",
  storyContent: "RADICAL DESIGN Ltd has been serving businesses and organizations with premium printing and media solutions. We combine modern technology with traditional craftsmanship to deliver exceptional results.",
  mission: "To deliver premium printing and media solutions that empower businesses to communicate effectively with their audience.",
  vision: "To be the leading provider of innovative printing and branding solutions in the region.",
  values: [
    {
      title: "Quality Excellence",
      description: "Premium materials and professional techniques for every project",
    },
    {
      title: "Customer Focus",
      description: "Your satisfaction is our top priority in every interaction",
    },
    {
      title: "Fast Service",
      description: "Quick turnaround without compromising on quality standards",
    },
  ],
};

export const getAboutContent = (): AboutContent => {
  const content = readJson("about.json");
  return content.length > 0 ? content[0] : DEFAULT_ABOUT;
};

export const updateAboutContent = (updates: Partial<AboutContent>) => {
  const content = getAboutContent();
  const updated = { ...content, ...updates };
  writeJson("about.json", [updated]);
  return updated;
};

// Password Reset Tokens
export const createPasswordResetToken = (): string => {
  const tokens = readJson("password-reset-tokens.json");
  const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

  const resetToken: PasswordResetToken = {
    token,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    used: false,
  };

  tokens.push(resetToken);
  writeJson("password-reset-tokens.json", tokens);
  return token;
};

export const verifyPasswordResetToken = (token: string): boolean => {
  const tokens = readJson("password-reset-tokens.json");
  const resetToken = tokens.find((t: PasswordResetToken) => t.token === token);

  if (!resetToken) return false;
  if (resetToken.used) return false;
  if (new Date(resetToken.expiresAt) < new Date()) return false;

  return true;
};

export const usePasswordResetToken = (token: string) => {
  const tokens = readJson("password-reset-tokens.json");
  const resetToken = tokens.find((t: PasswordResetToken) => t.token === token);

  if (resetToken) {
    resetToken.used = true;
    writeJson("password-reset-tokens.json", tokens);
  }

  return resetToken;
};

export const deleteExpiredTokens = () => {
  const tokens = readJson("password-reset-tokens.json");
  const now = new Date();
  const validTokens = tokens.filter((t: PasswordResetToken) => {
    return new Date(t.expiresAt) > now;
  });
  writeJson("password-reset-tokens.json", validTokens);
};

// Admin Credentials Management
const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  password: "admin123",
  email: "info@radicaldesign.com",
};

export const getAdminCredentials = (): AdminCredentials => {
  const credentials = readJson("admin-credentials.json");
  return credentials.length > 0 ? credentials[0] : DEFAULT_ADMIN_CREDENTIALS;
};

export const updateAdminPassword = (newPassword: string): AdminCredentials => {
  const credentials = getAdminCredentials();
  const updated = { ...credentials, password: newPassword };
  writeJson("admin-credentials.json", [updated]);
  return updated;
};

export const updateAdminEmail = (newEmail: string): AdminCredentials => {
  const credentials = getAdminCredentials();
  const updated = { ...credentials, email: newEmail };
  writeJson("admin-credentials.json", [updated]);
  return updated;
};

// Password Reset OTP Management
/**
 * Generate a 6-digit random OTP code
 */
function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create a new OTP for password reset
 */
export const createPasswordResetOTP = (email: string): string => {
  const otps = readJson("password-reset-otps.json");

  // Remove any existing OTP for this email
  const filtered = otps.filter((o: PasswordResetOTP) => o.email !== email);

  // Generate new OTP
  const code = generateOTPCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

  const newOTP: PasswordResetOTP = {
    code,
    email,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    verified: false,
    attempts: 0,
  };

  filtered.push(newOTP);
  writeJson("password-reset-otps.json", filtered);
  return code;
};

/**
 * Verify an OTP code for a given email
 */
export const verifyPasswordResetOTP = (email: string, code: string): boolean => {
  const otps = readJson("password-reset-otps.json");
  const otp = otps.find((o: PasswordResetOTP) => o.email === email && o.code === code);

  if (!otp) return false;
  if (otp.verified) return false; // OTP already used
  if (new Date(otp.expiresAt) < new Date()) return false; // OTP expired
  if (otp.attempts >= 5) return false; // Too many attempts

  return true;
};

/**
 * Mark an OTP as verified
 */
export const markOTPAsVerified = (email: string, code: string) => {
  const otps = readJson("password-reset-otps.json");
  const otp = otps.find((o: PasswordResetOTP) => o.email === email && o.code === code);

  if (otp) {
    otp.verified = true;
    writeJson("password-reset-otps.json", otps);
  }
};

/**
 * Increment OTP attempt count
 */
export const incrementOTPAttempts = (email: string, code: string) => {
  const otps = readJson("password-reset-otps.json");
  const otp = otps.find((o: PasswordResetOTP) => o.email === email && o.code === code);

  if (otp) {
    otp.attempts += 1;
    writeJson("password-reset-otps.json", otps);
  }
};

/**
 * Get a verified OTP (for password reset)
 */
export const getVerifiedOTP = (email: string): PasswordResetOTP | null => {
  const otps = readJson("password-reset-otps.json");
  const otp = otps.find((o: PasswordResetOTP) => o.email === email && o.verified);

  if (!otp) return null;
  if (new Date(otp.expiresAt) < new Date()) return null;

  return otp;
};

/**
 * Clear verified OTP after password reset
 */
export const clearVerifiedOTP = (email: string) => {
  const otps = readJson("password-reset-otps.json");
  const filtered = otps.filter((o: PasswordResetOTP) => !(o.email === email && o.verified));
  writeJson("password-reset-otps.json", filtered);
};
