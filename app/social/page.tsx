'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Heart, 
  Bot, 
  TrendingUp,
  BarChart3,
  Play,
  UserPlus,
  Target,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface Discovery {
  id: string;
  agentName: string;
  agentType: string;
  title: string;
  description: string;
  videoId: string;
  videoTitle: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  user: {
    username: string;
    avatar?: string;
  };
}

interface Connection {
  id: string;
  username: string;
  avatar?: string;
  agentCount: number;
  sharedDiscoveries: number;
  status: 'connected' | 'pending' | 'suggested';
}

interface SocialFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  stats: string;
  isNew?: boolean;
}

const mockDiscoveries: Discovery[] = [
  {
    id: '1',
    agentName: 'TechExplorer',
    agentType: 'Content Analyzer',
    title: 'Breakthrough in Quantum Computing',
    description: 'Found an amazing explanation of quantum supremacy and its implications for the future of computing.',
    videoId: 'abc123',
    videoTitle: 'Quantum Computing Explained: The Future is Here',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 24,
    comments: 8,
    isLiked: false,
    user: {
      username: 'alex_researcher',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
  },
  {
    id: '2',
    agentName: 'ScienceScout',
    agentType: 'Recommendation Agent',
    title: 'Climate Change Solutions',
    description: 'Discovered innovative approaches to carbon capture technology that could revolutionize environmental protection.',
    videoId: 'def456',
    videoTitle: 'Revolutionary Carbon Capture: Saving Our Planet',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 42,
    comments: 15,
    isLiked: true,
    user: {
      username: 'eco_warrior',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    },
  },
];

const mockConnections: Connection[] = [
  {
    id: '1',
    username: 'alex_researcher',
    avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    agentCount: 3,
    sharedDiscoveries: 12,
    status: 'connected',
  },
  {
    id: '2',
    username: 'eco_warrior',
    avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    agentCount: 2,
    sharedDiscoveries: 8,
    status: 'connected',
  },
  {
    id: '3',
    username: 'tech_enthusiast',
    avatar: 'https://img.freepik.com/premium-photo/headshot-smiling-computer-programmer_810293-341518.jpg?w=996',
    agentCount: 4,
    sharedDiscoveries: 0,
    status: 'suggested',
  },
];

const socialFeatures: SocialFeature[] = [
  {
    id: 'following',
    title: 'Enhanced Following',
    description: 'Organize channels with custom categories and notification preferences',
    icon: Users,
    href: '/social/following',
    color: 'bg-blue-500',
    stats: '24 channels',
    isNew: true,
  },
  {
    id: 'polls',
    title: 'Interactive Polls',
    description: 'Create polls and engage with rich video reactions',
    icon: BarChart3,
    href: '/social/polls',
    color: 'bg-green-500',
    stats: '12 active polls',
    isNew: true,
  },
  {
    id: 'co-watching',
    title: 'Co-Watching Sessions',
    description: 'Watch videos together with synchronized playback and chat',
    icon: Play,
    href: '/social/co-watching',
    color: 'bg-purple-500',
    stats: '3 live sessions',
    isNew: true,
  },
  {
    id: 'curation',
    title: 'Curation Circles',
    description: 'Join interest-based groups for content recommendations',
    icon: Target,
    href: '/social/curation',
    color: 'bg-orange-500',
    stats: '8 circles joined',
    isNew: true,
  },
  {
    id: 'challenges',
    title: 'Community Challenges',
    description: 'Participate in time-limited creative prompts and competitions',
    icon: Trophy,
    href: '/social/challenges',
    color: 'bg-pink-500',
    stats: '5 active challenges',
    isNew: true,
  },
];

export default function SocialPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>(mockDiscoveries);
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const validateAuth = async () => {
      setIsChecking(true);
      const isValid = await checkAuth();
      if (!isValid) {
        router.push('/');
        return;
      }
      setIsChecking(false);
    };

    validateAuth();
  }, [checkAuth, router]);

  const toggleLike = (discoveryId: string) => {
    setDiscoveries(discoveries.map(discovery => 
      discovery.id === discoveryId 
        ? { 
            ...discovery, 
            isLiked: !discovery.isLiked,
            likes: discovery.isLiked ? discovery.likes - 1 : discovery.likes + 1
          }
        : discovery
    ));
  };

  const connectUser = (connectionId: string) => {
    setConnections(connections.map(connection =>
      connection.id === connectionId
        ? { ...connection, status: 'pending' as const }
        : connection
    ));
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Enhanced Social <span className="gradient-text">Hub</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Connect, engage, and discover content with advanced social features
          </p>
        </motion.div>

        {/* New Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              New Social Features
            </h2>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Recently Added
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={feature.href}>
                  <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        {feature.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">New</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {feature.stats}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Connections</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {connections.filter(c => c.status === 'connected').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Discoveries Shared</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {discoveries.length}
                  </p>
                </div>
                <Share2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Agent Collaborations</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">15</p>
                </div>
                <Bot className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="discoveries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discoveries">Recent Discoveries</TabsTrigger>
            <TabsTrigger value="connections">Your Network</TabsTrigger>
          </TabsList>

          <TabsContent value="discoveries" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {discoveries.map((discovery, index) => (
                <motion.div
                  key={discovery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={discovery.user.avatar} />
                            <AvatarFallback>
                              {discovery.user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {discovery.user.username}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {discovery.agentName}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(discovery.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-500">
                          {discovery.agentType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {discovery.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {discovery.description}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">YT</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {discovery.videoTitle}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              YouTube Video
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(discovery.id)}
                            className={discovery.isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${discovery.isLiked ? 'fill-current' : ''}`} />
                            {discovery.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {discovery.comments}
                          </Button>
                        </div>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {connections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarImage src={connection.avatar} />
                        <AvatarFallback className="text-lg">
                          {connection.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {connection.username}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">AI Agents</span>
                          <span className="font-medium">{connection.agentCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Discoveries</span>
                          <span className="font-medium">{connection.sharedDiscoveries}</span>
                        </div>
                      </div>

                      {connection.status === 'connected' && (
                        <Badge className="bg-green-500 mb-4">Connected</Badge>
                      )}
                      {connection.status === 'pending' && (
                        <Badge variant="outline" className="mb-4">Pending</Badge>
                      )}
                      {connection.status === 'suggested' && (
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => connectUser(connection.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}