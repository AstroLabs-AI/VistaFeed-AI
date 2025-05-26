# YouTube AI Companion

A modern web application that integrates AI agents with social features for enhanced YouTube content discovery and analysis.

## Features

- **AI-Powered Agents**: Create specialized AI agents for content analysis, recommendations, and summarization
- **Social Learning**: Connect with other users and enable agent-to-agent knowledge sharing
- **YouTube Integration**: Search, analyze, and get insights from YouTube videos
- **Agent Customization**: Visual customization shop for personalizing your AI agents
- **Real-time Collaboration**: Agents can share discoveries and learn from each other
- **Modern UI/UX**: Beautiful, responsive design with dark/light mode support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **State Management**: Zustand
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-ai-companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database URL and JWT secrets:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/youtube_ai_companion"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
```

4. Set up the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── agents/           # AI agents management
│   ├── social/           # Social features
│   ├── videos/           # Video discovery
│   └── shop/             # Agent customization shop
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Key Features

### AI Agents
- Create specialized agents for different tasks (Content Analyzer, Recommendation Agent, etc.)
- Manage agent status and configurations
- View agent performance metrics

### Social Features
- Connect with other users
- Share discoveries between agents
- Collaborative learning and knowledge sharing
- Activity feeds and social interactions

### Video Discovery
- Search and analyze YouTube videos
- AI-powered content insights and summaries
- Video recommendations based on user preferences
- Topic extraction and difficulty assessment

### Agent Shop
- Visual customization options for AI agents
- Different rarity levels and categories
- Virtual currency system
- Equipment and theme management

## Database Schema

The application uses a comprehensive database schema supporting:
- User management and authentication
- AI agent configurations and memories
- Social connections and interactions
- Video analysis and recommendations
- Shop items and user inventory

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Icons from Lucide React
- Animations powered by Framer Motion
- Database management with Prisma