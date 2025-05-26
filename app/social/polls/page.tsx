'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MessageSquare, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Laugh, 
  Angry, 
  Zap,
  Plus,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface Poll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  createdBy: {
    username: string;
    avatar: string;
  };
  createdAt: Date;
  expiresAt: Date;
  videoId?: string;
  videoTitle?: string;
  hasVoted: boolean;
  userVote?: string;
  category: string;
}

interface Reaction {
  id: string;
  type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry' | 'wow';
  count: number;
  userReacted: boolean;
}

interface VideoDiscussion {
  id: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  totalReactions: number;
  totalComments: number;
  reactions: Reaction[];
  topComment: {
    text: string;
    author: string;
    likes: number;
  };
  createdAt: Date;
}

const mockPolls: Poll[] = [
  {
    id: '1',
    question: 'Which AI technology will have the biggest impact in 2025?',
    options: [
      { id: 'a', text: 'Large Language Models', votes: 245, percentage: 42 },
      { id: 'b', text: 'Computer Vision', votes: 156, percentage: 27 },
      { id: 'c', text: 'Robotics', votes: 98, percentage: 17 },
      { id: 'd', text: 'Quantum AI', votes: 82, percentage: 14 },
    ],
    totalVotes: 581,
    createdBy: {
      username: 'ai_researcher',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 20),
    videoId: 'abc123',
    videoTitle: 'The Future of AI: Predictions for 2025',
    hasVoted: true,
    userVote: 'a',
    category: 'Technology',
  },
  {
    id: '2',
    question: 'Best programming language for beginners?',
    options: [
      { id: 'a', text: 'Python', votes: 342, percentage: 58 },
      { id: 'b', text: 'JavaScript', votes: 156, percentage: 26 },
      { id: 'c', text: 'Java', votes: 67, percentage: 11 },
      { id: 'd', text: 'C++', votes: 29, percentage: 5 },
    ],
    totalVotes: 594,
    createdBy: {
      username: 'code_mentor',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 16),
    hasVoted: false,
    category: 'Programming',
  },
];

const mockVideoDiscussions: VideoDiscussion[] = [
  {
    id: '1',
    videoId: 'xyz789',
    videoTitle: 'Machine Learning Fundamentals Explained',
    videoThumbnail: 'https://i.pinimg.com/originals/96/68/73/966873d7527c073d930c1559f1d19618.png',
    totalReactions: 1247,
    totalComments: 89,
    reactions: [
      { id: 'like', type: 'like', count: 856, userReacted: true },
      { id: 'love', type: 'love', count: 234, userReacted: false },
      { id: 'laugh', type: 'laugh', count: 67, userReacted: false },
      { id: 'wow', type: 'wow', count: 45, userReacted: false },
      { id: 'angry', type: 'angry', count: 23, userReacted: false },
      { id: 'dislike', type: 'dislike', count: 22, userReacted: false },
    ],
    topComment: {
      text: 'This explanation finally made neural networks click for me!',
      author: 'learning_enthusiast',
      likes: 156,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const reactionIcons = {
  like: ThumbsUp,
  dislike: ThumbsDown,
  love: Heart,
  laugh: Laugh,
  angry: Angry,
  wow: Zap,
};

const reactionColors = {
  like: 'text-blue-500',
  dislike: 'text-red-500',
  love: 'text-pink-500',
  laugh: 'text-yellow-500',
  angry: 'text-red-600',
  wow: 'text-purple-500',
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [videoDiscussions, setVideoDiscussions] = useState<VideoDiscussion[]>(mockVideoDiscussions);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
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

  const votePoll = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        const updatedOptions = poll.options.map(option => ({
          ...option,
          votes: option.id === optionId ? option.votes + 1 : option.votes,
        }));
        const totalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);
        const optionsWithPercentage = updatedOptions.map(option => ({
          ...option,
          percentage: Math.round((option.votes / totalVotes) * 100),
        }));
        
        return {
          ...poll,
          options: optionsWithPercentage,
          totalVotes,
          hasVoted: true,
          userVote: optionId,
        };
      }
      return poll;
    }));
  };

  const toggleReaction = (videoId: string, reactionType: string) => {
    setVideoDiscussions(videoDiscussions.map(discussion => {
      if (discussion.id === videoId) {
        const updatedReactions = discussion.reactions.map(reaction => {
          if (reaction.type === reactionType) {
            return {
              ...reaction,
              count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
              userReacted: !reaction.userReacted,
            };
          }
          // Remove user reaction from other types
          return reaction.userReacted ? { ...reaction, count: reaction.count - 1, userReacted: false } : reaction;
        });
        
        return {
          ...discussion,
          reactions: updatedReactions,
          totalReactions: updatedReactions.reduce((sum, r) => sum + r.count, 0),
        };
      }
      return discussion;
    }));
  };

  const addPollOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    const updated = [...newPollOptions];
    updated[index] = value;
    setNewPollOptions(updated);
  };

  const createPoll = () => {
    if (newPollQuestion.trim() && newPollOptions.filter(opt => opt.trim()).length >= 2) {
      const newPoll: Poll = {
        id: Date.now().toString(),
        question: newPollQuestion,
        options: newPollOptions.filter(opt => opt.trim()).map((text, index) => ({
          id: String.fromCharCode(97 + index),
          text,
          votes: 0,
          percentage: 0,
        })),
        totalVotes: 0,
        createdBy: {
          username: 'current_user',
          avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        hasVoted: false,
        category: 'General',
      };
      
      setPolls([newPoll, ...polls]);
      setNewPollQuestion('');
      setNewPollOptions(['', '']);
      setIsCreatePollOpen(false);
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Interactive <span className="gradient-text">Polls & Reactions</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Engage with the community through polls and rich video reactions
            </p>
          </div>
          <Dialog open={isCreatePollOpen} onOpenChange={setIsCreatePollOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Poll</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Poll question..."
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                />
                {newPollOptions.map((option, index) => (
                  <Input
                    key={index}
                    placeholder={`Option ${index + 1}...`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                  />
                ))}
                <Button variant="outline" onClick={addPollOption} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreatePollOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createPoll}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Polls</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{polls.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Votes</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
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
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Video Discussions</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{videoDiscussions.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Reactions</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {videoDiscussions.reduce((sum, discussion) => sum + discussion.totalReactions, 0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Polls Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Polls</h2>
            {polls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={poll.createdBy.avatar} />
                          <AvatarFallback>
                            {poll.createdBy.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {poll.createdBy.username}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {poll.category}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeRemaining(poll.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {poll.question}
                    </h3>

                    {poll.videoTitle && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Related to: {poll.videoTitle}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {poll.options.map((option) => (
                        <div key={option.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Button
                              variant={poll.hasVoted ? "ghost" : "outline"}
                              className={`flex-1 justify-start ${
                                poll.userVote === option.id ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500' : ''
                              }`}
                              onClick={() => votePoll(poll.id, option.id)}
                              disabled={poll.hasVoted}
                            >
                              {option.text}
                            </Button>
                            {poll.hasVoted && (
                              <span className="ml-3 text-sm font-medium">
                                {option.percentage}%
                              </span>
                            )}
                          </div>
                          {poll.hasVoted && (
                            <Progress value={option.percentage} className="h-2" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{poll.totalVotes} votes</span>
                      {poll.hasVoted && (
                        <Badge className="bg-green-500">Voted</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Video Discussions Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Discussions</h2>
            {videoDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        <div className="absolute inset-0 bg-red-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">YT</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {discussion.videoTitle}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {discussion.totalComments} comments • {discussion.totalReactions} reactions
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{discussion.topComment.text}"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        - {discussion.topComment.author} ({discussion.topComment.likes} likes)
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {discussion.reactions.map((reaction) => {
                        const Icon = reactionIcons[reaction.type];
                        return (
                          <Button
                            key={reaction.id}
                            variant="ghost"
                            size="sm"
                            className={`flex items-center space-x-1 ${
                              reaction.userReacted ? reactionColors[reaction.type] : 'text-gray-500'
                            }`}
                            onClick={() => toggleReaction(discussion.id, reaction.type)}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{reaction.count}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}