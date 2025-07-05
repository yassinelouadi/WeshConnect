import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SwipeCard } from "@/components/ui/swipe-card";
import { MobileNavigation } from "@/components/ui/mobile-navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function DiscoverPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  const { data: potentialMatches, isLoading } = useQuery({
    queryKey: ["/api/discover"],
    enabled: !!user,
  });

  const likeMutation = useMutation({
    mutationFn: async ({ userId, isLike, isSuperLike = false }: { userId: number; isLike: boolean; isSuperLike?: boolean }) => {
      const response = await apiRequest("POST", "/api/like", {
        toUserId: userId,
        isLike,
        isSuperLike,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
      
      if (data.isMatch) {
        setMatchedUser(data.matchedUser);
        setShowMatchModal(true);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSwipe = (direction: "left" | "right", userId: number) => {
    likeMutation.mutate({
      userId,
      isLike: direction === "right",
    });
  };

  const handleLike = (userId: number) => {
    likeMutation.mutate({
      userId,
      isLike: true,
    });
  };

  const handlePass = (userId: number) => {
    likeMutation.mutate({
      userId,
      isLike: false,
    });
  };

  const handleSuperLike = (userId: number) => {
    likeMutation.mutate({
      userId,
      isLike: true,
      isSuperLike: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wesh</h1>
            {user?.isPremium && (
              <div className="ml-4 flex items-center bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-1 rounded-full text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 5l5.5-2L12 4.5 15.5 3 21 5l-2 11-7-3-7 3z" />
                </svg>
                Premium
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Cards */}
      <div className="relative max-w-sm mx-auto px-4 pt-8">
        <div className="relative h-[600px]">
          {potentialMatches && potentialMatches.length > 0 ? (
            potentialMatches.map((potentialMatch: User, index: number) => (
              <SwipeCard
                key={potentialMatch.id}
                user={potentialMatch}
                onSwipe={handleSwipe}
                className={index > 0 ? "scale-95 -z-10" : ""}
              />
            ))
          ) : (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center p-8">
              <svg className="w-24 h-24 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No more profiles
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You've seen all available profiles in your area. Check back later for new people!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {potentialMatches && potentialMatches.length > 0 && (
          <div className="flex items-center justify-center space-x-8 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2"
              onClick={() => handlePass(potentialMatches[0].id)}
            >
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-blue-500 text-blue-500"
              onClick={() => handleSuperLike(potentialMatches[0].id)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </Button>
            
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              onClick={() => handleLike(potentialMatches[0].id)}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Match Notification Modal */}
      {showMatchModal && matchedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in">
            <div className="mb-6">
              <svg className="w-16 h-16 text-primary-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                It's a Match!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You and {matchedUser.displayName} liked each other
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowMatchModal(false)}
              >
                Keep Playing
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500"
                onClick={() => {
                  setShowMatchModal(false);
                  // Navigate to chat would go here
                }}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      <MobileNavigation />
    </div>
  );
}
