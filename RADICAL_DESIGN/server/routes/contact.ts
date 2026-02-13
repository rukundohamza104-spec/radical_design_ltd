import { RequestHandler } from "express";
import { addMessage } from "../db";

export const submitContactForm: RequestHandler = (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const msg = addMessage({ name, email, phone, message });
    res.json({
      success: true,
      message: "Thank you! We received your message.",
      id: msg.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
};
