"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const feat2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  const feat2Y = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [50, 0, 0, -50]);
  const feat2Scale = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0.9, 1, 1, 0.9]);
  const feat2Filter = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);

  const ctaOpacity = useTransform(scrollYProgress, [0.9, 0.95, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.9, 0.95, 1], [50, 0, 0]);
  const ctaScale = useTransform(scrollYProgress, [0.9, 0.95, 1], [0.9, 1, 1]);


  return (
    <main ref={containerRef} className="relative h-[1200vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <ScrollytellingCanvas scrollProgress={scrollYProgress} />
        
        <div className="absolute inset-0 pointer-events-none">
          {/* Feature 2: Only show when the car is fully exploded, placed at the bottom */}
          <motion.div 
            style={{ 
              opacity: feat2Opacity, 
              y: feat2Y, 
              scale: feat2Scale,
              filter: feat2Filter 
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center p-8 w-full max-w-2xl text-white backdrop-blur-md bg-black/20 rounded-3xl border border-white/10 shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
              Direct Drive Powertrain
            </h2>
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
              A revolutionary hybrid system laid bare. Uncompromising power, uncompromising performance.
            </p>
          </motion.div>

          {/* CTA: Show at the very end when reassembled */}
          <motion.div 
            style={{ 
              opacity: ctaOpacity, 
              y: ctaY,
              scale: ctaScale
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/60 backdrop-blur-sm"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
              Experience Perfection
            </h2>
            <button className="pointer-events-auto px-10 py-4 bg-white text-black font-semibold tracking-widest uppercase text-sm rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Discover More
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
