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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 0, -50]);

  const feat1Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  const feat1Y = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [50, 0, 0, -50]);

  const feat2Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
  const feat2Y = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [50, 0, 0, -50]);

  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.95, 1], [50, 0, 0]);

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <ScrollytellingCanvas scrollProgress={scrollYProgress} />
        
        <div className="absolute inset-0 pointer-events-none">
          {/* Section 1: Hero */}
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white/90 mb-4">
              Koenigsegg Regera
            </h1>
            <p className="text-lg md:text-2xl text-white/60 tracking-wider font-light max-w-xl">
              Engineering beyond imagination. The pinnacle of hybrid hypercars.
            </p>
          </motion.div>

          {/* Section 2: Feature 1 */}
          <motion.div 
            style={{ opacity: feat1Opacity, y: feat1Y }}
            className="absolute inset-0 flex flex-col items-start justify-center p-12 md:p-24"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-4">
              Intricate Disassembly
            </h2>
            <p className="text-xl md:text-2xl text-white/60 font-light max-w-md leading-relaxed">
              Every detail meticulously crafted. Witness the seamless separation of the aerodynamic exoskeleton.
            </p>
          </motion.div>

          {/* Section 3: Feature 2 */}
          <motion.div 
            style={{ opacity: feat2Opacity, y: feat2Y }}
            className="absolute inset-0 flex flex-col items-end justify-center text-right p-12 md:p-24"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-4">
              Direct Drive Powertrain
            </h2>
            <p className="text-xl md:text-2xl text-white/60 font-light max-w-md leading-relaxed">
              A revolutionary hybrid system laid bare. Uncompromising power, uncompromising performance.
            </p>
          </motion.div>

          {/* Section 4: CTA */}
          <motion.div 
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white/90 mb-8">
              Experience Perfection
            </h2>
            <button className="pointer-events-auto px-8 py-4 bg-white text-black font-semibold tracking-widest uppercase text-sm rounded-full hover:bg-white/90 transition-colors">
              Discover More
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
