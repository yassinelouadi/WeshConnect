import { User, Match, Like, Conversation, Message } from "@shared/schema";

export type { User, Match, Like, Conversation, Message };

export interface UserProfile extends User {
  distance?: number;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface ConversationWithUser extends Conversation {
  otherUser: UserProfile;
  unreadCount: number;
  lastMessage?: Message;
}

export interface MatchWithUsers extends Match {
  user1: UserProfile;
  user2: UserProfile;
}

export interface NotificationData {
  id: string;
  type: "match" | "message" | "like" | "super_like";
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface SwipeAction {
  userId: number;
  action: "like" | "pass" | "super_like";
  timestamp: Date;
}

export interface DiscoveryFilters {
  maxDistance: number;
  minAge: number;
  maxAge: number;
  interests?: string[];
  location?: string;
}

export interface PremiumFeature {
  key: string;
  name: string;
  description: string;
  available: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
}

export interface ChatMessage extends Message {
  sending?: boolean;
  failed?: boolean;
}

export interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export interface UserStats {
  totalMatches: number;
  totalLikes: number;
  totalSuperLikes: number;
  profileViews: number;
  messagesExchanged: number;
}

export interface AppNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm extends LoginForm {
  confirmPassword: string;
}

export interface ProfileForm {
  displayName: string;
  age: number;
  bio: string;
  location: string;
  occupation: string;
  education: string;
  interests: string[];
  photos: string[];
}

export interface SettingsForm {
  language: "ar" | "en" | "fr";
  darkMode: boolean;
  notifications: boolean;
  maxDistance: number;
  minAge: number;
  maxAge: number;
  showOnline: boolean;
}

// Context types
export interface AuthContextType {
  firebaseUser: any;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface LanguageContextType {
  language: "ar" | "en" | "fr";
  setLanguage: (lang: "ar" | "en" | "fr") => void;
  t: (key: string) => string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
