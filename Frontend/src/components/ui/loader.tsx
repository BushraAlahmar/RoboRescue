import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = "Loading..." }: LoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-metallic-dark/90 backdrop-blur-md"
    >
      <div className="relative">
        <motion.div
          className="w-32 h-32 border-4 border-metallic-accent rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 w-32 h-32 border-4 border-t-transparent border-metallic-light rounded-full"
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-metallic-accent text-lg font-bold text-center">
            {message}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loader;
