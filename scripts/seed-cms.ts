import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  console.log("\n=======================================================");
  console.log("       Seeding Enterprise CMS in Neon PostgreSQL");
  console.log("=======================================================\n");

  // 1. Seed CmsSiteSettings (Singleton)
  console.log("1. Seeding Site Settings...");
  await db.cmsSiteSettings.upsert({
    where: { id: "default" },
    update: {
      siteName: "Felna.com",
      siteTagline: "Carrier-Grade Bulk SMS & OTP Gateway",
      announcementText: "Fast & Reliable Bulk SMS Services.",
      announcementLinkText: "Join Now",
      announcementLinkUrl: "/register",
      scheduleText: "9 am to 6 pm [mon-sat]",
      primaryPhone: "+880-1958-666999",
      supportEmail: "support@iglweb.com",
      officeAddress: "Felna HQ, Dhaka, Bangladesh",
      officeHours: "Sat - Thu: 9:00 AM - 6:00 PM",
      footerAboutText:
        "Felna.com is Bangladesh's premier telecom-grade Bulk SMS & OTP verification platform delivering 99.98% carrier delivery with instant REST API integration.",
      copyrightText: "© Copyright 2007- 2026 Felna.com",
    },
    create: {
      id: "default",
      siteName: "Felna.com",
      siteTagline: "Carrier-Grade Bulk SMS & OTP Gateway",
      announcementText: "Fast & Reliable Bulk SMS Services.",
      announcementLinkText: "Join Now",
      announcementLinkUrl: "/register",
      scheduleText: "9 am to 6 pm [mon-sat]",
      primaryPhone: "+880-1958-666999",
      supportEmail: "support@iglweb.com",
      officeAddress: "Felna HQ, Dhaka, Bangladesh",
      officeHours: "Sat - Thu: 9:00 AM - 6:00 PM",
      footerAboutText:
        "Felna.com is Bangladesh's premier telecom-grade Bulk SMS & OTP verification platform delivering 99.98% carrier delivery with instant REST API integration.",
      copyrightText: "© Copyright 2007- 2026 Felna.com",
    },
  });
  console.log("✅ Site Settings seeded successfully.");

  // 2. Seed CmsHeroSlide
  console.log("\n2. Seeding Hero Slides...");
  const heroSlides = [
    {
      title: "Carrier-Grade Bulk SMS & OTP Gateway in Bangladesh",
      subtitle:
        "Direct operator routing across Grameenphone, Banglalink, Robi & Teletalk with 99.98% delivery rate.",
      badge: "BTRC Approved Route",
      imageUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/register",
      ctaText: "Get Started",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Lowest SMS Rate in Bangladesh — Only 23 Paisa per SMS",
      subtitle:
        "Both Masking (Brand Name) and Non-Masking routes with instant automated recharge via bKash & Nagad.",
      badge: "Starting from ৳0.23 / SMS",
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/register",
      ctaText: "Claim 23 Paisa Rate",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Developer-First REST API & Real-Time Webhooks",
      subtitle:
        "Integrate 2-second OTP verification, transactional alerts, and customer notifications in less than 5 minutes.",
      badge: "99.9% Uptime SLA",
      imageUrl:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/register",
      ctaText: "Explore API Docs",
      displayOrder: 3,
      isActive: true,
    },
  ];

  // Clean existing slides if needed or ensure they exist
  const existingSlidesCount = await db.cmsHeroSlide.count();
  if (existingSlidesCount === 0) {
    for (const slide of heroSlides) {
      await db.cmsHeroSlide.create({ data: slide });
    }
    console.log(`✅ Seeded ${heroSlides.length} Hero Slides.`);
  } else {
    console.log(`ℹ️ Hero Slides already present (${existingSlidesCount} items). Skipping duplicate creation.`);
  }

  // 3. Seed CmsPartner
  console.log("\n3. Seeding Trusted Partners...");
  const partners = [
    { name: "Grameenphone", websiteUrl: "https://grameenphone.com" },
    { name: "Banglalink", websiteUrl: "https://banglalink.net" },
    { name: "Robi", websiteUrl: "https://robi.com.bd" },
    { name: "Airtel", websiteUrl: "https://bd.airtel.com" },
    { name: "Teletalk", websiteUrl: "https://teletalk.com.bd" },
    { name: "IGL Group", websiteUrl: "https://iglweb.com" },
    { name: "IGL Network™ Ltd.", websiteUrl: "https://iglnetwork.com" },
    { name: "Unicode Converter", websiteUrl: "https://unicode.org" },
    { name: "iNews24 Ltd.", websiteUrl: "https://inews24.com" },
    { name: "RamBD Ltd.", websiteUrl: "https://rambd.com" },
    { name: "Student Visa BD", websiteUrl: "https://studentvisabd.com" },
    { name: "Felna Tech", websiteUrl: "https://felna.com" },
  ];

  const existingPartnersCount = await db.cmsPartner.count();
  if (existingPartnersCount === 0) {
    for (let i = 0; i < partners.length; i++) {
      await db.cmsPartner.create({
        data: {
          name: partners[i].name,
          websiteUrl: partners[i].websiteUrl,
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }
    console.log(`✅ Seeded ${partners.length} Trusted Partners.`);
  } else {
    console.log(`ℹ️ Partners already present (${existingPartnersCount} items). Skipping duplicate creation.`);
  }

  // 4. Seed CmsPromotionalSection
  console.log("\n4. Seeding Promotional Sections...");
  const promotionalSections = [
    {
      sectionKey: "bulk_sms_offer",
      badge: "Special Promotional Offer",
      title: "Mega Ramadan & Eid Special Bulk SMS Package — Starting at 23 Paisa",
      subtitle: "Fastest Carrier Delivery Across All BD Telcos",
      description:
        "Supercharge your business promotional campaigns with Bangladesh's most reliable high-throughput SMS route. Enjoy instant sender-ID approval, automated phone normalization (+880), real-time operator DLR, and dedicated 24/7 technical support.",
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
      ctaText: "Claim 23 Paisa Rate",
      ctaUrl: "/register",
      isActive: true,
    },
    {
      sectionKey: "marketing_section",
      badge: "Targeted Customer Communication",
      title: "Data-Driven SMS Marketing to Reach Every Customer Mobile Instantly",
      subtitle:
        "Connect directly with your customers across Bangladesh. High open rates, zero spam filtering, and instant operator delivery make SMS the highest-ROI marketing channel.",
      description:
        "With direct connectivity to all telecom operators in Bangladesh, Felna ensures that your promotional and transactional broadcasts hit customer inboxes in seconds, driving maximum engagement and conversion.",
      imageUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80",
      ctaText: "Launch Campaign",
      ctaUrl: "/register",
      isActive: true,
    },
  ];

  for (const promo of promotionalSections) {
    await db.cmsPromotionalSection.upsert({
      where: { sectionKey: promo.sectionKey },
      update: promo,
      create: promo,
    });
  }
  console.log(`✅ Seeded ${promotionalSections.length} Promotional Sections.`);

  // 5. Seed CmsFeatureItem (Benefits & Why Choose Us)
  console.log("\n5. Seeding Features & Benefits...");
  const benefits = [
    {
      title: "You Can Increase Customer Engagement By Bulk SMS Services",
      description:
        "Think of bulk SMS service solution as a way to enhance how your brand engages with your all customers across the entire customer life cycle. Businesses should remember to vary the type of content they send out by bulk SMS promotion - while customers may value updates and news on forthcoming developments within the brand by bulk SMS, business promotional information is best delivered way via sms marketing services where longer, more creative messaging is more appropriate.",
    },
    {
      title: "Speed Up Your Sale By Bulk SMS Marketing",
      description:
        "Speed up your sale by bulk SMS marketing way, this is only way to connect with your customer directly phone to phone instantly. there is no any others way to connect/reach your target customer. You can try once to better understand. Bulk SMS service is the only way to create brand first in the corporate market.",
    },
    {
      title: "Cost Effective SMS Marketing Solution",
      description:
        "SMS marketing service is only way to make cost effective marketing solution in any time, this way is too strong then any others marketing solution way, like news paper, TV, radio etc. you can send bulk SMS for promotion to customer so customer seen instant from his mobile phone with cheap cost way.",
    },
    {
      title: "Bulk SMS Is A Direct Immediate Channel With Customer Engagement",
      description:
        "Bulk SMS service is one of the most popular way to connect with your customer; with a read rate of 90% within 30 minutes from delivery, you can be reassured that your time critical messages will be read almost instantly. A significant 45% of bulk SMS campaigns generate a successful ROI (Return on Investment), reaching over 50% when combined with other popular channels such as email and social media. so bulk SMS promotion is a one of the best way for your brand popularity",
    },
    {
      title: "Bulk SMS Is A Simple Way But Feedback Is Too Large",
      description:
        "SMS marketing cost is very cheap but feedback better then any others marketing system. and customer satisfaction is too much showing able. If you don't believe so you can try once with bulk SMS marketing for test.",
    },
  ];

  const whyChooseUsCards = [
    {
      title: "Mobile Payment Solution",
      description: "You Can Pay Your Corporate Mobile Bill From Same Panel.",
      iconName: "Wallet",
    },
    {
      title: "Cheap SMS Rate Better Support",
      description: "We Provide You Lowest Rate of SMS Masking or non-Masking.",
      iconName: "MessageSquareText",
    },
    {
      title: "24/7 Support Instantly",
      description: "We ensure 24/7 support by mail and phone.",
      iconName: "Headset",
    },
    {
      title: "Masking SMS Configuration",
      description: "We Can Provide Your Masking With in a Day for Business promotion",
      iconName: "ShieldCheck",
    },
  ];

  const existingFeatureCount = await db.cmsFeatureItem.count();
  if (existingFeatureCount === 0) {
    for (let i = 0; i < benefits.length; i++) {
      await db.cmsFeatureItem.create({
        data: {
          section: "BENEFIT",
          title: benefits[i].title,
          description: benefits[i].description,
          iconName: "CheckCircle2",
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }

    for (let i = 0; i < whyChooseUsCards.length; i++) {
      await db.cmsFeatureItem.create({
        data: {
          section: "WHY_CHOOSE_US",
          title: whyChooseUsCards[i].title,
          description: whyChooseUsCards[i].description,
          iconName: whyChooseUsCards[i].iconName,
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }
    console.log(
      `✅ Seeded ${benefits.length} Benefits and ${whyChooseUsCards.length} Why Choose Us items.`
    );
  } else {
    console.log(`ℹ️ Feature items already present (${existingFeatureCount} items). Skipping duplicate creation.`);
  }

  // 6. Seed CmsSocialLink
  console.log("\n6. Seeding Social Links...");
  const socialLinks = [
    { platform: "facebook", label: "Facebook", url: "https://facebook.com/felna", displayOrder: 1 },
    { platform: "youtube", label: "YouTube", url: "https://youtube.com/felna", displayOrder: 2 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/company/felna", displayOrder: 3 },
    { platform: "twitter", label: "Twitter / X", url: "https://x.com/felna", displayOrder: 4 },
  ];

  const existingSocialCount = await db.cmsSocialLink.count();
  if (existingSocialCount === 0) {
    for (const social of socialLinks) {
      await db.cmsSocialLink.create({ data: { ...social, isActive: true } });
    }
    console.log(`✅ Seeded ${socialLinks.length} Social Links.`);
  } else {
    console.log(`ℹ️ Social links already present (${existingSocialCount} items). Skipping duplicate creation.`);
  }

  // 7. Seed Initial Audit Log
  console.log("\n7. Recording Initial Audit Log...");
  await db.cmsAuditLog.create({
    data: {
      userId: "system",
      action: "INITIAL_SEED",
      entity: "CMS",
      entityId: "initial-setup",
      changes: JSON.stringify({
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        description: "Initial automated seeding of all 7 CMS models from production frontend specs.",
      }),
    },
  });
  console.log("✅ Initial Audit Log recorded.");

  console.log("\n=======================================================");
  console.log("🎉 CMS Seeding Completed Successfully in Neon PostgreSQL!");
  console.log("=======================================================\n");
}

main()
  .catch((err) => {
    console.error("❌ CMS Seeding Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    // End process cleanly
    process.exit(0);
  });
