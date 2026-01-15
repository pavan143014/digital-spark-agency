import { Check, X, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  popular?: boolean;
}

interface Feature {
  name: string;
  category: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "₹15,000",
    description: "Perfect for small businesses getting started",
  },
  {
    name: "Professional",
    price: "₹35,000",
    description: "Ideal for growing businesses",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale operations",
  },
];

const features: Feature[] = [
  // Website & Design
  { name: "Responsive Website Design", category: "Website & Design", starter: true, professional: true, enterprise: true },
  { name: "Custom UI/UX Design", category: "Website & Design", starter: "Basic", professional: "Advanced", enterprise: "Premium" },
  { name: "Number of Pages", category: "Website & Design", starter: "5 Pages", professional: "15 Pages", enterprise: "Unlimited" },
  { name: "Mobile Optimization", category: "Website & Design", starter: true, professional: true, enterprise: true },
  { name: "Custom Animations", category: "Website & Design", starter: false, professional: true, enterprise: true },
  
  // SEO & Marketing
  { name: "Basic SEO Setup", category: "SEO & Marketing", starter: true, professional: true, enterprise: true },
  { name: "Advanced SEO Strategy", category: "SEO & Marketing", starter: false, professional: true, enterprise: true },
  { name: "Google Analytics Integration", category: "SEO & Marketing", starter: true, professional: true, enterprise: true },
  { name: "Social Media Integration", category: "SEO & Marketing", starter: "2 Platforms", professional: "5 Platforms", enterprise: "Unlimited" },
  { name: "Content Marketing", category: "SEO & Marketing", starter: false, professional: "Monthly", enterprise: "Weekly" },
  
  // Support & Maintenance
  { name: "Email Support", category: "Support & Maintenance", starter: true, professional: true, enterprise: true },
  { name: "Phone Support", category: "Support & Maintenance", starter: false, professional: true, enterprise: true },
  { name: "Priority Support", category: "Support & Maintenance", starter: false, professional: false, enterprise: true },
  { name: "Free Maintenance", category: "Support & Maintenance", starter: "1 Month", professional: "3 Months", enterprise: "12 Months" },
  { name: "Dedicated Account Manager", category: "Support & Maintenance", starter: false, professional: false, enterprise: true },
  
  // Advanced Features
  { name: "E-commerce Integration", category: "Advanced Features", starter: false, professional: true, enterprise: true },
  { name: "Payment Gateway Setup", category: "Advanced Features", starter: false, professional: true, enterprise: true },
  { name: "Custom API Development", category: "Advanced Features", starter: false, professional: false, enterprise: true },
  { name: "Third-party Integrations", category: "Advanced Features", starter: "1 Integration", professional: "5 Integrations", enterprise: "Unlimited" },
  { name: "Performance Optimization", category: "Advanced Features", starter: "Basic", professional: "Advanced", enterprise: "Premium" },
];

const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
};

const PricingComparisonTable = () => {
  const categories = [...new Set(features.map((f) => f.category))];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the Right Plan for Your Business
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare our packages and find the perfect fit for your digital needs.
            All plans include our commitment to quality and excellence.
          </p>
        </div>

        {/* Pricing Cards - Mobile */}
        <div className="grid grid-cols-1 md:hidden gap-6 mb-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "rounded-xl p-6 border",
                tier.popular
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-card"
              )}
            >
              {tier.popular && (
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.price !== "Custom" && (
                  <span className="text-muted-foreground">/project</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {tier.description}
              </p>
              <Button
                className="w-full mt-4"
                variant={tier.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[280px] font-semibold text-foreground">
                    Features
                  </TableHead>
                  {tiers.map((tier) => (
                    <TableHead
                      key={tier.name}
                      className={cn(
                        "text-center min-w-[140px]",
                        tier.popular && "bg-primary/10"
                      )}
                    >
                      <div className="space-y-1">
                        {tier.popular && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Popular
                          </Badge>
                        )}
                        <div className="font-bold text-foreground">
                          {tier.name}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {tier.price}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <>
                    <TableRow
                      key={category}
                      className="bg-muted/30 hover:bg-muted/30"
                    >
                      <TableCell
                        colSpan={4}
                        className="font-semibold text-foreground py-3"
                      >
                        {category}
                      </TableCell>
                    </TableRow>
                    {features
                      .filter((f) => f.category === category)
                      .map((feature) => (
                        <TableRow key={feature.name}>
                          <TableCell className="font-medium text-foreground/90">
                            {feature.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {renderFeatureValue(feature.starter)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-center",
                              tiers[1].popular && "bg-primary/5"
                            )}
                          >
                            {renderFeatureValue(feature.professional)}
                          </TableCell>
                          <TableCell className="text-center">
                            {renderFeatureValue(feature.enterprise)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:grid grid-cols-4 gap-4 mt-6">
          <div></div>
          {tiers.map((tier) => (
            <div key={tier.name} className="text-center">
              <Button
                size="lg"
                variant={tier.popular ? "default" : "outline"}
                className="w-full max-w-[200px]"
              >
                {tier.price === "Custom" ? "Contact Us" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComparisonTable;
