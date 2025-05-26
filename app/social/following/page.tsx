'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Bell, 
  BellOff, 
  Plus, 
  Edit3, 
  Folder, 
  Filter,
  Search,
  Settings,
  Star,
  Trash2
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
import Image from 'next/image';

interface FollowedChannel {
  id: string;
  name: string;
  avatar: string;
  subscriberCount: string;
  videoCount: number;
  lastVideoDate: Date;
  category: string;
  notificationsEnabled: boolean;
  isVerified: boolean;
  description: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  channelCount: number;
}

const mockChannels: FollowedChannel[] = [
  {
    id: '1',
    name: 'AI Academy',
    avatar: 'https://static.vecteezy.com/system/resources/previews/036/392/006/original/digital-brain-ai-logo-template-free-vector.jpg',
    subscriberCount: '2.5M',
    videoCount: 342,
    lastVideoDate: new Date(Date.now() - 1000 * 60 * 60 * 6),
    category: 'Education',
    notificationsEnabled: true,
    isVerified: true,
    description: 'Learn AI and machine learning with practical examples',
  },
  {
    id: '2',
    name: 'Quantum Science',
    avatar: 'https://i.pinimg.com/originals/c0/9d/1f/c09d1fe6eb6188d7fce7aa4d686cd043.jpg',
    subscriberCount: '1.8M',
    videoCount: 156,
    lastVideoDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
    category: 'Science',
    notificationsEnabled: false,
    isVerified: true,
    description: 'Exploring the fascinating world of quantum physics',
  },
  {
    id: '3',
    name: 'Code Masters',
    avatar: 'https://i.ytimg.com/vi/YZ46BRmMFdw/maxresdefault.jpg',
    subscriberCount: '3.2M',
    videoCount: 789,
    lastVideoDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    category: 'Programming',
    notificationsEnabled: true,
    isVerified: true,
    description: 'Master programming with comprehensive tutorials',
  },
  {
    id: '4',
    name: 'Tech Reviews Pro',
    avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    subscriberCount: '4.1M',
    videoCount: 523,
    lastVideoDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    category: 'Technology',
    notificationsEnabled: true,
    isVerified: true,
    description: 'In-depth reviews of the latest technology',
  },
];

const mockCategories: Category[] = [
  { id: 'education', name: 'Education', color: 'bg-blue-500', channelCount: 8 },
  { id: 'science', name: 'Science', color: 'bg-green-500', channelCount: 5 },
  { id: 'programming', name: 'Programming', color: 'bg-purple-500', channelCount: 12 },
  { id: 'technology', name: 'Technology', color: 'bg-orange-500', channelCount: 6 },
  { id: 'entertainment', name: 'Entertainment', color: 'bg-pink-500', channelCount: 3 },
];

export default function FollowingPage() {
  const [channels, setChannels] = useState<FollowedChannel[]>(mockChannels);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
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

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           channel.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const toggleNotifications = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, notificationsEnabled: !channel.notificationsEnabled }
        : channel
    ));
  };

  const createCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName,
        color: 'bg-gray-500',
        channelCount: 0,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsCreateCategoryOpen(false);
    }
  };

  const formatLastVideo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Enhanced <span className="gradient-text">Following</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Organize your followed channels with custom categories and notification preferences
              </p>
            </div>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createCategory}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Notification Settings</span>
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Folder className="w-4 h-4" />
                <span>All ({channels.length})</span>
              </TabsTrigger>
              {categories.slice(0, 5).map((category) => (
                <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span>{category.name} ({category.channelCount})</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Channels</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{channels.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Notifications On</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {channels.filter(c => c.notificationsEnabled).length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Categories</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{categories.length}</p>
                </div>
                <Folder className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Today</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {channels.filter(c => 
                      (Date.now() - c.lastVideoDate.getTime()) < 24 * 60 * 60 * 1000
                    ).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={channel.avatar} />
                          <AvatarFallback>
                            {channel.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {channel.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {channel.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {channel.subscriberCount} subscribers
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNotifications(channel.id)}
                      className={channel.notificationsEnabled ? 'text-blue-600' : 'text-gray-400'}
                    >
                      {channel.notificationsEnabled ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {channel.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {channel.category}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatLastVideo(channel.lastVideoDate)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Videos</span>
                      <span className="font-medium">{channel.videoCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last Upload</span>
                      <span className="font-medium">{formatLastVideo(channel.lastVideoDate)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChannels.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No channels found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search or category filter
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Follow New Channels
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}