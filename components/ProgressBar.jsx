import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  return (
    <div
      className="w-full bg-gray-700 rounded h-4 overflow-hidden"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded"
        style={{
          background: "linear-gradient(90deg, #22d3ee, #2dd4bf)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
