import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Spinner } from "../ui/spinner";

const Loading: React.FC = () => {
  const text = "....";
  const letters = Array.from(text);

  const wave: Variants = {
    initial: { y: 0 },
    animate: (i: number) => ({
      y: [0, -5, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <div className="flex gap-3 items-center text-xl font-bold justify-center h-screen">
      <Spinner className="my-1 size-6 text-[#4D43EF]" />

      <div className="flex text-[#4D43EF]">
        Authenticating{" "}
        <>
          {letters.map((char, i) => (
            <motion.span
              key={i}
              variants={wave}
              custom={i} // pass index to motion variant
              initial="initial"
              animate="animate"
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </>
      </div>
    </div>
  );
};

export default Loading;
