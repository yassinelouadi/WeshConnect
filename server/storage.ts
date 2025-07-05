import { 
  users, 
  matches, 
  likes, 
  conversations, 
  messages,
  type User, 
  type InsertUser,
  type Match,
  type InsertMatch,
  type Like,
  type InsertLike,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage
} from "@shared/schema";

export interface DiscoveryFilters {
  maxDistance: number;
  minAge: number;
  maxAge: number;
  interests?: string[];
}

export interface UserStats {
  totalMatches: number;
  totalLikes: number;
  totalSuperLikes: number;
  profileViews: number;
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeSubscriptionId(subscriptionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(firebaseUid: string, userData: Partial<InsertUser>): Promise<User>;
  updateUserStripeInfo(userId: number, customerId: string, subscriptionId: string | null): Promise<User>;
  updateUserPremiumStatus(userId: number, isPremium: boolean): Promise<User>;
  
  // Discovery operations
  getPotentialMatches(firebaseUid: string, filters: DiscoveryFilters): Promise<User[]>;
  
  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  checkForMatch(userId1: number, userId2: number): Promise<boolean>;
  
  // Match operations
  createMatch(userId1: number, userId2: number): Promise<Match>;
  getUserMatches(userId: number): Promise<Match[]>;
  
  // Conversation operations
  createConversation(matchId: number): Promise<Conversation>;
  getUserConversations(userId: number): Promise<any[]>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Stats operations
  getUserStats(userId: number): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private matches: Map<number, Match>;
  private likes: Map<number, Like>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentMatchId: number;
  private currentLikeId: number;
  private currentConversationId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.likes = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentMatchId = 1;
    this.currentLikeId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getUserByStripeSubscriptionId(subscriptionId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.stripeSubscriptionId === subscriptionId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      lastActive: new Date(),
    } as User;
    this.users.set(id, user);
    return user;
  }

  async updateUser(firebaseUid: string, userData: Partial<InsertUser>): Promise<User> {
    const existingUser = await this.getUserByFirebaseUid(firebaseUid);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData,
      lastActive: new Date(),
    } as User;

    this.users.set(existingUser.id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId: string | null): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserPremiumStatus(userId: number, isPremium: boolean): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      isPremium,
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getPotentialMatches(firebaseUid: string, filters: DiscoveryFilters): Promise<User[]> {
    const currentUser = await this.getUserByFirebaseUid(firebaseUid);
    if (!currentUser) {
      return [];
    }

    // Get users that current user has already liked/passed
    const userLikes = Array.from(this.likes.values()).filter(
      like => like.fromUserId === currentUser.id
    );
    const likedUserIds = new Set(userLikes.map(like => like.toUserId));

    // Filter potential matches
    const potentialMatches = Array.from(this.users.values()).filter(user => {
      // Exclude self
      if (user.id === currentUser.id) return false;
      
      // Exclude already liked/passed users
      if (likedUserIds.has(user.id)) return false;
      
      // Filter by age
      if (user.age < filters.minAge || user.age > filters.maxAge) return false;
      
      // Filter by interests (if specified)
      if (filters.interests && filters.interests.length > 0) {
        const hasMatchingInterest = user.interests?.some(interest => 
          filters.interests!.includes(interest)
        );
        if (!hasMatchingInterest) return false;
      }
      
      return true;
    });

    // Limit to 10 potential matches
    return potentialMatches.slice(0, 10);
  }

  async createLike(like: InsertLike): Promise<Like> {
    const id = this.currentLikeId++;
    const likeRecord: Like = {
      ...like,
      id,
      createdAt: new Date(),
    };
    this.likes.set(id, likeRecord);
    return likeRecord;
  }

  async checkForMatch(userId1: number, userId2: number): Promise<boolean> {
    // Check if userId2 has already liked userId1
    const mutualLike = Array.from(this.likes.values()).find(
      like => like.fromUserId === userId2 && 
               like.toUserId === userId1 && 
               like.isLike === true
    );
    
    return !!mutualLike;
  }

  async createMatch(userId1: number, userId2: number): Promise<Match> {
    const id = this.currentMatchId++;
    const match: Match = {
      id,
      userId1,
      userId2,
      isMatch: true,
      createdAt: new Date(),
    };
    this.matches.set(id, match);
    return match;
  }

  async getUserMatches(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.userId1 === userId || match.userId2 === userId
    );
  }

  async createConversation(matchId: number): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = {
      id,
      matchId,
      lastMessageAt: new Date(),
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getUserConversations(userId: number): Promise<any[]> {
    const userMatches = await this.getUserMatches(userId);
    const matchIds = userMatches.map(match => match.id);
    
    const userConversations = Array.from(this.conversations.values()).filter(
      conversation => matchIds.includes(conversation.matchId)
    );

    // Enrich with other user data and last message
    const enrichedConversations = await Promise.all(
      userConversations.map(async (conversation) => {
        const match = userMatches.find(m => m.id === conversation.matchId);
        if (!match) return null;

        const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
        const otherUser = await this.getUser(otherUserId);
        
        // Get last message
        const conversationMessages = Array.from(this.messages.values())
          .filter(msg => msg.conversationId === conversation.id)
          .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
        
        const lastMessage = conversationMessages[0];
        
        // Count unread messages
        const unreadCount = conversationMessages.filter(
          msg => msg.senderId !== userId && !msg.isRead
        ).length;

        return {
          ...conversation,
          otherUser,
          lastMessage,
          unreadCount,
        };
      })
    );

    return enrichedConversations.filter(conv => conv !== null);
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const messageRecord: Message = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, messageRecord);

    // Update conversation's last message timestamp
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessageAt = new Date();
      this.conversations.set(conversation.id, conversation);
    }

    return messageRecord;
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const userMatches = await this.getUserMatches(userId);
    const userLikes = Array.from(this.likes.values()).filter(
      like => like.fromUserId === userId && like.isLike
    );
    const userSuperLikes = Array.from(this.likes.values()).filter(
      like => like.fromUserId === userId && like.isSuperLike
    );

    return {
      totalMatches: userMatches.length,
      totalLikes: userLikes.length,
      totalSuperLikes: userSuperLikes.length,
      profileViews: Math.floor(Math.random() * 100), // Mock data for now
    };
  }
}

export const storage = new MemStorage();
