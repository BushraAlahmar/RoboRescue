"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HoverButton } from "@/components/ui/hover-button";

interface RobotToastProps {
  isVisible: boolean;
  message: string;
  showStartButton?: boolean;
  showCloseButton?: boolean;
  onStart?: () => void;
  onHide?: () => void;
}

export function RobotToast({
  isVisible,
  message,
  showStartButton = false,
  // showCloseButton = true,
  onStart,
}: // onHide,
RobotToastProps) {
  if (!message) return null;

  // Function to format message for better display
  const formatMessage = (msg: string) => {
    // Split by newlines to handle arrays of errors
    const lines = msg.split("\n").filter((line) => line.trim());

    // If it's a single line or doesn't contain error indicators, return as is
    if (lines.length <= 1 || !msg.includes("❌")) {
      return (
        <p className="text-metallic-light text-sm font-medium leading-relaxed">
          {message}
        </p>
      );
    }

    // For multi-line error messages, format as a list
    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          // Check if this line is an error indicator
          const isErrorLine =
            line.includes("❌") ||
            line.includes("error") ||
            line.includes("Error");
          const isNumberedLine = /^\d+\./.test(line.trim());

          return (
            <div key={index} className="flex items-start gap-2">
              {isNumberedLine && (
                <span className="text-metallic-accent text-xs font-mono flex-shrink-0 mt-0.5">
                  {line.match(/^\d+\./)?.[0]}
                </span>
              )}
              <p
                className={`text-sm font-medium leading-relaxed ${
                  isErrorLine
                    ? "text-red-300"
                    : isNumberedLine
                    ? "text-metallic-light"
                    : "text-metallic-light/80"
                }`}
              >
                {isNumberedLine ? line.replace(/^\d+\.\s*/, "") : line}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 right-4 transform  z-[80] max-w-md"
        >
          <div className="bg-metallic-dark/95 backdrop-blur-sm border border-metallic-accent/30 rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex-shrink-0 w-14 h-14"
              >
                <Image
                  src="/assets/images/robot-head.png"
                  alt="Robot icon"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                {formatMessage(message)}

                {showStartButton && onStart && (
                  <div className="mt-3">
                    <HoverButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onStart();
                      }}
                      className="text-xs px-3 py-1 h-auto"
                    >
                      Start Coding
                    </HoverButton>
                  </div>
                )}
              </div>

              {/* {showCloseButton && onHide && (
                <button
                  onClick={onHide}
                  className="flex-shrink-0 text-metallic-light/60 hover:text-metallic-light transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )} */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
