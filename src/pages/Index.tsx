import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BlogSection";
import BookingSection from "@/components/sections/BookingSection";
import CtaSection from "@/components/sections/CtaSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <BlogSection />
      <BookingSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
