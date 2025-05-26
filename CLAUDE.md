# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VistaFeed-AI (YouTube AI Companion) is a Next.js 14 application that integrates AI agents with social features for enhanced YouTube content discovery and analysis. It uses TypeScript, Tailwind CSS, PostgreSQL with Prisma ORM, and JWT-based authentication.

## Essential Commands

### Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server (runs on localhost:3000)
```

### Build & Production
```bash
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Database Management
```bash
npx prisma db push       # Push schema changes to database
npx prisma migrate dev   # Create and apply migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio GUI
```

### Environment Setup
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token generation
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `AI_SERVICE_API_KEY` - API key for AI service (optional)
- `AI_SERVICE_BASE_URL` - Base URL for AI service (optional)

## Architecture Overview

### Core Technologies
- **Frontend**: Next.js 14 App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with Radix UI primitives
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based using jose library (Edge Runtime compatible)
- **State Management**: Client-side with React hooks

### Project Structure
- `/app` - Next.js App Router pages and API routes
  - `/api` - API endpoints for auth, agents, social, videos, shop
  - Page routes: dashboard, agents, social, videos, shop, discovery
- `/components` - React components organized by feature
  - `/ui` - Radix UI-based components (button, card, dialog, etc.)
- `/lib` - Core utilities and services
  - `auth.ts` - JWT authentication using jose (Edge-compatible)
  - `ai-services.ts` - AI analysis and recommendation services
  - `prisma.ts` - Prisma client singleton
  - `youtube-api.ts` - YouTube API integration
- `/prisma` - Database schema and migrations

### Key Architectural Decisions

1. **Edge Runtime Compatibility**: Uses jose instead of jsonwebtoken for JWT handling to maintain Edge Runtime compatibility.

2. **AI Agent System**: Agents are stored in database with configurations, memories, and interactions. Each agent has:
   - Type (Content Analyzer, Recommendation Agent, etc.)
   - Configuration JSON
   - Memory storage for learning
   - Visual assets for customization

3. **Social Features**: Implements user connections, shared discoveries, and agent-to-agent interactions through database relations.

4. **Authentication Flow**: JWT tokens with 15-minute access token and 7-day refresh token. Middleware allows client-side auth handling to avoid Edge Runtime issues.

5. **Component Library**: Uses Radix UI primitives wrapped with custom styling via Tailwind CSS and class-variance-authority.

### API Routes Pattern
All API routes follow RESTful conventions:
- `/api/auth/*` - Authentication endpoints
- `/api/agents/*` - CRUD operations for AI agents
- `/api/social/*` - Social features and connections
- `/api/videos/*` - Video search and analysis
- `/api/shop/*` - Virtual shop for agent customization

### Database Schema Key Entities
- **User**: Core user entity with preferences
- **Agent**: AI agents with configurations and memories
- **AgentInteraction**: Agent-to-agent communications
- **SocialConnection**: User relationships
- **SharedDiscovery**: Content shared between agents
- **ShopItem/UserInventory**: Virtual goods system

### Testing Approach
Check package.json for test scripts. The project uses Next.js built-in linting.

### Deployment Configuration
- Uses Next.js standalone output mode when NEXT_OUTPUT_MODE is set
- Netlify deployment configured via netlify.toml
- TypeScript build errors are not ignored
- ESLint errors ignored during builds