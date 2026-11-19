export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919552050093";
export const BUSINESS_EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "shivsamartha@gmail.com";
export const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 95520 50093";
export const whatsappUrl = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
