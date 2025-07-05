import React from "react";
import { useLocation } from "wouter";
import { MobileNavigation } from "@/components/ui/mobile-navigation";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
      
      {/* Settings Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
            className="mr-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Email</span>
              <span className="text-gray-500 dark:text-gray-400">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Member since</span>
              <span className="text-gray-500 dark:text-gray-400">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Language Setting */}
            <div className="flex items-center justify-between">
              <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">
                Language
              </Label>
              <LanguageSelector variant="dropdown" />
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="text-gray-700 dark:text-gray-300">
                Dark Mode
              </Label>
              <Switch
                id="darkMode"
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-gray-700 dark:text-gray-300">
                Push Notifications
              </Label>
              <Switch
                id="notifications"
                defaultChecked={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discovery Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Discovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-700 dark:text-gray-300">Maximum Distance</Label>
                <span className="text-primary-600 font-medium">50 km</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-700 dark:text-gray-300">Age Range</Label>
                <span className="text-primary-600 font-medium">18 - 35</span>
              </div>
              <div className="flex space-x-3">
                <input
                  type="range"
                  min="18"
                  max="50"
                  defaultValue="18"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <input
                  type="range"
                  min="18"
                  max="50"
                  defaultValue="35"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showMe" className="text-gray-700 dark:text-gray-300">
                Show me on Wesh
              </Label>
              <Switch
                id="showMe"
                defaultChecked={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Safety */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Safety</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Privacy Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Blocked Users
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5 1.41-1.41L9 14.17 18.59 4.59 20 6z" />
              </svg>
              Safety Center
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              Help & Support
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 2h2v2h-2V4zm1 16c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S10.83 20 10 20z" />
              </svg>
              Contact Us
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7v2H4V4h3.5l1-1h7l1 1H20z" />
              </svg>
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>

      </div>

      <MobileNavigation />
    </div>
  );
}
