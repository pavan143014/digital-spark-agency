import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CtaSection = () => {
  const whatsappNumber = "919346884544";
  const whatsappMessage = encodeURIComponent(
    "Hi PS Digital! I'm interested in learning more about your digital marketing services."
  );

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" 
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Let's discuss how our digital marketing expertise can help you achieve your business goals. 
              Contact us today!
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold"
              >
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mt-8 text-white/60 text-sm">
              📍 Serving businesses in Andhra Pradesh & Telangana
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
