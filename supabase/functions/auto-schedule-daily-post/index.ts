import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All service topics with Guntur/Andhra Pradesh focused SEO keywords
const serviceTopics = [
  {
    serviceId: "seo",
    topics: [
      "Best SEO Services in Guntur: How to Rank #1 on Google in 2024",
      "Local SEO Strategies for Businesses in Guntur, Andhra Pradesh",
      "Why Every Guntur Business Needs Professional SEO Services",
      "Top SEO Agency in Guntur: Proven Strategies for Higher Rankings",
      "Complete Guide to SEO for Small Businesses in Andhra Pradesh",
      "How the Best Digital Marketing Agency in Guntur Boosts Your SEO",
      "Technical SEO Tips from Guntur's Leading Digital Marketing Experts",
    ],
  },
  {
    serviceId: "social-media",
    topics: [
      "Social Media Marketing Services in Guntur: Grow Your Brand Online",
      "Best Social Media Agency in Guntur, Andhra Pradesh for Local Businesses",
      "How Guntur Businesses Can Dominate Instagram and Facebook Marketing",
      "Social Media Strategies That Work for Andhra Pradesh Businesses",
      "Top Social Media Marketing Company in Guntur: Expert Solutions",
      "LinkedIn Marketing for B2B Companies in Guntur and Vijayawada",
      "How to Choose the Best Digital Marketing Agency in Guntur for Social Media",
    ],
  },
  {
    serviceId: "google-ads",
    topics: [
      "Google Ads Management Services in Guntur: Maximize Your ROI",
      "Best PPC Agency in Guntur for High-Converting Ad Campaigns",
      "How Guntur Businesses Can Benefit from Google Ads in 2024",
      "Top Google Ads Experts in Andhra Pradesh: PS Digital Marketing",
      "PPC Advertising Strategies for Businesses in Guntur Region",
      "Why Choose a Local Google Ads Agency in Guntur Over Hyderabad",
      "Best Digital Marketing Agency in Guntur for Pay-Per-Click Advertising",
    ],
  },
  {
    serviceId: "web-development",
    topics: [
      "Best Website Development Company in Guntur, Andhra Pradesh",
      "Professional Web Design Services for Guntur Businesses",
      "E-commerce Website Development in Guntur: Complete Guide",
      "Top Web Development Agency in Guntur for Modern Websites",
      "Affordable Website Design Services in Andhra Pradesh",
      "How Guntur's Best Digital Marketing Agency Creates High-Converting Websites",
      "WordPress Development Services in Guntur: Expert Solutions",
    ],
  },
  {
    serviceId: "content-marketing",
    topics: [
      "Content Marketing Services in Guntur: Drive Traffic and Leads",
      "Best Content Writing Agency in Guntur, Andhra Pradesh",
      "How Content Marketing Helps Guntur Businesses Grow Online",
      "Blog Writing Services from the Best Digital Marketing Agency in Guntur",
      "SEO Content Strategy for Businesses in Andhra Pradesh",
      "Top Content Marketing Company in Guntur for Brand Growth",
      "Copywriting Services That Convert: Guntur's Leading Agency",
    ],
  },
  {
    serviceId: "email-marketing",
    topics: [
      "Email Marketing Services in Guntur: Nurture Leads Effectively",
      "Best Email Marketing Agency in Andhra Pradesh for Business Growth",
      "How Guntur Businesses Can Increase Sales with Email Automation",
      "Professional Email Campaign Management in Guntur Region",
      "Top Digital Marketing Agency in Guntur for Email Marketing",
      "Email Newsletter Services for Andhra Pradesh Companies",
      "Lead Nurturing Strategies from Guntur's Best Marketing Experts",
    ],
  },
  {
    serviceId: "branding",
    topics: [
      "Best Branding Agency in Guntur: Build a Memorable Brand Identity",
      "Logo Design Services in Guntur, Andhra Pradesh",
      "Professional Brand Identity Design for Guntur Businesses",
      "How the Best Digital Marketing Agency in Guntur Creates Brands",
      "Complete Branding Solutions in Andhra Pradesh",
      "Visual Identity Design Services from Top Guntur Agency",
      "Brand Strategy Consulting for Businesses in Guntur Region",
    ],
  },
  {
    serviceId: "video-marketing",
    topics: [
      "Video Marketing Services in Guntur: Engage Your Audience",
      "Best Video Production Company in Guntur, Andhra Pradesh",
      "YouTube Marketing Strategies for Guntur Local Businesses",
      "Professional Video Ads from Top Digital Marketing Agency in Guntur",
      "Explainer Video Services in Andhra Pradesh",
      "Social Media Video Content for Guntur Brands",
      "Video SEO Tips from the Best Marketing Agency in Guntur",
    ],
  },
  {
    serviceId: "influencer-marketing",
    topics: [
      "Influencer Marketing Services in Guntur and Andhra Pradesh",
      "How to Find the Right Influencers for Your Guntur Business",
      "Best Influencer Marketing Agency in Guntur Region",
      "Instagram Influencer Campaigns for Andhra Pradesh Brands",
      "Top Digital Marketing Agency in Guntur for Influencer Partnerships",
      "Micro-Influencer Marketing Strategies for Local Guntur Businesses",
      "ROI-Driven Influencer Marketing in Andhra Pradesh",
    ],
  },
  {
    serviceId: "orm",
    topics: [
      "Online Reputation Management in Guntur: Protect Your Brand",
      "Best ORM Services in Andhra Pradesh for Business Credibility",
      "How Guntur Businesses Can Manage Google Reviews Effectively",
      "Reputation Management Agency in Guntur: Expert Solutions",
      "Top Digital Marketing Agency in Guntur for Brand Reputation",
      "Crisis Management Services for Andhra Pradesh Companies",
      "Review Management Strategies from Guntur's Leading Agency",
    ],
  },
  {
    serviceId: "app-marketing",
    topics: [
      "App Marketing Services in Guntur: Boost Downloads and Engagement",
      "Best Mobile App Promotion Agency in Andhra Pradesh",
      "App Store Optimization (ASO) Services in Guntur",
      "How to Market Your App in Guntur and Vijayawada Region",
      "Top Digital Marketing Agency in Guntur for App Marketing",
      "User Acquisition Strategies for Andhra Pradesh App Developers",
      "App Install Campaigns from Guntur's Leading Marketing Agency",
    ],
  },
  {
    serviceId: "marketing-automation",
    topics: [
      "Marketing Automation Services in Guntur: Scale Your Business",
      "Best Automation Agency in Andhra Pradesh for Lead Generation",
      "How Guntur Businesses Can Automate Their Marketing Funnels",
      "CRM and Marketing Automation Solutions in Guntur Region",
      "Top Digital Marketing Agency in Guntur for Business Automation",
      "Lead Scoring and Nurturing Automation in Andhra Pradesh",
      "HubSpot and Salesforce Implementation in Guntur",
    ],
  },
];

// High-ranking digital marketing keywords to include
const seoKeywords = [
  "best digital marketing agency in guntur",
  "digital marketing services guntur",
  "top marketing company andhra pradesh",
  "guntur digital marketing",
  "seo services guntur",
  "social media marketing guntur",
  "online marketing andhra pradesh",
  "web development guntur",
  "ppc advertising guntur",
  "digital marketing near me",
  "best seo company guntur",
  "marketing agency vijayawada",
  "andhra pradesh marketing services",
  "ps digital marketing",
  "guntur business growth",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get today's date to determine which service topic to use
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Rotate through services (12 services)
    const serviceIndex = dayOfYear % serviceTopics.length;
    const service = serviceTopics[serviceIndex];

    // Rotate through topics within the service
    const topicIndex = Math.floor(dayOfYear / serviceTopics.length) % service.topics.length;
    const topic = service.topics[topicIndex];

    // Schedule for 5 PM IST today (or next day if already past)
    const scheduledTime = new Date(today);
    scheduledTime.setHours(17, 0, 0, 0); // 5 PM

    // If it's already past 5 PM, the cron job will process it immediately
    // which is the intended behavior

    // Build custom instructions with high-ranking keywords
    const customInstructions = `
IMPORTANT SEO REQUIREMENTS:
- Primary Keyword: "best digital marketing agency in guntur" - Use in title, first paragraph, H2, and conclusion
- Secondary Keywords to include naturally throughout the content:
  ${seoKeywords.slice(0, 8).join(", ")}
- Location Keywords: Guntur, Andhra Pradesh, Vijayawada, AP, South India
- Include phrases like "PS Digital, the best digital marketing agency in Guntur"
- Mention "serving businesses across Guntur, Vijayawada, and Andhra Pradesh"
- Add local context and examples relevant to Guntur businesses
- Include a section about why choosing a local Guntur agency matters
- End with a strong CTA mentioning PS Digital's services in Guntur

TARGET AUDIENCE:
- Business owners in Guntur and Andhra Pradesh
- Entrepreneurs looking for digital marketing services
- Companies wanting to grow their online presence in the region

CONTENT STRUCTURE:
- Start with a hook about digital marketing in Guntur
- Include statistics relevant to Andhra Pradesh market
- Add case study examples (can be hypothetical) of Guntur businesses
- Provide actionable tips specific to the local market
- Conclude with why PS Digital is the best choice in Guntur
`;

    // Check if we already scheduled a post for today
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const { data: existingPost } = await supabase
      .from("scheduled_blog_posts")
      .select("id")
      .eq("service_id", service.serviceId)
      .gte("created_at", todayStart.toISOString())
      .lte("created_at", todayEnd.toISOString())
      .single();

    if (existingPost) {
      return new Response(
        JSON.stringify({
          message: "Post already scheduled for today",
          skipped: true,
          service: service.serviceId,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the scheduled post
    const { data: scheduledPost, error } = await supabase
      .from("scheduled_blog_posts")
      .insert({
        title: topic,
        topic: topic,
        service_id: service.serviceId,
        scheduled_at: scheduledTime.toISOString(),
        status: "pending",
        include_internal_links: true,
        website_url: "https://psdigitalmarketingagency.in",
        custom_instructions: customInstructions,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create scheduled post: ${error.message}`);
    }

    console.log(`Auto-scheduled daily post: ${topic} for service: ${service.serviceId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily post scheduled successfully",
        scheduledPost: {
          id: scheduledPost.id,
          title: topic,
          service: service.serviceId,
          scheduledAt: scheduledTime.toISOString(),
        },
        dayOfYear,
        serviceIndex,
        topicIndex,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in auto-schedule-daily-post:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
