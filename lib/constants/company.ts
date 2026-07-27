export const COMPANY = {
  name: "Liko Security Training",
  tagline: "Empowering Professionals. Building Safer Communities.",
  psiraNumber: "4509070",
  centreNumber: "4333985",
  address: {
    line1: "Main Road", // Replace with actual street address
    city: "Mount Frere",
  },
  email: "info@likosecurity.co.za",
  officeHours: [
    { days: "Mon - Fri", hours: "08:00 - 17:00" }, // Replace with actual hours
    { days: "Sat - Sun", hours: "Closed" },
  ],
  socialLinks: {
    facebook: "https://www.facebook.com/", // Add your actual Facebook URL here or leave as empty string ""
    instagram: "https://www.instagram.com/", // Add your actual Instagram URL here
    linkedin: "https://www.linkedin.com/", // Add your actual LinkedIn URL here
  },
} as const;
