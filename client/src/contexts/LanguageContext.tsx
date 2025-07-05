import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ar" | "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    "app.title": "Wesh - تواصل بقصد",
    "app.subtitle": "تواصل بقصد",
    "auth.startNow": "ابدأ الآن",
    "auth.signIn": "تسجيل الدخول",
    "auth.welcomeBack": "أهلاً بعودتك",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.rememberMe": "تذكرني",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.continueWith": "أو تابع مع",
    "auth.google": "متابعة مع Google",
    "auth.apple": "متابعة مع Apple",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.signUp": "إنشاء حساب",
    "nav.discover": "استكشف",
    "nav.matches": "المطابقات",
    "nav.chat": "الدردشة",
    "nav.profile": "الملف الشخصي",
    "profile.editProfile": "تعديل الملف الشخصي",
    "profile.photos": "الصور",
    "profile.aboutMe": "نبذة عني",
    "premium.upgrade": "ترقية",
    "premium.title": "ترقية إلى Premium",
    "premium.description": "احصل على إعجابات غير محدودة واعرف من أعجب بك",
  },
  en: {
    "app.title": "Wesh - Connect with Intention",
    "app.subtitle": "Connect with Intention",
    "auth.startNow": "Start Now",
    "auth.signIn": "Sign In",
    "auth.welcomeBack": "Welcome Back",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.rememberMe": "Remember me",
    "auth.forgotPassword": "Forgot password?",
    "auth.continueWith": "Or continue with",
    "auth.google": "Continue with Google",
    "auth.apple": "Continue with Apple",
    "auth.noAccount": "Don't have an account?",
    "auth.signUp": "Sign up",
    "nav.discover": "Discover",
    "nav.matches": "Matches",
    "nav.chat": "Chat",
    "nav.profile": "Profile",
    "profile.editProfile": "Edit Profile",
    "profile.photos": "Photos",
    "profile.aboutMe": "About Me",
    "premium.upgrade": "Upgrade",
    "premium.title": "Upgrade to Premium",
    "premium.description": "Get unlimited likes and see who liked you",
  },
  fr: {
    "app.title": "Wesh - Connecte avec intention",
    "app.subtitle": "Connecte avec intention",
    "auth.startNow": "Commencer",
    "auth.signIn": "Se connecter",
    "auth.welcomeBack": "Bon retour",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.rememberMe": "Se souvenir de moi",
    "auth.forgotPassword": "Mot de passe oublié?",
    "auth.continueWith": "Ou continuer avec",
    "auth.google": "Continuer avec Google",
    "auth.apple": "Continuer avec Apple",
    "auth.noAccount": "Pas de compte?",
    "auth.signUp": "S'inscrire",
    "nav.discover": "Découvrir",
    "nav.matches": "Correspondances",
    "nav.chat": "Chat",
    "nav.profile": "Profil",
    "profile.editProfile": "Modifier le profil",
    "profile.photos": "Photos",
    "profile.aboutMe": "À propos de moi",
    "premium.upgrade": "Améliorer",
    "premium.title": "Passer à Premium",
    "premium.description": "Obtenez des likes illimités et voyez qui vous a aimé",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("wesh-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("wesh-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
