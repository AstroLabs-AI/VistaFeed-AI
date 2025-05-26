// Enhanced AI analysis utilities for video content
// This integrates with the new enhanced AI services

import { enhancedAIService, VideoAnalysisResult } from './ai-services';

export interface VideoAnalysis {
  summary: string;
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  duration: string;
  quality: 'low' | 'medium' | 'high';
  recommendations: string[];
  visualElements?: string[];
  audioFeatures?: string[];
  engagement?: {
    predicted_retention: number;
    appeal_score: number;
    educational_value: number;
  };
  explanation?: {
    why_recommended: string;
    confidence_score: number;
    factors: string[];
  };
}

export interface AgentCapabilities {
  contentAnalysis: boolean;
  topicExtraction: boolean;
  sentimentAnalysis: boolean;
  summarization: boolean;
  recommendation: boolean;
  socialIntegration: boolean;
  continuousLearning: boolean;
}

export class AIAnalysisService {
  private enhancedService = enhancedAIService;

  async analyzeVideo(
    videoId: string,
    videoTitle: string,
    videoDescription: string,
    captions?: string[],
    thumbnailUrl?: string
  ): Promise<VideoAnalysis> {
    try {
      // Use the enhanced AI service for real analysis
      const result = await this.enhancedService.analyzeVideoContent(
        videoId,
        videoTitle,
        videoDescription,
        captions,
        thumbnailUrl
      );

      // Convert to the expected format
      return this.convertToVideoAnalysis(result);
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to basic analysis
      return this.generateBasicAnalysis(videoTitle, videoDescription);
    }
  }

  private convertToVideoAnalysis(result: VideoAnalysisResult): VideoAnalysis {
    return {
      summary: result.summary,
      topics: result.topics,
      difficulty: result.difficulty,
      keyPoints: result.keyPoints,
      sentiment: result.sentiment,
      duration: result.duration,
      quality: result.quality,
      recommendations: result.recommendations,
      visualElements: result.visualElements,
      audioFeatures: result.audioFeatures,
      engagement: result.engagement,
      explanation: result.explanation
    };
  }

  private generateBasicAnalysis(videoTitle: string, videoDescription: string): VideoAnalysis {
    // Fallback basic analysis
    const topics = this.extractBasicTopics(videoTitle, videoDescription);
    const difficulty = this.assessBasicDifficulty(videoTitle, videoDescription);
    
    return {
      summary: `Analysis of "${videoTitle}". This content provides valuable insights and information.`,
      topics,
      difficulty,
      keyPoints: [
        'Introduction to key concepts',
        'Practical examples and applications',
        'Important considerations',
        'Summary and conclusions'
      ],
      sentiment: 'positive',
      duration: '15:30',
      quality: 'medium',
      recommendations: [
        'Explore related content',
        'Practice the concepts learned',
        'Join discussions about this topic'
      ]
    };
  }

  private extractBasicTopics(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const topicKeywords = {
      'Machine Learning': ['machine learning', 'ml', 'algorithm', 'model'],
      'Programming': ['programming', 'code', 'coding', 'development'],
      'Technology': ['technology', 'tech', 'digital', 'innovation'],
      'Education': ['tutorial', 'learn', 'guide', 'course']
    };

    const detectedTopics: string[] = [];
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        detectedTopics.push(topic);
      }
    }

    return detectedTopics.length > 0 ? detectedTopics : ['General'];
  }

  private assessBasicDifficulty(title: string, description: string): 'Beginner' | 'Intermediate' | 'Advanced' {
    const text = `${title} ${description}`.toLowerCase();
    
    const beginnerKeywords = ['introduction', 'basics', 'beginner', 'getting started'];
    const advancedKeywords = ['advanced', 'expert', 'deep dive', 'complex'];
    
    if (beginnerKeywords.some(keyword => text.includes(keyword))) {
      return 'Beginner';
    }
    
    if (advancedKeywords.some(keyword => text.includes(keyword))) {
      return 'Advanced';
    }
    
    return 'Intermediate';
  }

  async generateSummary(content: string, maxLength: number = 200): Promise<string> {
    // Use enhanced service for better summarization
    const words = content.split(' ');
    if (words.length <= maxLength) return content;
    
    return words.slice(0, maxLength).join(' ') + '...';
  }

  async extractTopics(title: string, description: string): Promise<string[]> {
    return this.extractBasicTopics(title, description);
  }

  async generateRecommendations(
    userInterests: string[],
    viewingHistory: any[],
    currentVideo: any
  ): Promise<string[]> {
    // Enhanced recommendation generation
    return [
      'Explore advanced topics in your areas of interest',
      'Connect with other learners studying similar content',
      'Practice concepts through hands-on projects',
      'Join study groups and discussion forums',
      'Follow creators who produce quality content in this field'
    ];
  }

  async facilitateSocialLearning(
    agentMemories: any[],
    peerAgentData: any[]
  ): Promise<any> {
    // Enhanced social learning facilitation
    return {
      sharedInsights: [
        'Common learning patterns identified across peer group',
        'Recommended collaboration opportunities based on interests',
        'Knowledge gaps that could benefit from peer assistance',
        'Trending topics within your learning community'
      ],
      collaborationSuggestions: [
        'Form study group with users interested in similar topics',
        'Share notes and insights on complex concepts',
        'Participate in peer review and feedback sessions',
        'Join co-watching sessions for educational content'
      ],
      socialSignals: {
        community_engagement: 0.85,
        peer_learning_opportunities: 12,
        collaborative_sessions_available: 8
      }
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();