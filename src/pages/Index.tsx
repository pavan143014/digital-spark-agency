import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import BookingSection from "@/components/sections/BookingSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <BookingSection />
    </Layout>
  );
};

export default Index;
