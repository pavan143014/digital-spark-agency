import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import psDigitalLogo from "@/assets/ps-digital-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:9346884544" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="h-4 w-4" />
              +91 93468 84544
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Andhra Pradesh & Telangana
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={psDigitalLogo} 
            alt="PS Digital Marketing Agency" 
            className="h-24 w-auto transition-[filter] duration-200 dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                isActive(link.path) ? "bg-muted text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Open services menu"
              >
                Services
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-96 max-h-[70vh] overflow-y-auto p-2">
              {services.map((service) => (
                <Collapsible 
                  key={service.id}
                  open={expandedService === service.id}
                  onOpenChange={(open) => setExpandedService(open ? service.id : null)}
                >
                  <div className="rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/services/${service.id}`}
                        className="flex-1 flex items-start gap-3 p-3 rounded-lg cursor-pointer"
                      >
                        <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${service.color} text-white`}>
                          <service.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{service.shortTitle}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{service.description}</span>
                        </div>
                      </Link>
                      <CollapsibleTrigger asChild>
                        <button 
                          className="p-2 mr-2 rounded-md hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label={`Expand ${service.shortTitle} sub-services`}
                        >
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedService === service.id ? 'rotate-90' : ''}`} />
                        </button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="pl-14 pr-3 pb-3 space-y-1">
                        {service.subServices.slice(0, 4).map((subService, idx) => (
                          <Link
                            key={idx}
                            to={`/services/${service.id}`}
                            className="block px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <span className="text-foreground">{subService.name}</span>
                          </Link>
                        ))}
                        {service.subServices.length > 4 && (
                          <Link
                            to={`/services/${service.id}`}
                            className="block px-3 py-2 rounded-md text-sm text-primary hover:bg-accent transition-colors"
                          >
                            +{service.subServices.length - 4} more...
                          </Link>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                isActive(link.path) ? "bg-muted text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <a href="https://wa.me/919346884544" target="_blank" rel="noopener noreferrer">
              WhatsApp Us
            </a>
          </Button>
          <Button asChild className="gradient-bg border-0">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col gap-6 mt-8">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-muted ${
                        isActive(link.path) ? "bg-muted text-primary" : "text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
                
                <div className="py-2">
                  <span className="px-4 text-sm font-semibold text-muted-foreground">Services</span>
                  <div className="mt-2 flex flex-col gap-1">
                    {services.map((service) => (
                      <SheetClose asChild key={service.id}>
                        <Link
                          to={`/services/${service.id}`}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                        >
                          <service.icon className="h-4 w-4 text-primary" />
                          {service.shortTitle}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </nav>

              <div className="flex flex-col gap-3 px-4">
                <Button variant="outline" asChild className="w-full">
                  <a href="https://wa.me/919346884544" target="_blank" rel="noopener noreferrer">
                    WhatsApp Us
                  </a>
                </Button>
                <SheetClose asChild>
                  <Button asChild className="w-full gradient-bg border-0">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </SheetClose>
              </div>

              <div className="px-4 pt-4 border-t">
                <a href="tel:9346884544" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  +91 93468 84544
                </a>
                <span className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Andhra Pradesh & Telangana
                </span>
              </div>
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
