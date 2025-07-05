# Wesh - Dating App

## Overview

Wesh is a modern, intention-focused dating application built with a full-stack architecture using React/TypeScript for the frontend and Express/Node.js for the backend. The app emphasizes authentic connections through a swipe-based matching system, real-time chat functionality, and premium features. It supports multi-language content (Arabic, English, French) and includes comprehensive user authentication, profile management, and Stripe-powered subscription services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Styling**: Tailwind CSS with shadcn/ui component library using Radix UI primitives
- **State Management**: TanStack React Query for server state and React Context for global state (auth, language, theme)
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Firebase Authentication with Google OAuth integration
- **Real-time Features**: Firebase Firestore for live chat and notifications

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework using ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Firebase token verification middleware
- **Payment Processing**: Stripe integration for premium subscriptions
- **File Storage**: Firebase Storage for photo uploads
- **API Design**: RESTful API with JSON responses and proper error handling

### Database Schema
The application uses a relational PostgreSQL database with the following core entities:
- **Users**: Profile information, authentication data, premium status, Stripe integration
- **Matches**: Bidirectional matching relationships between users
- **Likes**: User interactions (like/pass/super like) with match detection logic
- **Conversations**: Chat containers linked to matches
- **Messages**: Individual chat messages with timestamps

## Key Components

### Authentication System
- Firebase Authentication with email/password and OAuth (Google, Apple)
- Secure token-based session management with automatic refresh
- Protected route wrapper component for authenticated areas
- Multi-step profile setup flow for new users

### Discovery & Matching Engine
- Swipe-based user discovery with filtering capabilities (age, distance, interests)
- Like/pass/super like actions with instant match detection
- Mutual like detection triggers conversation creation
- Premium features integration (unlimited likes, see who likes you)

### Real-time Chat System
- Firebase Firestore for live message synchronization
- Conversation management with unread message counts
- Message status indicators and typing indicators
- Photo sharing within conversations

### Premium Subscription System
- Stripe integration with secure payment processing
- Multiple subscription tiers with feature differentiation
- Automatic subscription status synchronization
- Premium feature gates throughout the application

### Internationalization
- Multi-language support (Arabic, English, French)
- Context-based translation system with translation keys
- Language selector component with persistent preferences
- RTL layout support for Arabic content

## Data Flow

### User Registration Flow
1. User registers via Firebase Authentication
2. Backend creates user record in PostgreSQL database
3. User completes profile setup (photos, bio, interests)
4. Profile completion triggers discovery algorithm inclusion

### Matching Flow
1. User views potential matches filtered by preferences
2. Like/pass actions stored in database with match detection
3. Mutual likes create conversation record
4. Real-time notification sent to both users
5. Chat interface becomes available

### Chat Flow
1. Messages sent through Firebase Firestore for real-time sync
2. Message metadata stored in PostgreSQL for analytics
3. Push notifications for offline users
4. Message status updates (sent, delivered, read)

### Premium Upgrade Flow
1. User selects premium plan on pricing page
2. Stripe Checkout session created with user metadata
3. Successful payment webhook updates user premium status
4. Premium features instantly become available

## External Dependencies

### Core Services
- **Firebase**: Authentication, Firestore (real-time chat), Storage (file uploads)
- **Stripe**: Payment processing and subscription management
- **Neon Database**: PostgreSQL hosting with serverless capabilities

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **Drizzle**: Type-safe database ORM with migrations
- **TanStack Query**: Server state management and caching

### UI/UX Libraries
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide Icons**: Consistent iconography

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Node.js/tsx for backend development
- Local PostgreSQL with Drizzle migrations
- Environment variable configuration for all services

### Production Build
- Frontend: Vite build with static asset optimization
- Backend: ESBuild bundling for Node.js deployment
- Database: Automated migrations via Drizzle
- Environment: Production environment variables for all integrations

### Hosting Architecture
- Frontend: Static hosting (likely Vercel/Netlify)
- Backend: Node.js hosting (likely Railway/Render)
- Database: Neon PostgreSQL with connection pooling
- CDN: Firebase Storage for photo assets

## Changelog
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.