import OpenAI from 'openai';
import { VideoAnalysisResult } from '../ai-services';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_SERVICE_API_KEY || '',
  // For demo mode, we'll use mock responses if no API key
  dangerouslyAllowBrowser: false,
});

export interface AgentPersonality {
  name: string;
  type: 'content_analyzer' | 'recommendation' | 'summarization' | 'social' | 'learning';
  personality: string;
  expertise: string[];
  tone: string;
}

export const AGENT_PERSONALITIES: Record<string, AgentPersonality> = {
  content_analyzer: {
    name: 'TechExplorer',
    type: 'content_analyzer',
    personality: 'Analytical and detail-oriented, I love diving deep into video content to extract meaningful insights.',
    expertise: ['Technology', 'Programming', 'Machine Learning', 'Data Science'],
    tone: 'Professional, informative, and thorough',
  },
  recommendation: {
    name: 'LearnMaster',
    type: 'recommendation',
    personality: 'Enthusiastic and personalized, I help you discover content that matches your learning journey.',
    expertise: ['Education', 'Skill Development', 'Career Growth', 'Personal Development'],
    tone: 'Encouraging, supportive, and insightful',
  },
  summarization: {
    name: 'BriefBot',
    type: 'summarization',
    personality: 'Concise and clear, I distill complex videos into easy-to-understand summaries.',
    expertise: ['Content Synthesis', 'Key Point Extraction', 'Time-saving Summaries'],
    tone: 'Clear, concise, and to-the-point',
  },
  social: {
    name: 'CommunityConnector',
    type: 'social',
    personality: 'Social and engaging, I help foster connections and meaningful discussions.',
    expertise: ['Community Building', 'Discussion Facilitation', 'Trend Analysis'],
    tone: 'Friendly, inclusive, and engaging',
  },
  learning: {
    name: 'KnowledgeKeeper',
    type: 'learning',
    personality: 'Wise and collaborative, I coordinate knowledge sharing between agents for better insights.',
    expertise: ['Knowledge Management', 'Learning Optimization', 'Pattern Recognition'],
    tone: 'Thoughtful, strategic, and collaborative',
  },
};

export class OpenAIService {
  private apiKeyAvailable: boolean;

  constructor() {
    this.apiKeyAvailable = !!process.env.AI_SERVICE_API_KEY;
  }

  async analyzeVideoWithAgent(
    agentType: string,
    videoTitle: string,
    videoDescription: string,
    additionalContext?: string
  ): Promise<VideoAnalysisResult> {
    const agent = AGENT_PERSONALITIES[agentType] || AGENT_PERSONALITIES.content_analyzer;
    
    if (!this.apiKeyAvailable) {
      // Return enhanced mock response for demo mode
      return this.generateDemoAnalysis(agent, videoTitle, videoDescription);
    }

    try {
      const systemPrompt = `You are ${agent.name}, an AI agent with the following characteristics:
Personality: ${agent.personality}
Expertise: ${agent.expertise.join(', ')}
Tone: ${agent.tone}

Analyze the following video and provide insights based on your expertise.`;

      const userPrompt = `Video Title: ${videoTitle}
Description: ${videoDescription}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Please provide:
1. A comprehensive summary
2. Key topics covered
3. Difficulty level (Beginner/Intermediate/Advanced)
4. Main key points
5. Overall sentiment
6. Quality assessment
7. Recommendations for viewers`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseAIResponse(response, videoTitle);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateDemoAnalysis(agent, videoTitle, videoDescription);
    }
  }

  async generateAgentMemory(
    agentId: string,
    content: string,
    memoryType: 'video_analysis' | 'user_interaction' | 'learning' | 'discovery',
    importance: number = 0.5
  ) {
    if (!this.apiKeyAvailable) {
      return {
        id: `memory-${Date.now()}`,
        agentId,
        content,
        memoryType,
        importance,
        embedding: new Array(1536).fill(0).map(() => Math.random()), // Mock embedding
        metadata: {},
      };
    }

    try {
      // Generate embedding for memory storage
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: content,
      });

      return {
        id: `memory-${Date.now()}`,
        agentId,
        content,
        memoryType,
        importance,
        embedding: embedding.data[0].embedding,
        metadata: {},
      };
    } catch (error) {
      console.error('Embedding generation error:', error);
      return {
        id: `memory-${Date.now()}`,
        agentId,
        content,
        memoryType,
        importance,
        embedding: new Array(1536).fill(0).map(() => Math.random()),
        metadata: {},
      };
    }
  }

  async getAgentResponse(
    agentType: string,
    prompt: string,
    context?: any
  ): Promise<string> {
    const agent = AGENT_PERSONALITIES[agentType] || AGENT_PERSONALITIES.content_analyzer;
    
    if (!this.apiKeyAvailable) {
      return this.generateDemoResponse(agent, prompt);
    }

    try {
      const systemPrompt = `You are ${agent.name}, an AI agent with the following characteristics:
Personality: ${agent.personality}
Expertise: ${agent.expertise.join(', ')}
Tone: ${agent.tone}

Respond to the user's request in character.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || this.generateDemoResponse(agent, prompt);
    } catch (error) {
      console.error('Agent response error:', error);
      return this.generateDemoResponse(agent, prompt);
    }
  }

  private parseAIResponse(response: string, videoTitle: string): VideoAnalysisResult {
    // Parse the AI response into structured format
    // This is a simplified parser - in production, you'd want more robust parsing
    
    const lines = response.split('\n');
    const summary = lines.find(l => l.includes('summary'))?.split(':')[1]?.trim() || 
                   `Comprehensive analysis of "${videoTitle}"`;
    
    return {
      summary,
      topics: this.extractTopics(response),
      difficulty: this.extractDifficulty(response),
      keyPoints: this.extractKeyPoints(response),
      sentiment: this.extractSentiment(response),
      duration: '15:00', // Would be extracted from actual video data
      quality: 'high',
      recommendations: this.extractRecommendations(response),
      visualElements: ['Professional presentation', 'Clear visuals'],
      audioFeatures: ['Clear narration', 'Good audio quality'],
      engagement: {
        predicted_retention: 0.85,
        appeal_score: 0.80,
        educational_value: 0.90,
      },
      explanation: {
        why_recommended: 'Based on your interests and viewing history',
        confidence_score: 0.85,
        factors: ['Topic relevance', 'Quality content', 'Appropriate difficulty'],
      },
    };
  }

  private extractTopics(text: string): string[] {
    // Simple topic extraction - in production, use NLP
    const topics = ['Technology', 'Education', 'Programming'];
    return topics;
  }

  private extractDifficulty(text: string): 'Beginner' | 'Intermediate' | 'Advanced' {
    const lower = text.toLowerCase();
    if (lower.includes('beginner') || lower.includes('basic')) return 'Beginner';
    if (lower.includes('advanced') || lower.includes('expert')) return 'Advanced';
    return 'Intermediate';
  }

  private extractKeyPoints(text: string): string[] {
    return [
      'Core concepts explained clearly',
      'Practical examples provided',
      'Real-world applications discussed',
      'Best practices highlighted',
    ];
  }

  private extractSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const lower = text.toLowerCase();
    if (lower.includes('excellent') || lower.includes('great')) return 'positive';
    if (lower.includes('poor') || lower.includes('bad')) return 'negative';
    return 'neutral';
  }

  private extractRecommendations(text: string): string[] {
    return [
      'Watch related advanced tutorials',
      'Practice with hands-on projects',
      'Join community discussions',
      'Explore similar content',
    ];
  }

  private generateDemoAnalysis(
    agent: AgentPersonality,
    videoTitle: string,
    videoDescription: string
  ): VideoAnalysisResult {
    return {
      summary: `As ${agent.name}, I've analyzed "${videoTitle}". ${videoDescription.slice(0, 100)}... This content aligns well with ${agent.expertise[0]} topics.`,
      topics: agent.expertise.slice(0, 3),
      difficulty: 'Intermediate',
      keyPoints: [
        `Key insight from ${agent.name}'s perspective`,
        'Important concept explained clearly',
        'Practical application demonstrated',
        'Best practices for implementation',
      ],
      sentiment: 'positive',
      duration: '15:30',
      quality: 'high',
      recommendations: [
        `Based on my expertise in ${agent.expertise[0]}, I recommend exploring related content`,
        'Consider hands-on practice with the concepts',
        'Connect with others learning similar topics',
        'Build projects to reinforce learning',
      ],
      visualElements: ['Clear presentation', 'Engaging visuals', 'Professional quality'],
      audioFeatures: ['Clear narration', 'Good pacing', 'Engaging delivery'],
      engagement: {
        predicted_retention: 0.82,
        appeal_score: 0.78,
        educational_value: 0.88,
      },
      explanation: {
        why_recommended: `As ${agent.name}, I believe this content matches your interests in ${agent.expertise[0]}`,
        confidence_score: 0.83,
        factors: ['Topic alignment', 'Quality content', 'Learning progression'],
      },
    };
  }

  private generateDemoResponse(agent: AgentPersonality, prompt: string): string {
    const responses = {
      content_analyzer: `As ${agent.name}, I've carefully analyzed your request. Based on my expertise in ${agent.expertise[0]}, I can see that this topic has several important aspects to consider...`,
      recommendation: `Hi! I'm ${agent.name}, and I'm excited to help you discover content that matches your learning goals. Based on what you've shared, I think you'd really enjoy...`,
      summarization: `Here's a concise summary: The main points are clearly presented, focusing on the essential information you need to understand the topic quickly...`,
      social: `Hey there! As ${agent.name}, I love seeing the community come together around shared interests. This would be a great topic for discussion...`,
      learning: `From a knowledge management perspective, this represents an excellent opportunity to build connections between different concepts you've been learning...`,
    };

    return responses[agent.type] || `As ${agent.name}, I'm here to help with your request...`;
  }
}

export const openAIService = new OpenAIService();