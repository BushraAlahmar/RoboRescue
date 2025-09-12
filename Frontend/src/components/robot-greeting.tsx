"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
// import { GiRobotGrab } from "react-icons/gi";
import Image from "next/image";

export function RobotGreeting() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-metallic-dark/90 backdrop-blur-sm p-4 rounded-lg border border-metallic-accent/30 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center w-8 h-8"
            >
              <Image
                src="/assets/images/robot.png"
                alt="Robot icon"
                width={32}
                height={32}
              />
            </motion.div>
            <div>
              <p className="text-metallic-light font-medium">
                Greetings! I&apos;m your robot assistant.
              </p>
              {/* <p className="text-metallic-light/60 text-sm">
                                Welcome to the game
                            </p> */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
