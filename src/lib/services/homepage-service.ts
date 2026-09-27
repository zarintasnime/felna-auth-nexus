import { RawHomePagePayload, HomePagePayload } from "@/types/homepage";
import { normalizeHomePageData } from "@/lib/adapters/homepage-adapter";

// =============================================================================
// Realistic Mock Payload Tailored for "Felna SMS"
// =============================================================================

export const FELNA_MOCK_RAW_PAYLOAD: RawHomePagePayload = {
  navItems: [
    { Id: "nav-1", nav_nm: "Home", nav_url: "#home" },
    { Id: "nav-2", nav_nm: "SMS Services", nav_url: "#services" },
    { Id: "nav-3", nav_nm: "Facebook Marketing", nav_url: "#marketing" },
    { Id: "nav-4", nav_nm: "Mobile Bill Solution", nav_url: "#benefits" },
    { Id: "nav-5", nav_nm: "SEO", nav_url: "#why-choose-us" },
    { Id: "nav-6", nav_nm: "Contact Us", nav_url: "#contact" },
    { Id: "nav-7", nav_nm: "Content Creator", nav_url: "#services" },
    { Id: "nav-8", nav_nm: "Payment", nav_url: "#services" },
  ],
  heroBanners: [
    {
      Id: "banner-1",
      S_name: "Carrier-Grade Bulk SMS & OTP Gateway in Bangladesh",
      subtitle:
        "Direct operator routing across Grameenphone, Banglalink, Robi & Teletalk with 99.98% delivery rate.",
      S_image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
      badge: "BTRC Approved Route",
      link_url: "/register",
    },
    {
      Id: "banner-2",
      S_name: "Lowest SMS Rate in Bangladesh — Only 23 Paisa per SMS",
      subtitle:
        "Both Masking (Brand Name) and Non-Masking routes with instant automated recharge via bKash & Nagad.",
      S_image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
      badge: "Starting from ৳0.23 / SMS",
      link_url: "/register",
    },
    {
      Id: "banner-3",
      S_name: "Developer-First REST API & Real-Time Webhooks",
      subtitle:
        "Integrate 2-second OTP verification, transactional alerts, and customer notifications in less than 5 minutes.",
      S_image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
      badge: "99.9% Uptime SLA",
      link_url: "/register",
    },
  ],
  bulkSmsOffer: {
    Title: "Mega Ramadan & Eid Special Bulk SMS Package — Starting at 23 Paisa",
    Description:
      "Supercharge your business promotional campaigns with Bangladesh's most reliable high-throughput SMS route. Enjoy instant sender-ID approval, automated phone normalization (+880), real-time operator DLR, and dedicated 24/7 technical support.",
    Image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
    badge: "Special Promotional Offer",
    ctaText: "Claim 23 Paisa Rate",
    ctaUrl: "/register",
  },
  marketingSection: {
    Title: "Drive 10x Customer Engagement With Smart SMS Campaigns",
    subtitle:
      "Direct-to-inbox messaging delivers a 98% open rate within 3 minutes. Target segmented customer bases across all 64 districts in Bangladesh with personalized Unicode Bengali (বাংলা) messages.",
    Image:
      "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Explore Marketing Tools",
    ctaUrl: "/register",
  },
  benefits: [
    {
      Id: "benefit-1",
      Title: "Instant 2-Second Delivery",
      Description:
        "Tier-1 direct telecom connections guarantee OTPs, password resets, and critical alerts land immediately in customer inboxes without delays.",
      icon: "Zap",
    },
    {
      Id: "benefit-2",
      Title: "Live Real-Time DLR Reports",
      Description:
        "Monitor delivery receipts (Delivered, Undelivered, Expired) live with detailed operator timestamps and status codes.",
      icon: "BarChart3",
    },
    {
      Id: "benefit-3",
      Title: "High-Throughput Concurrency",
      Description:
        "Easily dispatch up to 10,000 SMS per second without queue bottlenecking, packet drops, or delayed delivery schedules.",
      icon: "Cpu",
    },
    {
      Id: "benefit-4",
      Title: "Native Unicode & Bengali Support",
      Description:
        "Full Bengali (বাংলা) text support without font corruption, allowing personalized regional messaging for higher conversion.",
      icon: "Languages",
    },
  ],
  whyChooseUs: [
    {
      Id: "why-1",
      Title: "99.98% Delivery Rate",
      Description:
        "Zero packet loss with dynamic failover channels across Grameenphone, Banglalink, Robi, and Teletalk.",
      Icon: "CheckCircle2",
    },
    {
      Id: "why-2",
      Title: "Fast Brand Masking Approval",
      Description:
        "Get your official alphanumeric Brand Sender ID registered quickly adhering to national BTRC compliance rules.",
      Icon: "ShieldCheck",
    },
    {
      Id: "why-3",
      Title: "Instant Gateway Recharge",
      Description:
        "Top up your SMS credit balance instantly 24/7 using automated bKash, Nagad, Rocket, or corporate bank transfer.",
      Icon: "CreditCard",
    },
    {
      Id: "why-4",
      Title: "Developer-First REST API",
      Description:
        "Clean JSON documentation, SDK code samples, and Postman collections for PHP, Node.js, Python, and cURL.",
      Icon: "Code2",
    },
    {
      Id: "why-5",
      Title: "Enterprise Security & SLA",
      Description:
        "End-to-end TLS 1.3 encryption, IP whitelisting, role-based sub-accounts, and a contractual 99.9% uptime SLA.",
      Icon: "Lock",
    },
    {
      Id: "why-6",
      Title: "Dynamic Operator Routing",
      Description:
        "Automated routing algorithms bypass mobile operator downtime or network congestion seamlessly in real-time.",
      Icon: "GitFork",
    },
  ],
};

// =============================================================================
// Service Functions
// =============================================================================

/**
 * Fetches dynamic homepage content.
 * Simulates Next.js ISR via { next: { revalidate: 60 } } and guards against network latency.
 * Falls back gracefully to realistic Felna SMS mock data when backend API is not yet active.
 */
export async function getHomePageData(): Promise<HomePagePayload> {
  const apiUrl = process.env.HOMEPAGE_API_URL;

  // 1. If no external backend API URL configured, return the normalized mock payload immediately
  if (!apiUrl) {
    return normalizeHomePageData(FELNA_MOCK_RAW_PAYLOAD);
  }

  // 2. Fetch from live backend admin panel with ISR caching & 4-second timeout guard
  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      next: { revalidate: 60 }, // Revalidate every 60 seconds (Next.js ISR)
      signal: AbortSignal.timeout(4000), // 4-second safety guardrail
    });

    if (!res.ok) {
      console.warn(
        `[HOMEPAGE_SERVICE] External API returned HTTP ${res.status}. Falling back to default mock data.`
      );
      return normalizeHomePageData(FELNA_MOCK_RAW_PAYLOAD);
    }

    const rawData = (await res.json()) as RawHomePagePayload;
    return normalizeHomePageData(rawData);
  } catch (error: any) {
    console.warn(
      `[HOMEPAGE_SERVICE] Failed to connect to ${apiUrl} (${error.message}). Using resilient fallback dataset.`
    );
    return normalizeHomePageData(FELNA_MOCK_RAW_PAYLOAD);
  }
}
