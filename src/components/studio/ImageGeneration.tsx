"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export interface ImageGenerationProps {
  children: React.ReactNode;
  isActive: boolean;
  generationKey: number;
}

export const ImageGeneration = ({ children, isActive, generationKey }: ImageGenerationProps) => {
  const [progress, setProgress] = React.useState(0);
  const [loadingState, setLoadingState] = React.useState<
    "starting" | "generating" | "completed"
  >("starting");
  const duration = 30000;

  React.useEffect(() => {
    if (!isActive) return;
    const resetStateTimeout = setTimeout(() => {
      setProgress(0);
      setLoadingState("starting");
    }, 0);
    let animationFrameId: ReturnType<typeof requestAnimationFrame> | undefined;
    let generationInterval: ReturnType<typeof setInterval> | undefined;

    const startingTimeout = setTimeout(() => {
      setLoadingState("generating");
      const startTime = Date.now();

      generationInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progressPercentage = Math.min(95, (elapsedTime / duration) * 100);
        setProgress(progressPercentage);
      }, 16);
    }, 1200);

    return () => {
      if (resetStateTimeout) clearTimeout(resetStateTimeout);
      clearTimeout(startingTimeout);
      if (generationInterval) clearInterval(generationInterval);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [duration, generationKey, isActive]);

  React.useEffect(() => {
    if (isActive) return;
    if (progress === 0 && loadingState === "starting") return;

    const completeStateTimeout = setTimeout(() => {
      setProgress(100);
      setLoadingState("completed");
    }, 0);

    const doneTimeout = setTimeout(() => {
      setProgress(0);
      setLoadingState("starting");
    }, 900);

    return () => {
      clearTimeout(completeStateTimeout);
      clearTimeout(doneTimeout);
    };
  }, [isActive, loadingState, progress]);

  return (
    <div className="flex flex-col gap-2">
      <motion.span
        className={cn(
          "bg-[linear-gradient(110deg,var(--muted),35%,var(--text-strong),50%,var(--muted),75%,var(--muted))] bg-[length:200%_100%]",
          "bg-clip-text text-base font-medium text-transparent",
        )}
        initial={{ backgroundPosition: "200% 0" }}
        animate={{
          backgroundPosition: loadingState === "completed" ? "0% 0" : "-200% 0",
          opacity: isActive || loadingState === "completed" ? 1 : 0.72,
        }}
        transition={{
          repeat: loadingState === "completed" ? 0 : Infinity,
          duration: 3,
          ease: "linear",
        }}
      >
        {loadingState === "starting" && "Getting started."}
        {loadingState === "generating" && "Creating image. May take a moment."}
        {loadingState === "completed" && "Image created."}
      </motion.span>

      <div className="relative max-w-md overflow-hidden rounded-xl border bg-card">
        {children}
        {(isActive || loadingState === "completed") && (
          <motion.div
            className="pointer-events-none absolute -top-[25%] h-[125%] w-full backdrop-blur-3xl"
            initial={false}
            animate={{
              clipPath: `polygon(0 ${progress}%, 100% ${progress}%, 100% 100%, 0 100%)`,
              opacity: loadingState === "completed" ? 0 : 1,
            }}
            style={{
              clipPath: `polygon(0 ${progress}%, 100% ${progress}%, 100% 100%, 0 100%)`,
              maskImage:
                progress === 0
                  ? "linear-gradient(to bottom, black -5%, black 100%)"
                  : `linear-gradient(to bottom, transparent ${progress - 5}%, transparent ${progress}%, black ${progress + 5}%)`,
              WebkitMaskImage:
                progress === 0
                  ? "linear-gradient(to bottom, black -5%, black 100%)"
                  : `linear-gradient(to bottom, transparent ${progress - 5}%, transparent ${progress}%, black ${progress + 5}%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

ImageGeneration.displayName = "ImageGeneration";
