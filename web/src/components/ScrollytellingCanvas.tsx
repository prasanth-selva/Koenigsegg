"use client";

import { useTransform, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface ScrollytellingCanvasProps {
  scrollProgress: MotionValue<number>;
}

export default function ScrollytellingCanvas({ scrollProgress }: ScrollytellingCanvasProps) {
  const TOTAL_FRAMES = 300;
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const frameIndex = useTransform(scrollProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      const promises = Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          const frameNum = (i + 1).toString().padStart(3, '0');
          img.src = `/heroo/ezgif-frame-${frameNum}.png`;
          
          img.onload = () => {
            loadedImages[i] = img;
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            resolve();
          };
          
          img.onerror = () => {
            console.error(`Failed to load frame ${frameNum}`);
            resolve();
          };
        });
      });

      await Promise.all(promises);
      imagesRef.current = loadedImages;
      setImagesLoaded(true);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const canvas = canvasRef.current;
    if (canvas && imagesRef.current.length > 0) {
      const context = canvas.getContext("2d");
      const img = imagesRef.current[0];
      if (context && img) drawImage(context, img, canvas);
    }

    const unsubscribe = frameIndex.on("change", (latestIndex) => {
      const currentFrame = Math.round(latestIndex);
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const img = imagesRef.current[currentFrame];
      
      if (context && img && canvas) {
        requestAnimationFrame(() => drawImage(context, img, canvas));
      }
    });

    return () => unsubscribe();
  }, [imagesLoaded, frameIndex]);

  const drawImage = (context: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight;
    
    if (canvasRatio > imgRatio) {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
    } else {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
    }
    
    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, drawWidth, drawHeight);
  };
  
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (imagesLoaded) {
          const currentFrame = Math.round(frameIndex.get());
          const context = canvas.getContext("2d");
          const img = imagesRef.current[currentFrame];
          if (context && img) {
            requestAnimationFrame(() => drawImage(context, img, canvas));
          }
        }
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, frameIndex]);

  if (!imagesLoaded) {
    return (
      <div className="sticky top-0 w-full h-screen z-50 flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-white/50 mb-4" />
        <p className="text-white/50 tracking-widest uppercase text-xs">Loading Sequence... {loadingProgress}%</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
