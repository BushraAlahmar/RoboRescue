"use client";
import React from "react";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function Landing() {
  const t = useTranslations("landing");
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };
  return (
    <div className="relative z-10  mx-auto px-4 md:px-6 w-full h-[100dvh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-metallic-dark border border-metallic-light/20 mb-8 md:mb-12"
        >
          <Circle className="h-2 w-2 fill-metallic-accent" />
          <span className="text-sm text-metallic-light tracking-wide">
            {t("badge")}
          </span>
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-metallic-light to-metallic-light/80">
              {t("title1")}
            </span>
            <br />
            <span
              className={cn(
                "bg-clip-text text-transparent bg-gradient-to-r from-metallic-accent via-metallic-light/90 to-metallic-accent"
              )}
            >
              {t("title2")}
            </span>
          </h1>
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-base sm:text-lg md:text-xl text-metallic-light/60 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
            {t("description")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;
