import React, { useState } from "react";
import { useLocation } from "wouter";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const mode = searchParams.get("mode") || "login";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.profileComplete) {
        navigate("/discover");
      } else {
        navigate("/profile-setup");
      }
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account created",
          description: "Welcome to Wesh! Please complete your profile.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Panel - Visual */}
        <div className="lg:w-1/2 bg-gradient-to-br from-primary-500 to-secondary-500 p-8 flex items-center justify-center">
          <div className="text-center text-white">
            <img 
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="People connecting through modern technology" 
              className="rounded-3xl shadow-2xl mb-8 mx-auto max-w-md" 
            />
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect Match</h2>
            <p className="text-xl text-white/90">جد شريك حياتك المثالي معنا</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-1/2 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-2">
                {mode === "register" ? "Create Account" : t("auth.welcomeBack")}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {mode === "register" ? "Join Wesh today" : "أهلاً بعودتك • Bon retour"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div>
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-2"
                  />
                </div>

                {mode === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{t("auth.rememberMe")}</span>
                    </label>
                    <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
                      {t("auth.forgotPassword")}
                    </button>
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Loading..." : mode === "register" ? t("auth.signUp") : t("auth.signIn")}
                </Button>
              </form>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">{t("auth.continueWith")}</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleAuth}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t("auth.google")}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {mode === "register" ? "Already have an account?" : t("auth.noAccount")}
                <button 
                  onClick={() => navigate(`/auth?mode=${mode === "register" ? "login" : "register"}`)}
                  className="text-primary-600 hover:text-primary-700 font-medium ml-1"
                >
                  {mode === "register" ? t("auth.signIn") : t("auth.signUp")}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
