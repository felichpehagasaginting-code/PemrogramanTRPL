"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hover = true,
  glass = false,
  onClick,
}: CardProps) {
  const classes = `card ${glass ? "glass" : ""} ${className}`;

  if (!hover) {
    return (
      <div className={classes} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={classes}
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(108, 99, 255, 0.24)" }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
