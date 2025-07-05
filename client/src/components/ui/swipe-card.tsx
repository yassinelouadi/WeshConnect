import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { User } from "@shared/schema";

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: "left" | "right", userId: number) => void;
  className?: string;
}

export function SwipeCard({ user, onSwipe, className }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      onSwipe(direction, user.id);
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = isDragging ? dragOffset.x * 0.1 : 0;
  const opacity = isDragging ? Math.max(0.8, 1 - Math.abs(dragOffset.x) / 300) : 1;

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] cursor-grab",
        isDragging && "cursor-grabbing",
        className
      )}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Profile Image */}
      {user.photos && user.photos.length > 0 ? (
        <img
          src={user.photos[0]}
          alt={`${user.displayName}'s profile`}
          className="w-full h-3/4 object-cover"
        />
      ) : (
        <div className="w-full h-3/4 bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}

      {/* Profile Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
        <h3 className="text-2xl font-bold mb-1">
          {user.displayName}, {user.age}
        </h3>
        {user.location && (
          <p className="text-white/90 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {user.location}
          </p>
        )}
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Additional Info Button */}
      <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      </button>

      {/* Swipe Indicators */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {dragOffset.x > 50 && (
            <div className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-xl transform rotate-12">
              LIKE
            </div>
          )}
          {dragOffset.x < -50 && (
            <div className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-xl transform -rotate-12">
              PASS
            </div>
          )}
        </div>
      )}
    </div>
  );
}
