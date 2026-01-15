import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getServiceById, services } from "@/data/services";
import { Button } from "@/components/ui/button";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = getServiceById(serviceId || "");

  if (!service) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const whatsappNumber = "919346884544";
  const whatsappMessage = encodeURIComponent(
    `Hi PS Digital! I'm interested in your ${service.title} services. Can we discuss further?`
  );

  const tiers = [
    { name: "Basic", features: service.features.basic },
    { name: "Standard", features: service.features.standard, popular: true },
    { name: "Premium", features: service.features.premium },
    { name: "Enterprise", features: service.features.enterprise },
  ];

  // Get related services (exclude current)
  const relatedServices = services
    .filter((s) => s.id !== service.id)
    .slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`py-20 bg-gradient-to-br ${service.color} text-white`}>
        <div className="container">
          <Link
            to="/#services"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <service.icon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {service.title}
            </h1>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
            {service.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
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
        </div>
      </section>

      {/* Sub-Services Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Our <span className="gradient-text">{service.shortTitle}</span> Services
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Comprehensive solutions tailored to your specific needs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.subServices.map((subService, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 hover-lift card-shadow border border-border/50 hover:border-primary/50"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{subService.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {subService.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Flexible packages designed to meet your business requirements
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-card rounded-xl p-6 border ${
                  tier.popular
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/50"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="font-bold text-xl mb-4">{tier.name}</h3>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hi PS Digital! I'm interested in the ${tier.name} plan for ${service.title}. Can you share the pricing details?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact for Pricing
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Related Services */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Related <span className="gradient-text">Services</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.id}
                to={`/services/${relatedService.id}`}
                className="group bg-card rounded-xl p-6 hover-lift card-shadow border border-border/50 hover:border-primary/50"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${relatedService.color} flex items-center justify-center mb-4`}>
                  <relatedService.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {relatedService.shortTitle}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {relatedService.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
