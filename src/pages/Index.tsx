import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import StatsSection from "@/components/sections/StatsSection";
import PricingComparisonTable from "@/components/sections/PricingComparisonTable";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BlogSection";
import CtaSection from "@/components/sections/CtaSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <PricingComparisonTable />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
