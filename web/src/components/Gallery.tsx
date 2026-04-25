"use client";

import { motion } from "framer-motion";

const images = [
  { src: "/gallery/gallery_front.png", alt: "Hypercar Front Angle", style: "col-span-12 md:col-span-8 aspect-[16/9]" },
  { src: "/gallery/gallery_rear.png", alt: "Hypercar Rear Angle", style: "col-span-12 md:col-span-4 aspect-[4/5] md:aspect-auto" },
  { src: "/gallery/gallery_interior.png", alt: "Hypercar Interior", style: "col-span-12 aspect-[21/9]" },
];

export default function Gallery() {
  return (
    <section className="w-full bg-black py-32 px-4 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            A Masterpiece<br />From Every Angle
          </h2>
          <p className="text-lg text-white/60 font-light max-w-xl">
            Surgical precision meets breathtaking aesthetics. Every line, every curve is engineered for absolute performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 md:gap-8 auto-rows-auto">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group ${img.style}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
