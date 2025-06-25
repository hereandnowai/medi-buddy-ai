
export const BRAND_CONFIG = {
  brand: {
    organizationShortName: "HERE AND NOW AI",
    organizationLongName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
    website: "https://hereandnowai.com",
    email: "info@hereandnowai.com",
    mobile: "+91 996 296 1000",
    slogan: "designed with passion for innovation",
    colors: {
      primary: "#FFDF00", // Golden
      secondary: "#004040", // Teal
    },
    logo: {
      title: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
      favicon: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/favicon-logo-with-name.png"
    },
    chatbot: {
      avatar: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg",
      face: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel-face.jpeg"
    },
    socialMedia: {
      blog: "https://hereandnowai.com/blog",
      linkedin: "https://www.linkedin.com/company/hereandnowai/",
      instagram: "https://instagram.com/hereandnow_ai",
      github: "https://github.com/hereandnowai",
      x: "https://x.com/hereandnow_ai",
      youtube: "https://youtube.com/@hereandnow_ai"
    }
  }
};

// Ensure API_KEY is accessed directly from process.env as per guidelines.
// It's assumed process.env.API_KEY is configured in the execution environment.
export const GEMINI_API_KEY_INFO = process.env.API_KEY; 
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: 'Home' },
  { path: '/chat-assistant', label: 'Chat Assistant', icon: 'MessageCircle' },
  { path: '/reminders', label: 'Medication Reminders', icon: 'BellRing' },
  { path: '/appointments', label: 'Appointments', icon: 'CalendarDays' },
  { path: '/tracker', label: 'Health Tracker', icon: 'Activity' },
  { path: '/emergency', label: 'Emergency', icon: 'ShieldAlert' },
];

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system', // For initial prompt or error messages
}