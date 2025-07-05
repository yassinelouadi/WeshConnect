import React from "react";
import { Link } from "wouter";
import { AnimatedHeart } from "@/components/ui/animated-heart";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-32 right-16 w-6 h-6 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/15 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-16 right-12 w-5 h-5 bg-white/20 rounded-full animate-float"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        
        {/* Animated Heart Logo */}
        <div className="mb-8">
          <AnimatedHeart size="xl" />
        </div>

        {/* Brand Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Wesh
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-2">
            {t("app.subtitle")}
          </p>
          <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
            تواصل بقصد • Connecte avec intention • Connect with purpose
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <Link href="/auth?mode=register">
            <button className="w-full bg-white text-primary-600 font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg">
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {t("auth.startNow")}
            </button>
          </Link>
          
          <Link href="/auth?mode=login">
            <button className="w-full bg-white/20 backdrop-blur-sm text-white font-medium py-4 px-8 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200 text-lg">
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v12z" />
              </svg>
              {t("auth.signIn")}
            </button>
          </Link>
        </div>

        {/* Language Selector */}
        <div className="mt-8">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
