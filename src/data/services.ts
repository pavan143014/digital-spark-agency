import { 
  Search, 
  Share2, 
  MousePointerClick, 
  Globe, 
  FileText, 
  Mail, 
  Palette, 
  Video, 
  Users, 
  Shield, 
  Smartphone, 
  Zap,
  LucideIcon
} from "lucide-react";

export interface SubService {
  name: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  subServices: SubService[];
  features: {
    basic: string[];
    standard: string[];
    premium: string[];
    enterprise: string[];
  };
}

export const services: Service[] = [
  {
    id: "seo",
    title: "SEO (Search Engine Optimization)",
    shortTitle: "SEO",
    description: "Boost your online visibility and rank higher on Google with our comprehensive SEO strategies.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    subServices: [
      { name: "On-Page SEO", description: "Optimize content, meta tags, and site structure for better rankings" },
      { name: "Off-Page SEO / Link Building", description: "Build high-quality backlinks to increase domain authority" },
      { name: "Technical SEO", description: "Improve site speed, mobile optimization, and crawlability" },
      { name: "Local SEO", description: "Dominate local search results and Google Maps listings" },
      { name: "E-commerce SEO", description: "Optimize product pages and category structures for online stores" },
      { name: "SEO Audit & Analysis", description: "Comprehensive website analysis with actionable recommendations" }
    ],
    features: {
      basic: ["5 Keywords Optimization", "Monthly Report", "On-Page SEO", "Google Analytics Setup"],
      standard: ["15 Keywords Optimization", "Bi-Weekly Reports", "On-Page + Off-Page SEO", "Technical Audit", "Local SEO"],
      premium: ["30 Keywords Optimization", "Weekly Reports", "Complete SEO Suite", "Content Strategy", "Competitor Analysis"],
      enterprise: ["Unlimited Keywords", "Real-time Dashboard", "Dedicated SEO Team", "Custom Strategy", "Priority Support"]
    }
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    shortTitle: "Social Media",
    description: "Engage your audience and build a strong brand presence across all social platforms.",
    icon: Share2,
    color: "from-pink-500 to-rose-500",
    subServices: [
      { name: "Facebook Marketing", description: "Strategic campaigns to reach billions of active users" },
      { name: "Instagram Marketing", description: "Visual storytelling and influencer partnerships" },
      { name: "LinkedIn Marketing", description: "B2B lead generation and professional networking" },
      { name: "Twitter/X Marketing", description: "Real-time engagement and trend leveraging" },
      { name: "YouTube Marketing", description: "Video content strategy and channel growth" },
      { name: "Pinterest Marketing", description: "Visual discovery platform optimization" }
    ],
    features: {
      basic: ["2 Platforms", "8 Posts/Month", "Basic Graphics", "Monthly Analytics"],
      standard: ["4 Platforms", "16 Posts/Month", "Custom Graphics", "Community Management", "Bi-Weekly Reports"],
      premium: ["6 Platforms", "30 Posts/Month", "Premium Content", "Influencer Outreach", "Paid Ads Management"],
      enterprise: ["All Platforms", "Daily Posts", "Video Content", "24/7 Management", "Dedicated Team"]
    }
  },
  {
    id: "google-ads",
    title: "Google Ads / PPC Advertising",
    shortTitle: "Google Ads",
    description: "Drive instant traffic and conversions with targeted pay-per-click advertising campaigns.",
    icon: MousePointerClick,
    color: "from-orange-500 to-amber-500",
    subServices: [
      { name: "Search Ads", description: "Appear at the top of Google search results instantly" },
      { name: "Display Ads", description: "Visual banner ads across millions of websites" },
      { name: "Shopping Ads", description: "Product listings that drive e-commerce sales" },
      { name: "YouTube Ads", description: "Video advertising to engaged audiences" },
      { name: "Remarketing Campaigns", description: "Re-engage visitors who left without converting" },
      { name: "App Promotion Ads", description: "Drive app installs and engagement" }
    ],
    features: {
      basic: ["₹25,000 Ad Spend", "1 Campaign", "Basic Targeting", "Monthly Optimization"],
      standard: ["₹75,000 Ad Spend", "3 Campaigns", "Advanced Targeting", "A/B Testing", "Bi-Weekly Optimization"],
      premium: ["₹2,00,000 Ad Spend", "Unlimited Campaigns", "Remarketing", "Landing Pages", "Weekly Optimization"],
      enterprise: ["Custom Budget", "Multi-Platform", "Dedicated Manager", "Real-time Reporting", "24/7 Optimization"]
    }
  },
  {
    id: "web-development",
    title: "Website Development & Design",
    shortTitle: "Web Development",
    description: "Create stunning, high-performance websites that convert visitors into customers.",
    icon: Globe,
    color: "from-violet-500 to-purple-500",
    subServices: [
      { name: "Business Websites", description: "Professional websites that establish credibility" },
      { name: "E-commerce Websites", description: "Secure online stores with payment integration" },
      { name: "Landing Pages", description: "High-converting pages for campaigns and products" },
      { name: "WordPress Development", description: "Custom WordPress themes and plugins" },
      { name: "Custom Web Applications", description: "Tailored solutions for unique business needs" },
      { name: "Website Redesign", description: "Modernize your existing website for better results" }
    ],
    features: {
      basic: ["5 Pages", "Mobile Responsive", "Contact Form", "Basic SEO", "1 Month Support"],
      standard: ["10 Pages", "CMS Integration", "Blog Setup", "Analytics", "3 Months Support"],
      premium: ["20 Pages", "E-commerce Ready", "Custom Features", "Speed Optimization", "6 Months Support"],
      enterprise: ["Unlimited Pages", "Custom Development", "API Integration", "Dedicated Support", "1 Year Maintenance"]
    }
  },
  {
    id: "content-marketing",
    title: "Content Marketing",
    shortTitle: "Content Marketing",
    description: "Create compelling content that attracts, engages, and converts your target audience.",
    icon: FileText,
    color: "from-emerald-500 to-teal-500",
    subServices: [
      { name: "Blog Writing", description: "SEO-optimized articles that drive organic traffic" },
      { name: "Article Writing", description: "In-depth content for authority building" },
      { name: "Copywriting", description: "Persuasive copy that drives action" },
      { name: "Infographic Design", description: "Visual content that simplifies complex data" },
      { name: "E-books & Whitepapers", description: "Lead magnets that capture quality leads" },
      { name: "Press Releases", description: "News distribution for media coverage" }
    ],
    features: {
      basic: ["4 Blog Posts/Month", "Basic Research", "SEO Optimization", "1 Revision"],
      standard: ["8 Blog Posts/Month", "Keyword Research", "Content Calendar", "Social Snippets", "2 Revisions"],
      premium: ["12 Blog Posts/Month", "Content Strategy", "Infographics", "Guest Posting", "Unlimited Revisions"],
      enterprise: ["Daily Content", "Full Strategy", "Video Scripts", "E-books", "Dedicated Writer"]
    }
  },
  {
    id: "email-marketing",
    title: "Email Marketing",
    shortTitle: "Email Marketing",
    description: "Nurture leads and drive sales with targeted email campaigns and automation.",
    icon: Mail,
    color: "from-sky-500 to-blue-500",
    subServices: [
      { name: "Email Campaign Design", description: "Beautiful, responsive email templates" },
      { name: "Newsletter Management", description: "Regular updates to keep subscribers engaged" },
      { name: "Drip Campaigns", description: "Automated sequences that nurture leads" },
      { name: "Email Automation", description: "Trigger-based emails for timely communication" },
      { name: "List Building", description: "Grow your subscriber base organically" },
      { name: "A/B Testing", description: "Optimize campaigns for maximum performance" }
    ],
    features: {
      basic: ["2 Campaigns/Month", "500 Subscribers", "Basic Templates", "Open Rate Tracking"],
      standard: ["4 Campaigns/Month", "2,500 Subscribers", "Custom Templates", "Automation", "A/B Testing"],
      premium: ["8 Campaigns/Month", "10,000 Subscribers", "Advanced Automation", "Segmentation", "Detailed Analytics"],
      enterprise: ["Unlimited Campaigns", "Unlimited Subscribers", "Custom Integration", "Dedicated Support", "Advanced Reporting"]
    }
  },
  {
    id: "branding",
    title: "Branding & Identity",
    shortTitle: "Branding",
    description: "Build a memorable brand identity that sets you apart from the competition.",
    icon: Palette,
    color: "from-fuchsia-500 to-pink-500",
    subServices: [
      { name: "Logo Design", description: "Unique, memorable logos that represent your brand" },
      { name: "Brand Strategy", description: "Define your brand's voice, values, and positioning" },
      { name: "Visual Identity", description: "Consistent visual elements across all touchpoints" },
      { name: "Brand Guidelines", description: "Comprehensive guide for brand consistency" },
      { name: "Packaging Design", description: "Eye-catching product packaging" },
      { name: "Stationery Design", description: "Business cards, letterheads, and more" }
    ],
    features: {
      basic: ["Logo Design", "3 Concepts", "2 Revisions", "Source Files"],
      standard: ["Logo + Stationery", "5 Concepts", "Color Palette", "Typography", "Unlimited Revisions"],
      premium: ["Complete Brand Kit", "Brand Guidelines", "Social Templates", "Packaging Design", "Brand Strategy"],
      enterprise: ["Full Brand Overhaul", "Market Research", "Competitor Analysis", "Launch Strategy", "Ongoing Support"]
    }
  },
  {
    id: "video-marketing",
    title: "Video Marketing",
    shortTitle: "Video Marketing",
    description: "Capture attention and tell your story through compelling video content.",
    icon: Video,
    color: "from-red-500 to-orange-500",
    subServices: [
      { name: "Promotional Videos", description: "Showcase your products and services effectively" },
      { name: "Explainer Videos", description: "Simplify complex concepts with engaging animations" },
      { name: "Social Media Videos", description: "Short-form content optimized for each platform" },
      { name: "YouTube Channel Management", description: "Complete channel strategy and optimization" },
      { name: "Video Ads", description: "High-converting video advertisements" },
      { name: "Animation & Motion Graphics", description: "Creative animations that captivate viewers" }
    ],
    features: {
      basic: ["1 Video/Month", "30 Seconds", "Basic Editing", "Stock Music"],
      standard: ["2 Videos/Month", "60 Seconds", "Motion Graphics", "Voice Over", "Social Edits"],
      premium: ["4 Videos/Month", "2 Minutes", "Custom Animation", "Script Writing", "Distribution"],
      enterprise: ["Unlimited Videos", "Full Production", "Drone Footage", "Dedicated Team", "YouTube Management"]
    }
  },
  {
    id: "influencer-marketing",
    title: "Influencer Marketing",
    shortTitle: "Influencer Marketing",
    description: "Leverage trusted voices to amplify your brand message and reach new audiences.",
    icon: Users,
    color: "from-indigo-500 to-violet-500",
    subServices: [
      { name: "Influencer Outreach", description: "Connect with relevant influencers in your niche" },
      { name: "Campaign Management", description: "End-to-end influencer campaign execution" },
      { name: "Micro-Influencer Partnerships", description: "Cost-effective partnerships with engaged audiences" },
      { name: "Celebrity Collaborations", description: "High-impact celebrity endorsements" },
      { name: "Performance Tracking", description: "Measure ROI and campaign effectiveness" }
    ],
    features: {
      basic: ["3 Micro-Influencers", "1 Campaign", "Content Approval", "Basic Reporting"],
      standard: ["8 Influencers", "2 Campaigns", "Content Creation", "Performance Tracking", "Monthly Reports"],
      premium: ["15 Influencers", "4 Campaigns", "Macro-Influencers", "Video Content", "Detailed Analytics"],
      enterprise: ["Unlimited Influencers", "Celebrity Access", "Dedicated Manager", "Real-time Dashboard", "Custom Strategy"]
    }
  },
  {
    id: "reputation-management",
    title: "Online Reputation Management",
    shortTitle: "Reputation Management",
    description: "Protect and enhance your brand's online reputation across all platforms.",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    subServices: [
      { name: "Review Management", description: "Monitor and respond to online reviews" },
      { name: "Crisis Management", description: "Quick response to reputation threats" },
      { name: "Brand Monitoring", description: "Track brand mentions across the web" },
      { name: "Negative Content Removal", description: "Suppress or remove harmful content" },
      { name: "Reputation Building", description: "Proactive positive content creation" }
    ],
    features: {
      basic: ["Review Monitoring", "Monthly Report", "2 Platforms", "Response Templates"],
      standard: ["All Platform Monitoring", "Weekly Reports", "Review Responses", "Basic SEO Suppression"],
      premium: ["Real-time Alerts", "Crisis Protocol", "Content Creation", "Legal Support", "Detailed Analytics"],
      enterprise: ["24/7 Monitoring", "Dedicated Team", "PR Support", "Full Suppression", "Executive Reports"]
    }
  },
  {
    id: "app-marketing",
    title: "App Marketing & ASO",
    shortTitle: "App Marketing",
    description: "Drive app downloads and engagement with targeted mobile marketing strategies.",
    icon: Smartphone,
    color: "from-cyan-500 to-teal-500",
    subServices: [
      { name: "App Store Optimization", description: "Rank higher in app store search results" },
      { name: "App Install Campaigns", description: "Drive downloads through paid advertising" },
      { name: "In-App Advertising", description: "Monetize and promote within apps" },
      { name: "App Review Management", description: "Build positive ratings and reviews" },
      { name: "Mobile Analytics", description: "Track user behavior and optimize experience" }
    ],
    features: {
      basic: ["ASO Setup", "Keyword Research", "Screenshot Optimization", "Monthly Report"],
      standard: ["ASO + Install Campaigns", "A/B Testing", "Review Management", "Bi-Weekly Optimization"],
      premium: ["Full ASO Suite", "Paid Campaigns", "Retention Strategy", "Analytics Dashboard", "Weekly Reports"],
      enterprise: ["Global ASO", "Multi-Platform", "User Acquisition", "Custom Analytics", "Dedicated Team"]
    }
  },
  {
    id: "marketing-automation",
    title: "Marketing Automation",
    shortTitle: "Marketing Automation",
    description: "Streamline your marketing with intelligent automation and AI-powered tools.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    subServices: [
      { name: "CRM Integration", description: "Connect your marketing tools with CRM systems" },
      { name: "Lead Nurturing", description: "Automated sequences that convert leads to customers" },
      { name: "Workflow Automation", description: "Automate repetitive marketing tasks" },
      { name: "Chatbot Development", description: "24/7 customer engagement with AI chatbots" },
      { name: "Analytics & Reporting", description: "Unified dashboard for all marketing metrics" }
    ],
    features: {
      basic: ["1 Automation Workflow", "Email Triggers", "Basic Analytics", "Setup Support"],
      standard: ["5 Workflows", "Lead Scoring", "CRM Integration", "Chatbot", "Monthly Reports"],
      premium: ["15 Workflows", "Advanced Automation", "Multi-Channel", "AI Features", "Weekly Optimization"],
      enterprise: ["Unlimited Workflows", "Custom Development", "Full Integration", "Dedicated Support", "Real-time Analytics"]
    }
  }
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};
