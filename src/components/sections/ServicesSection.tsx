import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { services } from "@/data/services";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <section id="services" className="py-20 colorful-bg relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--ps-cyan)/0.05)] rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive digital marketing solutions to help your business grow online
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <StaggerItem key={service.id}>
              <motion.div
                layout
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedService === service.id 
                    ? "bg-card ring-2 ring-primary shadow-xl" 
                    : "bg-card/80 backdrop-blur-sm hover:bg-card border border-border/50 hover:border-primary/50"
                }`}
              >
                {/* Gradient Top Border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`} />
                
                {/* Main Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg shrink-0`}>
                        <service.icon className="h-7 w-7 text-white" />
                      </div>
                      
                      {/* Title & Description */}
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                          {service.shortTitle}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sub-services Toggle Button */}
                  <button
                    onClick={() => toggleService(service.id)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
                  >
                    {expandedService === service.id ? (
                      <>
                        Hide Services <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View {service.subServices.length} Sub-Services <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Expanded Sub-services */}
                  <AnimatePresence>
                    {expandedService === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                          {service.subServices.map((subService, subIndex) => (
                            <motion.div
                              key={subIndex}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: subIndex * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-card/70 backdrop-blur-sm border border-border/60 hover:bg-card transition-colors"
                            >
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shrink-0 text-white text-xs font-bold`}>
                                {subIndex + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{subService.name}</h4>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                  {subService.description}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                          
                          {/* Learn More Button */}
                          <Button asChild className="w-full mt-4 gradient-bg border-0">
                            <Link to={`/services/${service.id}`}>
                              Learn More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick Link when collapsed */}
                  {expandedService !== service.id && (
                    <Link
                      to={`/services/${service.id}`}
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Services CTA */}
        <ScrollReveal delay={0.4} className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Button asChild size="lg" variant="outline" className="gradient-border">
            <Link to="/contact">
              Contact Us for Custom Solutions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
