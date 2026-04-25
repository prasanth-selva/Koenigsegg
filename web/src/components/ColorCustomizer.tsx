"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  { id: "red", name: "Cherry Red", hex: "#7E0D1B", bg: "#1f0307", image: "/colors/car_red.png" },
  { id: "blue", name: "Sapphire Blue", hex: "#001D4A", bg: "#020b1c", image: "/colors/car_blue.png" },
  { id: "silver", name: "Liquid Silver", hex: "#C0C0C0", bg: "#1a1a1a", image: "/colors/car_silver.png" },
];

export default function ColorCustomizer() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <motion.section 
      animate={{ backgroundColor: selectedColor.bg }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative w-full min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5"
    >
      <div className="z-10 text-center mb-16 px-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
          Make It Yours
        </h2>
        <p className="text-lg text-white/60 font-light">Select a color to see your creation come to life.</p>
      </div>

      <div className="relative w-full max-w-6xl aspect-[16/9] flex items-center justify-center mb-16 px-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedColor.id}
            src={selectedColor.image}
            alt={`${selectedColor.name} car`}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </AnimatePresence>
      </div>

      <div className="z-10 flex gap-6 mt-8">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => setSelectedColor(color)}
            className={`group relative flex flex-col items-center gap-3 transition-all`}
          >
            <div 
              className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                selectedColor.id === color.id ? "border-white scale-110" : "border-transparent scale-100 opacity-60 hover:opacity-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {selectedColor.id === color.id && (
                <motion.div
                  layoutId="ring"
                  className="absolute inset-[-6px] rounded-full border border-white/40"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </div>
            <span className={`text-xs uppercase tracking-widest font-semibold transition-colors ${
              selectedColor.id === color.id ? "text-white" : "text-white/40"
            }`}>
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </motion.section>
  );
}
