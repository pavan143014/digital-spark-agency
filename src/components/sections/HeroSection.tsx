import { Link } from "react-router-dom";
import { ArrowRight, Play, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize to -1 to 1 range
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Mouse follow transforms for different elements (different intensities)
  const blob1X = useTransform(smoothMouseX, [-1, 1], [-40, 40]);
  const blob1Y = useTransform(smoothMouseY, [-1, 1], [-40, 40]);
  const blob2X = useTransform(smoothMouseX, [-1, 1], [30, -30]);
  const blob2Y = useTransform(smoothMouseY, [-1, 1], [30, -30]);
  const blob3X = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const blob3Y = useTransform(smoothMouseY, [-1, 1], [-15, 15]);
  const blob4X = useTransform(smoothMouseX, [-1, 1], [15, -15]);
  const blob4Y = useTransform(smoothMouseY, [-1, 1], [20, -20]);
  const imageRotateX = useTransform(smoothMouseY, [-1, 1], [2, -2]);
  const imageRotateY = useTransform(smoothMouseX, [-1, 1], [-2, 2]);

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted pt-8 pb-16 lg:pt-12 lg:pb-24"
    >
      {/* Parallax Background Elements with Mouse Follow */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ scale, x: blob1X, y: blob1Y }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{ scale, x: blob2X, y: blob2Y }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ x: blob3X, y: blob3Y }}
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.7 }}
          style={{ x: blob4X, y: blob4Y }}
          className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-primary/5 rounded-full blur-2xl" 
        />
      </motion.div>

      {/* Floating particles with mouse follow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              x: useTransform(smoothMouseX, [-1, 1], [-(10 + i * 3), 10 + i * 3]),
              y: useTransform(smoothMouseY, [-1, 1], [-(8 + i * 2), 8 + i * 2]),
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="container relative z-10"
        style={{ y: textY, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <MapPin className="h-4 w-4" />
              Serving Andhra Pradesh & Telangana
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Grow Your Business with{" "}
              <span className="gradient-text">Digital Marketing</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              We help businesses increase their online visibility, generate quality leads, 
              and achieve measurable growth through data-driven digital marketing strategies.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild className="gradient-bg border-0 text-base">
                <Link to="/#services">
                  Our Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <a href="https://wa.me/919346884544" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 pt-4"
            >
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
            </motion.div>
          </div>

          {/* Hero Image with Parallax + 3D Tilt */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              y: imageY,
              rotateX: imageRotateX,
              rotateY: imageRotateY,
              transformPerspective: 1000,
            }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <motion.img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                alt="Digital Marketing Dashboard"
                className="w-full h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Card - Bottom Left */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{
                x: useTransform(smoothMouseX, [-1, 1], [-8, 8]),
                y: useTransform(smoothMouseY, [-1, 1], [-5, 5]),
              }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border"
            >
              <p className="text-sm font-medium">Average ROI</p>
              <p className="text-2xl font-bold gradient-text">+340%</p>
            </motion.div>

            {/* Floating Card - Top Right */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05, y: 5 }}
              style={{
                x: useTransform(smoothMouseX, [-1, 1], [10, -10]),
                y: useTransform(smoothMouseY, [-1, 1], [8, -8]),
              }}
              className="absolute -top-4 -right-4 bg-card p-3 rounded-xl shadow-xl border"
            >
              <p className="text-xs font-medium text-muted-foreground">Traffic Growth</p>
              <p className="text-xl font-bold text-green-500">↑ 287%</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
