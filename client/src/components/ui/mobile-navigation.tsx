import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { path: "/discover", icon: "heart", labelKey: "nav.discover" },
  { path: "/matches", icon: "users", labelKey: "nav.matches" },
  { path: "/chat", icon: "message-circle", labelKey: "nav.chat" },
  { path: "/profile", icon: "user", labelKey: "nav.profile" },
];

export function MobileNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50 lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center py-2 px-3 transition-colors",
                  isActive
                    ? "text-primary-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  {item.icon === "heart" && (
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  )}
                  {item.icon === "users" && (
                    <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8z" />
                  )}
                  {item.icon === "message-circle" && (
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  )}
                  {item.icon === "user" && (
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  )}
                </svg>
                <span className="text-xs">{t(item.labelKey)}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
