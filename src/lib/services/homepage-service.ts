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
      Title: "You Can Increase Customer Engagement By Bulk SMS Services",
      Description:
        "Think of bulk SMS service solution as a way to enhance how your brand engages with your all customers across the entire customer life cycle. Businesses should remember to vary the type of content they send out by bulk SMS promotion - while customers may value updates and news on forthcoming developments within the brand by bulk SMS, business promotional information is best delivered way via sms marketing services where longer, more creative messaging is more appropriate.",
      icon: "Users",
    },
    {
      Id: "benefit-2",
      Title: "Speed Up Your Sale By Bulk SMS Marketing",
      Description:
        "Speed up your sale by bulk SMS marketing way, this is only way to connect with your customer directly phone to phone instantly. there is no any others way to connect/reach your target customer. You can try once to better understand. Bulk SMS service is the only way to create brand first in the corporate market.",
      icon: "TrendingUp",
    },
    {
      Id: "benefit-3",
      Title: "Cost Effective SMS Marketing Solution",
      Description:
        "SMS marketing service is only way to make cost effective marketing solution in any time, this way is too strong then any others marketing solution way, like news paper, TV, radio etc. you can send bulk SMS for promotion to customer so customer seen instant from his mobile phone with cheap cost way.",
      icon: "DollarSign",
    },
    {
      Id: "benefit-4",
      Title: "Bulk SMS Is A Direct Immediate Channel With Customer Engagement",
      Description:
        "Bulk SMS service is one of the most popular way to connect with your customer; with a read rate of 90% within 30 minutes from delivery, you can be reassured that your time critical messages will be read almost instantly. A significant 45% of bulk SMS campaigns generate a successful ROI (Return on Investment), reaching over 50% when combined with other popular channels such as email and social media. so bulk SMS promotion is a one of the best way for your brand popularity",
      icon: "Send",
    },
    {
      Id: "benefit-5",
      Title: "Bulk SMS Is A Simple Way But Feedback Is Too Large",
      Description:
        "SMS marketing cost is very cheap but feedback better then any others marketing system. and customer satisfaction is too much showing able. If you don't believe so you can try once with bulk SMS marketing for test.",
      icon: "MessageCircle",
    },
  ],
  whyChooseUs: [
    {
      Id: "why-1",
      Title: "Mobile Payment Solution",
      Description:
        "You Can Pay Your Corporate Mobile Bill From Same Panel.",
      Icon: "Wallet",
    },
    {
      Id: "why-2",
      Title: "Cheap SMS Rate Better Support",
      Description:
        "We Provide You Lowest Rate of SMS Masking or non-Masking.",
      Icon: "MessageSquareText",
    },
    {
      Id: "why-3",
      Title: "24/7 Support Instantly",
      Description:
        "We ensure 24/7 support by mail and phone.",
      Icon: "Headset",
    },
    {
      Id: "why-4",
      Title: "Masking SMS Configuration",
      Description:
        "We Can Provide Your Masking With in a Day for Business promotion",
      Icon: "ShieldCheck",
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
