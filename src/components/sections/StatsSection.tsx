import { useEffect, useState, useRef } from "react";
import { stats, clientLogos } from "@/data/testimonials";

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold gradient-text">
      {count}{suffix}
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white">
      <div className="container">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-white/80 mt-2 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="border-t border-white/20 pt-12">
          <p className="text-center text-white/60 mb-8 text-sm uppercase tracking-wider">
            Trusted by Leading Brands
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {clientLogos.map((logo, index) => (
              <div
                key={index}
                className="text-white/40 hover:text-white/80 transition-colors font-semibold text-lg"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
