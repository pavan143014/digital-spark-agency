import Layout from "@/components/layout/Layout";
import { Users, Target, Award, Heart, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Praveen Kumar",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    description: "10+ years in digital marketing with expertise in SEO and growth strategies."
  },
  {
    name: "Sanjay Reddy",
    role: "Head of SEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    description: "SEO specialist with a track record of ranking 500+ keywords on page 1."
  },
  {
    name: "Priya Sharma",
    role: "Social Media Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    description: "Creative strategist managing campaigns across all major platforms."
  },
  {
    name: "Arun Patel",
    role: "PPC Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    description: "Google Ads certified expert with ₹10Cr+ in managed ad spend."
  }
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "We focus on measurable outcomes that directly impact your business growth."
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "Your success is our priority. We treat every client as a valued partner."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every campaign, strategy, and interaction."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We're passionate about digital marketing and helping businesses thrive."
  }
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">PS Digital</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We're a team of passionate digital marketers dedicated to helping businesses 
              in Andhra Pradesh & Telangana grow their online presence and achieve remarkable results.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  PS Digital was founded in 2016 with a simple mission: to help local businesses 
                  compete in the digital landscape. What started as a small SEO consultancy has 
                  grown into a full-service digital marketing agency.
                </p>
                <p>
                  Over the years, we've helped 300+ businesses across various industries achieve 
                  their marketing goals. From startups to established enterprises, we've delivered 
                  results that matter.
                </p>
                <p>
                  Today, we offer comprehensive digital marketing solutions including SEO, social 
                  media marketing, PPC advertising, web development, and much more. Our team of 
                  experts stays ahead of the latest trends to ensure our clients always have a 
                  competitive edge.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Our Team"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border/50">
                <div className="text-4xl font-bold gradient-text">8+</div>
                <div className="text-muted-foreground">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our <span className="gradient-text">Values</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            The principles that guide everything we do
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 text-center hover-lift card-shadow border border-border/50"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Experienced professionals dedicated to your success
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden hover-lift card-shadow border border-border/50 group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="gradient-text">Locations</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 card-shadow border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-xl">Andhra Pradesh Office</h3>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Vijayawada, Andhra Pradesh
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 93468 84544
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contact@psdigital.in
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 card-shadow border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-xl">Telangana Office</h3>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Hyderabad, Telangana
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 93468 84544
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contact@psdigital.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help your business grow online.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/#booking">Book Free Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
