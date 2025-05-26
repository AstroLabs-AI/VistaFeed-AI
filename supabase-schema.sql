-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "profilePicture" TEXT,
    "isActive" BOOLEAN DEFAULT true NOT NULL
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "preferenceKey" TEXT NOT NULL,
    "preferenceValue" TEXT,
    "lastUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE("userId", "preferenceKey")
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    configuration JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastActive" TIMESTAMP(3),
    "visualAssets" JSONB,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create agent_memories table
CREATE TABLE IF NOT EXISTS agent_memories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "agentId" TEXT NOT NULL,
    "memoryType" TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    importance DOUBLE PRECISION DEFAULT 0.5 NOT NULL,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES agents(id) ON DELETE CASCADE
);

-- Create video_interactions table
CREATE TABLE IF NOT EXISTS video_interactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data JSONB,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create agent_interactions table
CREATE TABLE IF NOT EXISTS agent_interactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "fromAgentId" TEXT NOT NULL,
    "toAgentId" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    content TEXT,
    metadata JSONB,
    timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_from_agent FOREIGN KEY ("fromAgentId") REFERENCES agents(id) ON DELETE CASCADE,
    CONSTRAINT fk_to_agent FOREIGN KEY ("toAgentId") REFERENCES agents(id) ON DELETE CASCADE
);

-- Create social_connections table
CREATE TABLE IF NOT EXISTS social_connections (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId1" TEXT NOT NULL,
    "userId2" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    status TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastInteraction" TIMESTAMP(3),
    CONSTRAINT fk_user1 FOREIGN KEY ("userId1") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user2 FOREIGN KEY ("userId2") REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE("userId1", "userId2", "connectionType")
);

-- Create shared_discoveries table
CREATE TABLE IF NOT EXISTS shared_discoveries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "agentId" TEXT NOT NULL,
    "discoveryType" TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isPublic" BOOLEAN DEFAULT false NOT NULL,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES agents(id) ON DELETE CASCADE
);

-- Create shop_items table
CREATE TABLE IF NOT EXISTS shop_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "itemType" TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    "assetUrl" TEXT,
    metadata JSONB,
    "isActive" BOOLEAN DEFAULT true NOT NULL
);

-- Create user_inventory table
CREATE TABLE IF NOT EXISTS user_inventory (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isEquipped" BOOLEAN DEFAULT false NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_item FOREIGN KEY ("itemId") REFERENCES shop_items(id) ON DELETE CASCADE,
    UNIQUE("userId", "itemId")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_userId ON user_preferences("userId");
CREATE INDEX IF NOT EXISTS idx_agents_userId ON agents("userId");
CREATE INDEX IF NOT EXISTS idx_agent_memories_agentId ON agent_memories("agentId");
CREATE INDEX IF NOT EXISTS idx_video_interactions_userId ON video_interactions("userId");
CREATE INDEX IF NOT EXISTS idx_agent_interactions_fromAgentId ON agent_interactions("fromAgentId");
CREATE INDEX IF NOT EXISTS idx_agent_interactions_toAgentId ON agent_interactions("toAgentId");
CREATE INDEX IF NOT EXISTS idx_social_connections_userId1 ON social_connections("userId1");
CREATE INDEX IF NOT EXISTS idx_social_connections_userId2 ON social_connections("userId2");
CREATE INDEX IF NOT EXISTS idx_shared_discoveries_agentId ON shared_discoveries("agentId");
CREATE INDEX IF NOT EXISTS idx_user_inventory_userId ON user_inventory("userId");
CREATE INDEX IF NOT EXISTS idx_user_inventory_itemId ON user_inventory("itemId");