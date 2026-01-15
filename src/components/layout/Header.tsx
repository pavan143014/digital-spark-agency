import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg text-white font-bold text-xl">
            PS
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            PS <span className="gradient-text">Digital</span>
          </span>
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
              <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted text-muted-foreground">
                Services
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <DropdownMenuItem key={service.id} asChild>
                  <Link
                    to={`/services/${service.id}`}
                    className="flex items-center gap-3 py-2"
                  >
                    <service.icon className="h-4 w-4 text-primary" />
                    {service.shortTitle}
                  </Link>
                </DropdownMenuItem>
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
          <Button variant="outline" asChild>
            <a href="https://wa.me/919346884544" target="_blank" rel="noopener noreferrer">
              WhatsApp Us
            </a>
          </Button>
          <Button asChild className="gradient-bg border-0">
            <Link to="/booking">Book Consultation</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
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
                    <Link to="/booking">Book Consultation</Link>
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
    </header>
  );
};

export default Header;
