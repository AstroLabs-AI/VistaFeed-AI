# Netlify Deployment Guide for VistaFeed-AI

## Prerequisites

1. **PostgreSQL Database**: You'll need a PostgreSQL database. Options:
   - [Supabase](https://supabase.com) - Free tier with PostgreSQL
   - [Neon](https://neon.tech) - Serverless PostgreSQL, free tier
   - [Aiven](https://aiven.io) - Managed PostgreSQL, free trial
   - [ElephantSQL](https://www.elephantsql.com) - PostgreSQL as a Service

2. **GitHub Repository**: Push your code to GitHub

## Step 1: Set Up Database

### Using Supabase (Recommended for Netlify):
1. Go to [supabase.com](https://supabase.com) and create a project
2. Once created, go to Settings → Database
3. Copy the "Connection string" (URI format)
4. Replace `[YOUR-PASSWORD]` with your project password

Your `DATABASE_URL` will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

## Step 2: Deploy to Netlify

### Option A: Using Netlify Web Interface (Easiest)

1. Go to [netlify.com](https://netlify.com) and sign up/log in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select your repository
4. Configure build settings:
   - **Build command**: `npm install && npx prisma generate && npm run build`
   - **Publish directory**: `.next`
5. Click "Show advanced" and add environment variables:
   ```
   DATABASE_URL = your_postgresql_connection_string
   JWT_SECRET = your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET = your-super-secret-refresh-key-here
   YOUTUBE_API_KEY = AIzaSyDUphdARuGjMdzBDQpiXnB5lkrNg4r_Bu0
   ```
6. Click "Deploy site"

### Option B: Using Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```

4. Set environment variables:
   ```bash
   netlify env:set DATABASE_URL "your_postgresql_connection_string"
   netlify env:set JWT_SECRET "your-super-secret-jwt-key-here"
   netlify env:set JWT_REFRESH_SECRET "your-super-secret-refresh-key-here"
   netlify env:set YOUTUBE_API_KEY "AIzaSyDUphdARuGjMdzBDQpiXnB5lkrNg4r_Bu0"
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Initialize Database

After deployment, you need to set up your database schema:

1. Install Netlify CLI if you haven't:
   ```bash
   npm install -g netlify-cli
   ```

2. Run database migrations using Netlify Dev:
   ```bash
   # Clone your repo locally if needed
   git clone your-repo-url
   cd your-project
   
   # Install dependencies
   npm install
   
   # Set up local environment variables
   echo "DATABASE_URL=your_postgresql_connection_string" > .env
   
   # Push schema to database
   npx prisma db push
   ```

## Step 4: Verify Deployment

1. Visit your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Check the deployment logs in Netlify dashboard for any errors
3. Test the authentication by registering a new user

## Environment Variables Reference

Required environment variables for Netlify:

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| JWT_SECRET | Secret for JWT tokens | Any random 32+ character string |
| JWT_REFRESH_SECRET | Secret for refresh tokens | Any random 32+ character string |
| YOUTUBE_API_KEY | YouTube Data API v3 key | `AIzaSyD...` |

Optional:
| Variable | Description | Example |
|----------|-------------|---------|
| AI_SERVICE_API_KEY | OpenAI or other AI service key | `sk-...` |
| AI_SERVICE_BASE_URL | AI service endpoint | `https://api.openai.com/v1` |

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version is 18+ in `netlify.toml`

### Database Connection Issues
- Verify DATABASE_URL is correctly formatted
- Ensure your database allows connections from Netlify
- Check if SSL is required (add `?sslmode=require` to connection string)

### 500 Errors
- Check function logs in Netlify dashboard
- Verify all environment variables are set
- Ensure Prisma client is generated during build

## Post-Deployment

1. **Custom Domain**: Add your domain in Netlify Site Settings → Domain management
2. **Enable HTTPS**: Automatic with Netlify
3. **Monitor**: Use Netlify Analytics and Functions logs

## Continuous Deployment

Every push to your main branch will trigger a new deployment automatically.

To skip a deployment, add `[skip ci]` or `[skip netlify]` to your commit message.