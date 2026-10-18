"use client";

import { useTransform, MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface ScrollytellingCanvasProps {
  scrollProgress: MotionValue<number>;
}

const TOTAL_FRAMES = 300;
const FRAME_SOURCES = Array.from({ length: TOTAL_FRAMES }, (_, index) =>
  `/heroo/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.webp`,
);
const SUPPORTING_IMAGE_SOURCES = [
  "/colors/car_red.webp",
  "/colors/car_blue.webp",
  "/colors/car_silver.webp",
  "/gallery/gallery_front.webp",
  "/gallery/gallery_rear.webp",
  "/gallery/gallery_interior.webp",
];
const ALL_IMAGE_SOURCES = [...FRAME_SOURCES, ...SUPPORTING_IMAGE_SOURCES];
const MAX_CONCURRENT_LOADS = 8;

function loadAndDecodeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    let loadHandled = false;
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else resolve(image);
    };

    const decode = () => {
      if (loadHandled) return;
      loadHandled = true;
      if (typeof image.decode === "function") {
        image.decode().then(() => finish()).catch(() => finish(new Error(`Could not decode ${src}`)));
      } else if (image.naturalWidth > 0) {
        finish();
      } else {
        finish(new Error(`Could not load ${src}`));
      }
    };

    image.decoding = "async";
    image.onload = decode;
    image.onerror = () => finish(new Error(`Could not load ${src}`));
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) decode();
      else finish(new Error(`Could not load ${src}`));
    }
  });
}

export default function ScrollytellingCanvas({ scrollProgress }: ScrollytellingCanvasProps) {
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">("loading");
  const [loadedAssetCount, setLoadedAssetCount] = useState(0);
  const [failedAssets, setFailedAssets] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const supportingImagesRef = useRef(new Map<string, HTMLImageElement>());
  const loadedSourcesRef = useRef(new Set<string>());

  const frameIndex = useTransform(scrollProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  const drawImage = useCallback((context: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth: number;
    let drawHeight: number;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
    } else {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
    }

    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pendingSources = ALL_IMAGE_SOURCES.filter((src) => !loadedSourcesRef.current.has(src));
    const errors: string[] = [];
    let nextSourceIndex = 0;

    setLoadStatus("loading");
    setFailedAssets([]);

    const worker = async () => {
      while (!cancelled) {
        const src = pendingSources[nextSourceIndex];
        nextSourceIndex += 1;
        if (!src) return;

        try {
          const image = await loadAndDecodeImage(src);
          if (cancelled) return;

          loadedSourcesRef.current.add(src);
          const frameMatch = src.match(/ezgif-frame-(\d{3})\.webp$/);
          if (frameMatch) {
            imagesRef.current[Number(frameMatch[1]) - 1] = image;
          } else {
            supportingImagesRef.current.set(src, image);
          }
          setLoadedAssetCount(loadedSourcesRef.current.size);
        } catch {
          if (!cancelled) errors.push(src);
        }
      }
    };

    const preloadAllAssets = async () => {
      await Promise.all(
        Array.from(
          { length: Math.min(MAX_CONCURRENT_LOADS, pendingSources.length) },
          () => worker(),
        ),
      );
      if (cancelled) return;

      if (errors.length > 0) {
        setFailedAssets(errors);
        setLoadStatus("error");
        return;
      }

      try {
        await document.fonts.ready;
      } catch {
        // Font readiness is best-effort; all image assets are still verified above.
      }
      if (cancelled) return;

      setLoadedAssetCount(ALL_IMAGE_SOURCES.length);
      window.scrollTo(0, 0);
      document.documentElement.classList.remove("sequence-loading");
      document.body.classList.remove("sequence-loading");
      setLoadStatus("ready");
    };

    void preloadAllAssets();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  useEffect(() => {
    if (loadStatus === "ready") return;

    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
      const target = event.target;
      const isButton = target instanceof HTMLElement && target.closest("button, a, input, textarea, select, [contenteditable='true']");
      if (scrollKeys.includes(event.key) || (event.key === " " && !isButton)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys, true);

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys, true);
    };
  }, [loadStatus]);

  useEffect(() => {
    if (loadStatus !== "ready") return;

    const canvas = canvasRef.current;
    const image = imagesRef.current[0];
    const context = canvas?.getContext("2d");
    if (canvas && context && image) drawImage(context, image, canvas);

    const unsubscribe = frameIndex.on("change", (latestIndex) => {
      const currentFrame = Math.round(latestIndex);
      const currentCanvas = canvasRef.current;
      const currentContext = currentCanvas?.getContext("2d");
      const currentImage = imagesRef.current[currentFrame];
      if (currentCanvas && currentContext && currentImage) {
        requestAnimationFrame(() => drawImage(currentContext, currentImage, currentCanvas));
      }
    });

    return () => unsubscribe();
  }, [drawImage, frameIndex, loadStatus]);

  useEffect(() => {
    if (loadStatus !== "ready") return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const currentFrame = Math.round(frameIndex.get());
      const context = canvas.getContext("2d");
      const image = imagesRef.current[currentFrame];
      if (context && image) requestAnimationFrame(() => drawImage(context, image, canvas));
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [drawImage, frameIndex, loadStatus]);

  if (loadStatus !== "ready") {
    const progress = Math.floor((loadedAssetCount / ALL_IMAGE_SOURCES.length) * 100);

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 text-center">
        {loadStatus === "loading" ? (
          <>
            <Loader2 aria-hidden="true" className="mb-5 h-10 w-10 animate-spin text-white/60" />
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/60" role="status" aria-live="polite">
              Preparing your experience
            </p>
            <p className="mb-5 text-sm text-white/45">
              Loading frames and page images — {loadedAssetCount} of {ALL_IMAGE_SOURCES.length}
            </p>
            <div
              className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-label="Loading images"
              aria-valuemin={0}
              aria-valuemax={ALL_IMAGE_SOURCES.length}
              aria-valuenow={loadedAssetCount}
              aria-valuetext={`${progress}% loaded`}
            >
              <div className="h-full rounded-full bg-white transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs tabular-nums text-white/50">{progress}%</p>
          </>
        ) : (
          <div role="alert" aria-live="assertive" className="max-w-md">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Some images did not finish loading
            </p>
            <p className="mb-6 text-sm leading-6 text-white/60">
              {failedAssets.length} image{failedAssets.length === 1 ? "" : "s"} failed. The page stays locked until all frames and page images are ready.
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Retry failed images
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
    </div>
  );
}
