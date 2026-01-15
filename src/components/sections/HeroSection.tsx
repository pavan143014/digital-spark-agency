import { Link } from "react-router-dom";
import { ArrowRight, Play, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Serving Andhra Pradesh & Telangana
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Grow Your Business with{" "}
              <span className="gradient-text">Digital Marketing</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              We help businesses increase their online visibility, generate quality leads, 
              and achieve measurable growth through data-driven digital marketing strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="gradient-bg border-0 text-base">
                <Link to="/booking">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <a href="https://wa.me/919346884544" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold gradient-text">500+</p>
                <p className="text-sm text-muted-foreground">Projects Done</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">300+</p>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">8+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                alt="Digital Marketing Dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border">
              <p className="text-sm font-medium">Average ROI</p>
              <p className="text-2xl font-bold gradient-text">+340%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
