import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedHeartProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export function AnimatedHeart({ className, size = "lg" }: AnimatedHeartProps) {
  return (
    <div className={cn("relative animate-float", sizeClasses[size], className)}>
      <div className="relative w-full h-full">
        {/* 3D Heart Effect */}
        <div className="absolute inset-0 bg-white rounded-full shadow-2xl transform rotate-45"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white rounded-full shadow-xl"></div>
        <div className="absolute top-0 right-1/4 w-1/2 h-1/2 bg-white rounded-full shadow-xl"></div>
        
        {/* Heart Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-1/2 h-1/2 text-primary-500 transform -rotate-45"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
