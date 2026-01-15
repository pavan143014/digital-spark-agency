export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 SEO Trends That Will Dominate 2024",
    excerpt: "Stay ahead of the competition with these essential SEO strategies that are shaping the future of search engine optimization.",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
    date: "Jan 15, 2024",
    readTime: "5 min read",
    slug: "seo-trends-2024"
  },
  {
    id: 2,
    title: "How to Create Viral Social Media Content",
    excerpt: "Learn the secrets behind viral content and how to apply these principles to your social media marketing strategy.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    date: "Jan 10, 2024",
    readTime: "7 min read",
    slug: "viral-social-media-content"
  },
  {
    id: 3,
    title: "Google Ads vs Facebook Ads: Which is Right for You?",
    excerpt: "A comprehensive comparison of the two advertising giants to help you decide where to invest your marketing budget.",
    category: "PPC",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    date: "Jan 5, 2024",
    readTime: "8 min read",
    slug: "google-ads-vs-facebook-ads"
  },
  {
    id: 4,
    title: "The Ultimate Guide to Email Marketing Automation",
    excerpt: "Discover how to set up automated email campaigns that nurture leads and drive conversions on autopilot.",
    category: "Email Marketing",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
    date: "Dec 28, 2023",
    readTime: "10 min read",
    slug: "email-marketing-automation-guide"
  }
];
