import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

// Only initialize Stripe if key is available
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const premiumFeatures = [
  {
    icon: "❤️",
    titleKey: "premium.unlimitedLikes",
    descriptionKey: "premium.unlimitedLikesDesc",
  },
  {
    icon: "👀",
    titleKey: "premium.seeWhoLikes",
    descriptionKey: "premium.seeWhoLikesDesc",
  },
  {
    icon: "⭐",
    titleKey: "premium.rewind",
    descriptionKey: "premium.rewindDesc",
  },
  {
    icon: "🚀",
    titleKey: "premium.boost",
    descriptionKey: "premium.boostDesc",
  },
  {
    icon: "🏆",
    titleKey: "premium.topPicks",
    descriptionKey: "premium.topPicksDesc",
  },
  {
    icon: "🎯",
    titleKey: "premium.readReceipts",
    descriptionKey: "premium.readReceiptsDesc",
  },
];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Premium!",
          description: "Your subscription is now active. Enjoy unlimited features!",
        });
        navigate("/profile");
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full bg-gradient-to-r from-primary-500 to-accent-500"
      >
        {isLoading ? "Processing..." : "Subscribe to Premium"}
      </Button>
    </form>
  );
}

export default function PremiumPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  // Redirect if already premium
  useEffect(() => {
    if (user?.isPremium) {
      navigate("/profile");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && !user.isPremium) {
      // Create subscription
      apiRequest("POST", "/api/get-or-create-subscription", { 
        plan: selectedPlan 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Setup Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [user, selectedPlan, toast]);

  const plans = {
    monthly: {
      price: "$9.99",
      period: "per month",
      savings: null,
    },
    yearly: {
      price: "$59.99",
      period: "per year",
      savings: "Save 50%",
    },
  };

  if (user?.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5-2L12 4.5 15.5 3 21 5l-2 11-7-3-7 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You're Premium!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enjoy all the premium features Wesh has to offer.
            </p>
            <Button onClick={() => navigate("/profile")}>
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/profile")}
              className="text-white hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Premium
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5-2L12 4.5 15.5 3 21 5l-2 11-7-3-7 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Upgrade to Wesh Premium</h1>
            <p className="text-xl text-white/90">
              Unlock unlimited connections and premium features
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Plan Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Choose Your Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedPlan === key
                    ? "ring-2 ring-primary-500 shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedPlan(key as "monthly" | "yearly")}
              >
                <CardContent className="p-6 text-center">
                  {plan.savings && (
                    <Badge className="mb-3 bg-green-100 text-green-800">
                      {plan.savings}
                    </Badge>
                  )}
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 capitalize">
                    {plan.period}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Premium Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.titleKey}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.descriptionKey}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {clientSecret && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Complete Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#3B82F6',
                    },
                  },
                }}
              >
                <CheckoutForm />
              </Elements>
            </CardContent>
          </Card>
        )}

        {!clientSecret && user && (
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Terms */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            By subscribing, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
          <p className="mt-2">
            Cancel anytime. No refunds for partial billing periods.
          </p>
        </div>
      </div>
    </div>
  );
}
