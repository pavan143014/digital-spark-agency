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

export interface FAQ {
  question: string;
  answer: string;
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
  faqs: FAQ[];
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
    },
    faqs: [
      { question: "How long does it take to see SEO results?", answer: "SEO is a long-term investment. Most clients start seeing improvements within 3-6 months, with significant results typically appearing after 6-12 months of consistent optimization." },
      { question: "What's the difference between on-page and off-page SEO?", answer: "On-page SEO focuses on optimizing elements within your website (content, meta tags, structure), while off-page SEO involves external factors like backlinks, social signals, and brand mentions." },
      { question: "Do you guarantee first page rankings?", answer: "No ethical SEO agency can guarantee specific rankings as search algorithms are constantly changing. We focus on sustainable, white-hat strategies that deliver long-term growth." },
      { question: "How do you choose keywords for my business?", answer: "We conduct thorough keyword research analyzing search volume, competition, relevance, and user intent to identify the most valuable keywords for your specific business goals." }
    ]
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
    },
    faqs: [
      { question: "Which social media platforms should my business be on?", answer: "It depends on your target audience. B2B businesses often benefit from LinkedIn, while B2C brands typically see better results on Instagram and Facebook. We analyze your audience to recommend the right platforms." },
      { question: "How often should we post on social media?", answer: "Posting frequency varies by platform. Generally, 1-2 posts daily on Twitter/X, 3-5 times weekly on Facebook/LinkedIn, and 4-7 times weekly on Instagram work well. Consistency matters more than volume." },
      { question: "Do you create the content or do we provide it?", answer: "We handle content creation including graphics, captions, and hashtag research. However, we collaborate with you for brand-specific information, product images, and approval of content before posting." },
      { question: "How do you measure social media success?", answer: "We track engagement rates, follower growth, reach, website traffic from social, conversions, and ROI. Monthly reports provide detailed insights into performance and recommendations." }
    ]
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
    },
    faqs: [
      { question: "How much should I budget for Google Ads?", answer: "Budget depends on your industry, competition, and goals. We recommend starting with at least ₹25,000-50,000/month to gather meaningful data. We'll help optimize spend as we learn what works best." },
      { question: "How quickly will I see results from PPC?", answer: "Unlike SEO, PPC delivers immediate visibility. You can see traffic within hours of launch. However, optimization for best ROI typically takes 2-4 weeks of data collection and refinement." },
      { question: "What's the difference between Google Ads and SEO?", answer: "Google Ads provides instant visibility through paid placements, while SEO builds organic rankings over time. Both are valuable - PPC for immediate results and SEO for sustainable long-term traffic." },
      { question: "Do you manage the ad budget or do we pay Google directly?", answer: "You pay Google directly for ad spend. Our management fee is separate. This ensures transparency and you maintain full control over your advertising budget." }
    ]
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
    },
    faqs: [
      { question: "How long does it take to build a website?", answer: "A basic 5-page website takes 2-3 weeks. Standard sites with CMS take 4-6 weeks. E-commerce and custom applications typically require 8-12 weeks depending on complexity." },
      { question: "Will my website be mobile-friendly?", answer: "Absolutely! All our websites are fully responsive and optimized for mobile devices. We test across multiple screen sizes to ensure a seamless experience everywhere." },
      { question: "Do I need to provide content for my website?", answer: "We can work with content you provide or create it for you (additional service). At minimum, we need information about your business, services, and any specific messaging you want to convey." },
      { question: "What happens after my website is launched?", answer: "We provide post-launch support based on your plan (1-12 months). This includes bug fixes, minor updates, and technical support. We also offer ongoing maintenance packages for long-term care." }
    ]
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
    },
    faqs: [
      { question: "What types of content do you create?", answer: "We create blog posts, articles, website copy, social media content, email newsletters, e-books, whitepapers, infographics, video scripts, and more. We tailor content to your audience and goals." },
      { question: "How do you ensure content quality?", answer: "Our process includes thorough research, professional writing, SEO optimization, and multiple rounds of editing. All content goes through quality checks before delivery and client approval." },
      { question: "Can you write content for technical industries?", answer: "Yes! We have experienced writers who specialize in various industries including technology, healthcare, finance, and legal. We also collaborate with subject matter experts when needed." },
      { question: "How does content marketing help SEO?", answer: "Quality content helps SEO by targeting keywords, attracting backlinks, increasing dwell time, and establishing topical authority. Regular publishing signals to search engines that your site is active and relevant." }
    ]
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
    },
    faqs: [
      { question: "What email marketing platform do you use?", answer: "We work with popular platforms like Mailchimp, Klaviyo, HubSpot, and ActiveCampaign. We can recommend the best platform based on your needs or work with your existing setup." },
      { question: "How do you build an email list ethically?", answer: "We use opt-in strategies like lead magnets, signup forms, landing pages, and content upgrades. We never purchase lists or use spam tactics, ensuring high-quality, engaged subscribers." },
      { question: "What's a good email open rate?", answer: "Average open rates vary by industry, typically ranging from 15-25%. We work to exceed industry benchmarks through compelling subject lines, proper segmentation, and optimal send times." },
      { question: "How often should we send emails?", answer: "It depends on your audience and content. Most businesses benefit from 1-4 emails per month. We'll help find the right frequency that keeps subscribers engaged without overwhelming them." }
    ]
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
    },
    faqs: [
      { question: "What's included in a complete brand identity?", answer: "A complete brand identity includes logo (with variations), color palette, typography, imagery style, brand voice guidelines, and applications across various touchpoints like business cards and social media." },
      { question: "How many logo concepts will I receive?", answer: "Depending on your package, you'll receive 3-5 unique logo concepts. After you choose a direction, we refine it based on your feedback until you're completely satisfied." },
      { question: "Do I own the rights to my logo and brand assets?", answer: "Yes! Upon final payment, you receive full ownership and copyright of all brand assets. We provide source files in multiple formats for any future use." },
      { question: "How long does a branding project take?", answer: "A logo-only project takes 2-3 weeks. Complete brand identity packages typically take 4-8 weeks, depending on the scope and number of revision rounds needed." }
    ]
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
    },
    faqs: [
      { question: "What types of videos do you produce?", answer: "We create promotional videos, explainer animations, testimonials, product demos, social media videos, YouTube content, video ads, and corporate videos. We handle everything from concept to final delivery." },
      { question: "Do you handle scripting and storyboarding?", answer: "Yes! Our creative team develops scripts and storyboards based on your brief. We work collaboratively to ensure the video aligns with your brand voice and objectives." },
      { question: "What's the typical turnaround time for a video?", answer: "Simple social media videos take 1-2 weeks. Explainer videos and promotional content typically require 3-4 weeks. Complex productions with live shooting may take 4-8 weeks." },
      { question: "Can you optimize videos for different platforms?", answer: "Absolutely! We create multiple versions optimized for each platform - vertical for Instagram/TikTok, square for Facebook, landscape for YouTube, and appropriate lengths for each channel." }
    ]
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
    },
    faqs: [
      { question: "How do you find the right influencers for my brand?", answer: "We analyze your target audience, brand values, and campaign goals. Then we evaluate influencers based on engagement rates, audience demographics, authenticity, and brand fit - not just follower count." },
      { question: "What's the difference between micro and macro influencers?", answer: "Micro-influencers (10K-100K followers) typically have higher engagement rates and niche audiences. Macro-influencers (100K-1M) offer broader reach. We recommend the right mix based on your goals." },
      { question: "How do you measure influencer campaign success?", answer: "We track reach, engagement, click-through rates, conversions, and ROI. We use unique tracking links and promo codes when applicable. Detailed reports show exactly what you're getting from your investment." },
      { question: "Do you handle influencer contracts and payments?", answer: "Yes! We manage the entire process including negotiations, contracts, content briefs, approvals, and payments. You deal with us, and we handle all influencer relationships." }
    ]
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
    },
    faqs: [
      { question: "Can you remove negative reviews from Google?", answer: "We can't remove genuine reviews, but we can help flag fake or policy-violating reviews for removal. Our main strategy is building positive reviews and pushing down negative content in search results." },
      { question: "How do you suppress negative search results?", answer: "We use SEO techniques to create and optimize positive content that outranks negative results. This includes press releases, social profiles, blog posts, and other owned media that push down unwanted content." },
      { question: "What if there's a reputation crisis?", answer: "We have crisis protocols for rapid response. This includes immediate monitoring, strategic communications, press statements if needed, and aggressive positive content publishing to control the narrative." },
      { question: "How long does reputation repair take?", answer: "Timeline depends on the severity. Minor issues may improve in 2-3 months. Significant reputation damage can take 6-12 months of consistent effort. We set realistic expectations based on your situation." }
    ]
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
    },
    faqs: [
      { question: "What is App Store Optimization (ASO)?", answer: "ASO is like SEO for app stores. It involves optimizing your app's title, keywords, description, screenshots, and reviews to rank higher in app store search results and increase organic downloads." },
      { question: "How do you increase app downloads?", answer: "We use a combination of ASO for organic growth, paid user acquisition campaigns (Google UAC, Facebook App Ads), influencer marketing, and review optimization to drive quality downloads." },
      { question: "Do you work with both iOS and Android apps?", answer: "Yes! We optimize for both Apple App Store and Google Play Store. Each platform has unique algorithms and best practices that we address in our strategies." },
      { question: "How do you improve app ratings?", answer: "We implement in-app review prompts at optimal moments, respond to user feedback, encourage satisfied users to leave reviews, and help address issues that lead to negative ratings." }
    ]
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
    },
    faqs: [
      { question: "What marketing tasks can be automated?", answer: "Many tasks can be automated including email sequences, lead scoring, social media posting, customer onboarding, abandoned cart reminders, appointment scheduling, and reporting. We identify opportunities specific to your business." },
      { question: "What platforms do you integrate with?", answer: "We work with major platforms including HubSpot, Salesforce, Zoho, Mailchimp, ActiveCampaign, Zapier, and many more. We can also build custom integrations for specialized tools." },
      { question: "How do chatbots help my business?", answer: "Chatbots provide 24/7 customer support, qualify leads, answer FAQs, book appointments, and guide users through processes. They improve response times and free up your team for complex tasks." },
      { question: "Is marketing automation only for large companies?", answer: "Not at all! Automation benefits businesses of all sizes. Small businesses often see the biggest impact as it allows them to compete with larger companies without additional staff. We offer scalable solutions." }
    ]
  }
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};
