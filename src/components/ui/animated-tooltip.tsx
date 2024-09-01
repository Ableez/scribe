"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export const AnimatedTooltip = ({
  item,
}: {
  item: {
    id: string;
    name: string;
    designation: string;
    image: string;
  };
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <>
      <div
        className="group relative -mr-4"
        key={item.name}
        onMouseEnter={() => setHoveredIndex(item.id)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence mode="popLayout">
          {hoveredIndex === item.id && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 30,
                scale: 0.9,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                translateX: translateX,
                rotate: rotate,
                whiteSpace: "nowrap",
              }}
              className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
            >
              <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <div className="relative z-30 text-sm font-bold text-white">
                {item.name}
              </div>
              <div className="text-xs text-neutral-400">{item.designation}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <Avatar onMouseMove={(e) => handleMouseMove(e)}>
          <AvatarImage src={item.name} />
          <AvatarFallback>
            <span className="uppercase">{item.name[0]! + item.name[1]}</span>
          </AvatarFallback>
        </Avatar>
      </div>
    </>
  );
};
