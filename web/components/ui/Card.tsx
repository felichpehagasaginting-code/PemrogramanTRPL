"use client";

import { memo, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const Card = memo(function Card({
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
    <div className={`${classes} hover-lift`} onClick={onClick}>
      {children}
    </div>
  );
});
