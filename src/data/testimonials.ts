export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "CEO",
    company: "TechVentures India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "PS Digital transformed our online presence completely. Our organic traffic increased by 300% in just 6 months. Their SEO expertise is unmatched!"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Marketing Director",
    company: "Fashion Hub",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The social media campaigns by PS Digital helped us reach a younger audience. Our Instagram following grew from 5K to 100K in one year!"
  },
  {
    id: 3,
    name: "Arun Reddy",
    role: "Founder",
    company: "GreenEarth Solutions",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Professional, responsive, and results-driven. Their Google Ads management delivered 5x ROAS for our e-commerce store."
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Business Owner",
    company: "Wellness Studio",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "From website design to content marketing, PS Digital handled everything perfectly. Our bookings increased by 150% after the new website launch."
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "COO",
    company: "Logistics Pro",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The marketing automation setup by PS Digital saved us countless hours. Our lead conversion rate improved by 200%."
  },
  {
    id: 6,
    name: "Meera Krishnan",
    role: "Managing Director",
    company: "EduTech Academy",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Excellent video marketing team! The explainer videos they created helped us simplify our complex offerings and boost enrollments."
  }
];

export const stats = [
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 300, suffix: "+", label: "Happy Clients" },
  { value: 8, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "M+", label: "Leads Generated" }
];

export const clientLogos = [
  "TechVentures",
  "Fashion Hub",
  "GreenEarth",
  "Wellness Studio",
  "Logistics Pro",
  "EduTech",
  "FinanceFirst",
  "HealthPlus"
];
