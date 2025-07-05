import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertUserSchema, insertLikeSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

// Initialize Stripe only if key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    // In a real app, you'd verify Firebase token here
    // For now, we'll assume user is authenticated if firebaseUid is present
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // User routes
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      // Extract Firebase UID from token (mock for now)
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const user = await storage.getUserByFirebaseUid(firebaseUid!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const userData = insertUserSchema.parse(req.body);
      
      const user = await storage.updateUser(firebaseUid!, userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Discovery routes
  app.get("/api/discover", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const { maxDistance = 50, minAge = 18, maxAge = 50 } = req.query;
      
      const potentialMatches = await storage.getPotentialMatches(firebaseUid!, {
        maxDistance: Number(maxDistance),
        minAge: Number(minAge),
        maxAge: Number(maxAge),
      });
      
      res.json(potentialMatches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Like/Pass routes
  app.post("/api/like", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const likeData = insertLikeSchema.parse(req.body);
      
      const fromUser = await storage.getUserByFirebaseUid(firebaseUid!);
      if (!fromUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const like = await storage.createLike({
        ...likeData,
        fromUserId: fromUser.id,
      });
      
      // Check for mutual like (match)
      const isMatch = await storage.checkForMatch(fromUser.id, likeData.toUserId);
      let matchedUser = null;
      
      if (isMatch && likeData.isLike) {
        const match = await storage.createMatch(fromUser.id, likeData.toUserId);
        await storage.createConversation(match.id);
        matchedUser = await storage.getUser(likeData.toUserId);
      }
      
      res.json({ 
        like, 
        isMatch: isMatch && likeData.isLike,
        matchedUser 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Conversation routes
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const user = await storage.getUserByFirebaseUid(firebaseUid!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const conversations = await storage.getUserConversations(user.id);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getConversationMessages(Number(id));
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const user = await storage.getUserByFirebaseUid(firebaseUid!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage({
        ...messageData,
        senderId: user.id,
      });
      
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Match routes
  app.get("/api/matches", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const user = await storage.getUserByFirebaseUid(firebaseUid!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const matches = await storage.getUserMatches(user.id);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Premium subscription routes
  app.post('/api/get-or-create-subscription', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing not available. Please contact support." });
      }

      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const user = await storage.getUserByFirebaseUid(firebaseUid!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          const invoice = subscription.latest_invoice;
          const paymentIntent = typeof invoice === 'object' && invoice ? invoice.payment_intent : null;
          
          res.json({
            subscriptionId: subscription.id,
            clientSecret: typeof paymentIntent === 'object' && paymentIntent ? paymentIntent.client_secret : null,
          });
          return;
        }
      }

      // Create new customer if needed
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.displayName,
          metadata: {
            userId: user.id.toString(),
            firebaseUid: user.firebaseUid,
          },
        });
        
        customerId = customer.id;
        await storage.updateUserStripeInfo(user.id, customerId, null);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_default', // You'll need to set this
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID
      await storage.updateUserStripeInfo(user.id, customerId, subscription.id);

      const invoice = subscription.latest_invoice;
      const paymentIntent = typeof invoice === 'object' && invoice ? invoice.payment_intent : null;
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: typeof paymentIntent === 'object' && paymentIntent ? paymentIntent.client_secret : null,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Stripe webhook handler
  app.post('/api/webhooks/stripe', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Payment processing not available" });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription as string;
        
        // Update user premium status
        const user = await storage.getUserByStripeSubscriptionId(subscriptionId);
        if (user) {
          await storage.updateUserPremiumStatus(user.id, true);
        }
        break;
        
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const deletedUser = await storage.getUserByStripeSubscriptionId(subscription.id);
        if (deletedUser) {
          await storage.updateUserPremiumStatus(deletedUser.id, false);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Stats routes
  app.get("/api/user/stats", requireAuth, async (req, res) => {
    try {
      const firebaseUid = req.headers.authorization?.replace("Bearer ", "");
      const user = await storage.getUserByFirebaseUid(firebaseUid!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const stats = await storage.getUserStats(user.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
