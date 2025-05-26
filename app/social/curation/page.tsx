'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Star, 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  Code,
  Beaker,
  Gamepad2,
  Music,
  Camera,
  TrendingUp,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';

interface CurationCircle {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  isJoined: boolean;
  createdBy: {
    username: string;
    avatar: string;
  };
  recentRecommendations: number;
  totalRecommendations: number;
  tags: string[];
  createdAt: Date;
  lastActivity: Date;
}

interface Recommendation {
  id: string;
  circleId: string;
  circleName: string;
  videoTitle: string;
  videoThumbnail: string;
  recommendedBy: {
    username: string;
    avatar: string;
  };
  description: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: Date;
  tags: string[];
}

const categoryIcons = {
  'Education': BookOpen,
  'Technology': Code,
  'Science': Beaker,
  'Gaming': Gamepad2,
  'Music': Music,
  'Photography': Camera,
  'General': Target,
};

const categoryColors = {
  'Education': 'bg-blue-500',
  'Technology': 'bg-green-500',
  'Science': 'bg-purple-500',
  'Gaming': 'bg-red-500',
  'Music': 'bg-pink-500',
  'Photography': 'bg-yellow-500',
  'General': 'bg-gray-500',
};

const mockCircles: CurationCircle[] = [
  {
    id: '1',
    name: 'AI & Machine Learning',
    description: 'Discover the latest in artificial intelligence, machine learning algorithms, and deep learning techniques.',
    category: 'Technology',
    memberCount: 1247,
    maxMembers: 2000,
    isPublic: true,
    isJoined: true,
    createdBy: {
      username: 'ai_researcher',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    recentRecommendations: 12,
    totalRecommendations: 456,
    tags: ['AI', 'Machine Learning', 'Neural Networks', 'Deep Learning'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    name: 'Quantum Physics Enthusiasts',
    description: 'Explore quantum mechanics, quantum computing, and the fascinating world of quantum phenomena.',
    category: 'Science',
    memberCount: 892,
    maxMembers: 1500,
    isPublic: true,
    isJoined: false,
    createdBy: {
      username: 'quantum_prof',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    },
    recentRecommendations: 8,
    totalRecommendations: 234,
    tags: ['Quantum Physics', 'Quantum Computing', 'Physics', 'Science'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: 'Web Development Masters',
    description: 'Share and discover the best web development tutorials, frameworks, and coding practices.',
    category: 'Technology',
    memberCount: 2156,
    maxMembers: 3000,
    isPublic: true,
    isJoined: true,
    createdBy: {
      username: 'fullstack_dev',
      avatar: 'https://img.freepik.com/premium-photo/headshot-smiling-computer-programmer_810293-341518.jpg?w=996',
    },
    recentRecommendations: 18,
    totalRecommendations: 789,
    tags: ['Web Development', 'JavaScript', 'React', 'Node.js'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    lastActivity: new Date(Date.now() - 1000 * 60 * 15),
  },
];

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    circleId: '1',
    circleName: 'AI & Machine Learning',
    videoTitle: 'Transformer Architecture Explained: Attention is All You Need',
    videoThumbnail: 'https://i.pinimg.com/originals/96/68/73/966873d7527c073d930c1559f1d19618.png',
    recommendedBy: {
      username: 'ml_expert',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    description: 'Excellent breakdown of the transformer architecture that revolutionized NLP. Perfect for understanding attention mechanisms.',
    likes: 89,
    comments: 23,
    isLiked: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    tags: ['Transformers', 'Attention', 'NLP'],
  },
  {
    id: '2',
    circleId: '3',
    circleName: 'Web Development Masters',
    videoTitle: 'Next.js 14 Complete Tutorial: App Router & Server Components',
    videoThumbnail: 'https://i.pinimg.com/736x/f2/46/c1/f246c12cb2426fadceb71b1a34955f54.jpg',
    recommendedBy: {
      username: 'react_ninja',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    },
    description: 'Comprehensive guide to Next.js 14 features. Great for developers transitioning from pages to app router.',
    likes: 156,
    comments: 42,
    isLiked: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    tags: ['Next.js', 'React', 'App Router'],
  },
];

export default function CurationPage() {
  const [circles, setCircles] = useState<CurationCircle[]>(mockCircles);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateCircleOpen, setIsCreateCircleOpen] = useState(false);
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

  const filteredCircles = circles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         circle.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || circle.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const joinCircle = (circleId: string) => {
    setCircles(circles.map(circle =>
      circle.id === circleId
        ? { ...circle, isJoined: true, memberCount: circle.memberCount + 1 }
        : circle
    ));
  };

  const leaveCircle = (circleId: string) => {
    setCircles(circles.map(circle =>
      circle.id === circleId
        ? { ...circle, isJoined: false, memberCount: circle.memberCount - 1 }
        : circle
    ));
  };

  const toggleLike = (recommendationId: string) => {
    setRecommendations(recommendations.map(rec =>
      rec.id === recommendationId
        ? {
            ...rec,
            isLiked: !rec.isLiked,
            likes: rec.isLiked ? rec.likes - 1 : rec.likes + 1
          }
        : rec
    ));
  };

  const categories = ['all', 'Technology', 'Science', 'Education', 'Gaming', 'Music', 'Photography'];

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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Content Curation <span className="gradient-text">Circles</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join interest-based communities for personalized content recommendations
            </p>
          </div>
          <Dialog open={isCreateCircleOpen} onOpenChange={setIsCreateCircleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Circle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Curation Circle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Circle name..." />
                <Input placeholder="Description..." />
                <Input placeholder="Tags (comma separated)..." />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateCircleOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Circle</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                <Filter className="w-4 h-4 mr-1" />
                {category === 'all' ? 'All' : category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Joined Circles</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {circles.filter(c => c.isJoined).length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Members</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {circles.reduce((sum, circle) => sum + circle.memberCount, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Recommendations</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {recommendations.length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Today</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {circles.filter(c => 
                      (Date.now() - c.lastActivity.getTime()) < 24 * 60 * 60 * 1000
                    ).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="circles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="circles">Browse Circles</TabsTrigger>
            <TabsTrigger value="recommendations">Latest Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="circles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCircles.map((circle, index) => {
                const CategoryIcon = categoryIcons[circle.category as keyof typeof categoryIcons] || Target;
                const categoryColor = categoryColors[circle.category as keyof typeof categoryColors] || 'bg-gray-500';
                
                return (
                  <motion.div
                    key={circle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-xl ${categoryColor}`}>
                              <CategoryIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {circle.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {circle.category}
                              </Badge>
                            </div>
                          </div>
                          {circle.isJoined && (
                            <Badge className="bg-green-500">Joined</Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                          {circle.description}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {circle.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {circle.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{circle.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Members</span>
                            <span className="font-medium">{circle.memberCount}/{circle.maxMembers}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Recommendations</span>
                            <span className="font-medium">{circle.totalRecommendations}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Last Activity</span>
                            <span className="font-medium">{formatRelativeTime(circle.lastActivity)}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          {circle.isJoined ? (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => leaveCircle(circle.id)}
                            >
                              Leave Circle
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              onClick={() => joinCircle(circle.id)}
                              disabled={circle.memberCount >= circle.maxMembers}
                            >
                              {circle.memberCount >= circle.maxMembers ? 'Circle Full' : 'Join Circle'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-6">
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={recommendation.recommendedBy.avatar} />
                            <AvatarFallback>
                              {recommendation.recommendedBy.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {recommendation.recommendedBy.username}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {recommendation.circleName}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(recommendation.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">YT</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {recommendation.videoTitle}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {recommendation.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {recommendation.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(recommendation.id)}
                            className={recommendation.isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${recommendation.isLiked ? 'fill-current' : ''}`} />
                            {recommendation.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {recommendation.comments}
                          </Button>
                        </div>
                        <Button variant="outline" size="sm">
                          Watch Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}