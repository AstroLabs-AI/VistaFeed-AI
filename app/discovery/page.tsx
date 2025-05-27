'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  Users, 
  Eye, 
  ThumbsUp, 
  Clock, 
  Star,
  Info,
  Settings,
  Shuffle,
  Filter,
  Play,
  Bookmark,
  Share2,
  MessageSquare,
  BarChart3,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';

interface AIRecommendation {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: Date;
  channel: {
    name: string;
    avatar: string;
  };
  agentRecommendation: {
    agentName: string;
    agentType: string;
    relevanceScore: number;
    diversityScore: number;
    explanation: string;
    confidence: number;
    factors: string[];
  };
  aiAnalysis: {
    topics: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    engagement: {
      predicted_retention: number;
      appeal_score: number;
      educational_value: number;
    };
    quality: 'low' | 'medium' | 'high';
  };
  socialSignals: {
    trending_score: number;
    community_rating: number;
    co_watching_sessions: number;
    poll_mentions: number;
  };
}

interface Agent {
  id: string;
  name: string;
  type: string;
  avatar: string;
  specialization: string[];
  performance: {
    accuracy: number;
    user_satisfaction: number;
    recommendations_count: number;
  };
  isActive: boolean;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'TechExplorer',
    type: 'Content Analyzer',
    avatar: 'https://static.vecteezy.com/system/resources/previews/036/392/006/original/digital-brain-ai-logo-template-free-vector.jpg',
    specialization: ['Machine Learning', 'Programming', 'Technology'],
    performance: {
      accuracy: 0.92,
      user_satisfaction: 0.88,
      recommendations_count: 156
    },
    isActive: true
  },
  {
    id: '2',
    name: 'LearnMaster',
    type: 'Recommendation Agent',
    avatar: 'https://i.pinimg.com/originals/c0/9d/1f/c09d1fe6eb6188d7fce7aa4d686cd043.jpg',
    specialization: ['Education', 'Tutorials', 'Skill Development'],
    performance: {
      accuracy: 0.89,
      user_satisfaction: 0.91,
      recommendations_count: 203
    },
    isActive: true
  }
];

const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    videoId: 'abc123',
    title: 'Advanced Neural Networks: Transformer Architecture Deep Dive',
    description: 'Comprehensive exploration of transformer architecture, attention mechanisms, and their applications in modern AI systems.',
    thumbnail: 'https://i.pinimg.com/originals/96/68/73/966873d7527c073d930c1559f1d19618.png',
    duration: '28:45',
    views: 89000,
    likes: 5600,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    channel: {
      name: 'AI Research Lab',
      avatar: 'https://static.vecteezy.com/system/resources/previews/036/392/006/original/digital-brain-ai-logo-template-free-vector.jpg'
    },
    agentRecommendation: {
      agentName: 'TechExplorer',
      agentType: 'Content Analyzer',
      relevanceScore: 0.94,
      diversityScore: 0.23,
      explanation: 'This video perfectly matches your advanced interest in neural networks and transformer architectures. The content depth aligns with your learning progression.',
      confidence: 0.91,
      factors: [
        'Topic relevance: Neural Networks (95% match)',
        'Difficulty level: Advanced (perfect fit)',
        'Content quality: High production value',
        'Community engagement: 94% positive feedback',
        'Learning progression: Next logical step'
      ]
    },
    aiAnalysis: {
      topics: ['Neural Networks', 'Transformers', 'Attention Mechanisms', 'Deep Learning'],
      difficulty: 'Advanced',
      engagement: {
        predicted_retention: 0.87,
        appeal_score: 0.82,
        educational_value: 0.95
      },
      quality: 'high'
    },
    socialSignals: {
      trending_score: 0.78,
      community_rating: 4.7,
      co_watching_sessions: 23,
      poll_mentions: 8
    }
  },
  {
    id: '2',
    videoId: 'def456',
    title: 'Creative Problem Solving: Design Thinking Workshop',
    description: 'Interactive workshop on design thinking methodologies and creative problem-solving techniques for innovation.',
    thumbnail: 'https://i.pinimg.com/736x/f2/46/c1/f246c12cb2426fadceb71b1a34955f54.jpg',
    duration: '45:20',
    views: 34000,
    likes: 2100,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    channel: {
      name: 'Innovation Hub',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg'
    },
    agentRecommendation: {
      agentName: 'LearnMaster',
      agentType: 'Recommendation Agent',
      relevanceScore: 0.67,
      diversityScore: 0.89,
      explanation: 'Recommended to broaden your perspective beyond technical content. This creative approach to problem-solving can enhance your technical skills.',
      confidence: 0.74,
      factors: [
        'Diversity boost: Outside usual topics',
        'Skill enhancement: Problem-solving methods',
        'High engagement: Interactive format',
        'Community favorite: 4.5/5 rating',
        'Cross-domain learning opportunity'
      ]
    },
    aiAnalysis: {
      topics: ['Design Thinking', 'Creativity', 'Problem Solving', 'Innovation'],
      difficulty: 'Intermediate',
      engagement: {
        predicted_retention: 0.79,
        appeal_score: 0.85,
        educational_value: 0.88
      },
      quality: 'high'
    },
    socialSignals: {
      trending_score: 0.65,
      community_rating: 4.5,
      co_watching_sessions: 15,
      poll_mentions: 12
    }
  }
];

export default function DiscoveryPage() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [diversityPreference, setDiversityPreference] = useState([0.3]);
  const [showExplanations, setShowExplanations] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    // Fetch recommendations immediately
    fetchRecommendations();
  }, []);
  
  // Fetch recommendations when diversity preference changes
  useEffect(() => {
    fetchRecommendations();
  }, [diversityPreference]);
  
  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      const response = await fetch(`/api/videos/recommendations?diversity=${diversityPreference[0]}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fall back to mock data if API fails
      setRecommendations(mockRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => 
    selectedAgent === 'all' || rec.agentRecommendation.agentName === selectedAgent
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'high': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'medium': return <Star className="w-4 h-4 text-gray-400" />;
      case 'low': return <Star className="w-4 h-4 text-gray-300" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI-Powered <span className="gradient-text">Video Discovery</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Personalized recommendations powered by your AI agents with transparent explanations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setShowExplanations(!showExplanations)}>
              <Info className="w-4 h-4 mr-2" />
              {showExplanations ? 'Hide' : 'Show'} Explanations
            </Button>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Discovery Preferences</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Content Diversity Preference
                    </label>
                    <div className="space-y-3">
                      <Slider
                        value={diversityPreference}
                        onValueChange={setDiversityPreference}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Familiar Content</span>
                        <span>Diverse Content</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Current: {Math.round(diversityPreference[0] * 100)}% diversity
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={fetchRecommendations}
              disabled={isLoading}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </motion.div>

        {/* AI Agents Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50 dark:border-blue-800/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Your AI Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAgent === agent.name
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAgent(selectedAgent === agent.name ? 'all' : agent.name)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={agent.avatar} />
                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">{agent.name}</h3>
                        <Badge variant="outline" className="text-xs">{agent.type}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Accuracy</span>
                        <span>{Math.round(agent.performance.accuracy * 100)}%</span>
                      </div>
                      <Progress value={agent.performance.accuracy * 100} className="h-1" />
                      <div className="flex justify-between text-xs">
                        <span>Satisfaction</span>
                        <span>{Math.round(agent.performance.user_satisfaction * 100)}%</span>
                      </div>
                      <Progress value={agent.performance.user_satisfaction * 100} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        {isLoading && recommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-gray-600 dark:text-gray-300">
              Discovering personalized videos for you...
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Video Thumbnail */}
                  <div className="lg:w-80 aspect-video lg:aspect-auto relative bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={recommendation.thumbnail}
                      alt={recommendation.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {recommendation.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={`${getDifficultyColor(recommendation.aiAnalysis.difficulty)} text-white`}>
                        {recommendation.aiAnalysis.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      {getQualityIcon(recommendation.aiAnalysis.quality)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {recommendation.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {recommendation.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Channel Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={recommendation.channel.avatar} />
                          <AvatarFallback>{recommendation.channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{recommendation.channel.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatViews(recommendation.views)} views • {formatRelativeTime(recommendation.publishedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {recommendation.aiAnalysis.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      {/* AI Recommendation Info */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-sm">
                              Recommended by {recommendation.agentRecommendation.agentName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Relevance: {Math.round(recommendation.agentRecommendation.relevanceScore * 100)}%
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Confidence: {Math.round(recommendation.agentRecommendation.confidence * 100)}%
                            </div>
                          </div>
                        </div>

                        {showExplanations && (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {recommendation.agentRecommendation.explanation}
                            </p>
                            
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Recommendation Factors:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {recommendation.agentRecommendation.factors.map((factor, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 text-xs">
                                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                                    <span>{factor}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Engagement Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {Math.round(recommendation.aiAnalysis.engagement.predicted_retention * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">Predicted Retention</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {Math.round(recommendation.aiAnalysis.engagement.appeal_score * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">Appeal Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">
                            {Math.round(recommendation.aiAnalysis.engagement.educational_value * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">Educational Value</div>
                        </div>
                      </div>

                      {/* Social Signals */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{formatViews(recommendation.likes)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{recommendation.socialSignals.co_watching_sessions} co-watching</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{recommendation.socialSignals.poll_mentions} poll mentions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Trending: {Math.round(recommendation.socialSignals.trending_score * 100)}%</span>
                          </div>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${recommendation.videoId}`, '_blank')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        )}

        {/* Learning Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Learning Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalization Accuracy</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">92%</p>
                  <p className="text-sm text-gray-500">Your agents are learning your preferences effectively</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Discovery Rate</h3>
                  <p className="text-2xl font-bold text-green-600 mb-1">78%</p>
                  <p className="text-sm text-gray-500">Successfully introducing you to new content</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Social Integration</h3>
                  <p className="text-2xl font-bold text-purple-600 mb-1">85%</p>
                  <p className="text-sm text-gray-500">Leveraging community insights for better recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}