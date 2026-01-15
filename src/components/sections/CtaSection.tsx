import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  const whatsappNumber = "919346884544";
  const whatsappMessage = encodeURIComponent(
    "Hi PS Digital! I'm interested in learning more about your digital marketing services."
  );

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Let's discuss how our digital marketing expertise can help you achieve your business goals. 
            Get a free consultation today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link to="/#booking">
                Book Free Consultation
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

          <p className="mt-8 text-white/60 text-sm">
            📍 Serving businesses in Andhra Pradesh & Telangana
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
