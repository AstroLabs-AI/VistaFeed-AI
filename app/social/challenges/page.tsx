'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Users, 
  Star, 
  Plus, 
  Calendar,
  Target,
  Award,
  Zap,
  Camera,
  Edit3,
  Video,
  Music,
  Code,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in hours
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants: number;
  prize: string;
  requirements: string[];
  tags: string[];
  createdBy: {
    username: string;
    avatar: string;
  };
  isParticipating: boolean;
  submissions: number;
  status: 'upcoming' | 'active' | 'ended';
}

interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  submittedBy: {
    username: string;
    avatar: string;
  };
  title: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  submittedAt: Date;
  votes: number;
  hasVoted: boolean;
  rank?: number;
}

const challengeIcons = {
  'Video Creation': Video,
  'Photography': Camera,
  'Writing': Edit3,
  'Music': Music,
  'Coding': Code,
  'Art': Palette,
  'General': Target,
};

const difficultyColors = {
  'Easy': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'Hard': 'bg-red-500',
};

const statusColors = {
  'upcoming': 'bg-blue-500',
  'active': 'bg-green-500',
  'ended': 'bg-gray-500',
};

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'AI Explanation Challenge',
    description: 'Create a 3-minute video explaining a complex AI concept in simple terms that anyone can understand.',
    category: 'Video Creation',
    difficulty: 'Medium',
    timeLimit: 72,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    participants: 156,
    maxParticipants: 500,
    prize: '1000 coins + Featured Badge',
    requirements: ['3-5 minute video', 'Original content', 'Clear explanation'],
    tags: ['AI', 'Education', 'Video'],
    createdBy: {
      username: 'challenge_master',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    isParticipating: true,
    submissions: 89,
    status: 'active',
  },
  {
    id: '2',
    title: 'Code Poetry Contest',
    description: 'Write beautiful, functional code that solves a problem while being aesthetically pleasing and well-documented.',
    category: 'Coding',
    difficulty: 'Hard',
    timeLimit: 120,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
    participants: 67,
    maxParticipants: 200,
    prize: '1500 coins + Code Master Badge',
    requirements: ['Working code', 'Documentation', 'Creative approach'],
    tags: ['Programming', 'Creativity', 'Documentation'],
    createdBy: {
      username: 'code_artist',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    },
    isParticipating: false,
    submissions: 0,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Tech Photography Week',
    description: 'Capture the beauty of technology in everyday life. Show how tech integrates with our daily experiences.',
    category: 'Photography',
    difficulty: 'Easy',
    timeLimit: 168,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    participants: 234,
    maxParticipants: 1000,
    prize: '750 coins + Photographer Badge',
    requirements: ['Original photos', 'Tech theme', 'Brief description'],
    tags: ['Photography', 'Technology', 'Creativity'],
    createdBy: {
      username: 'photo_pro',
      avatar: 'https://img.freepik.com/premium-photo/headshot-smiling-computer-programmer_810293-341518.jpg?w=996',
    },
    isParticipating: false,
    submissions: 187,
    status: 'ended',
  },
];

const mockSubmissions: Submission[] = [
  {
    id: '1',
    challengeId: '1',
    challengeTitle: 'AI Explanation Challenge',
    submittedBy: {
      username: 'ai_educator',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    title: 'Neural Networks: How Your Brain Inspired AI',
    description: 'A fun and engaging explanation of how neural networks work, using everyday analogies and visual demonstrations.',
    videoUrl: 'https://example.com/video1',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    votes: 89,
    hasVoted: true,
    rank: 1,
  },
  {
    id: '2',
    challengeId: '1',
    challengeTitle: 'AI Explanation Challenge',
    submittedBy: {
      username: 'tech_teacher',
      avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    },
    title: 'Machine Learning in 3 Minutes',
    description: 'Breaking down machine learning concepts using simple examples from cooking and sports.',
    videoUrl: 'https://example.com/video2',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    votes: 67,
    hasVoted: false,
    rank: 2,
  },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedTab, setSelectedTab] = useState('active');
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
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

  const joinChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { 
            ...challenge, 
            isParticipating: true, 
            participants: challenge.participants + 1 
          }
        : challenge
    ));
  };

  const leaveChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { 
            ...challenge, 
            isParticipating: false, 
            participants: challenge.participants - 1 
          }
        : challenge
    ));
  };

  const voteSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(submission =>
      submission.id === submissionId
        ? {
            ...submission,
            hasVoted: !submission.hasVoted,
            votes: submission.hasVoted ? submission.votes - 1 : submission.votes + 1
          }
        : submission
    ));
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getProgress = (challenge: Challenge) => {
    const total = challenge.endDate.getTime() - challenge.startDate.getTime();
    const elapsed = Date.now() - challenge.startDate.getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedTab === 'active') return challenge.status === 'active';
    if (selectedTab === 'upcoming') return challenge.status === 'upcoming';
    if (selectedTab === 'ended') return challenge.status === 'ended';
    if (selectedTab === 'participating') return challenge.isParticipating;
    return true;
  });

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
              Community <span className="gradient-text">Challenges</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Participate in time-limited creative challenges and showcase your skills
            </p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Challenge Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Entry title..." />
                  <Input placeholder="Description..." />
                  <Input placeholder="Video/Image URL..." />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Submit Entry</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateChallengeOpen} onOpenChange={setIsCreateChallengeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Challenge</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Challenge title..." />
                  <Input placeholder="Description..." />
                  <Input placeholder="Time limit (hours)..." type="number" />
                  <Input placeholder="Prize..." />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateChallengeOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Challenge</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Challenges</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {challenges.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Participating</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {challenges.filter(c => c.isParticipating).length}
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
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Submissions</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {challenges.reduce((sum, challenge) => sum + challenge.submissions, 0)}
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Badges Earned</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">7</p>
                </div>
                <Trophy className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
            <TabsTrigger value="participating">My Challenges</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {selectedTab === 'submissions' ? (
              <div className="space-y-6">
                {submissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={submission.submittedBy.avatar} />
                              <AvatarFallback>
                                {submission.submittedBy.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {submission.submittedBy.username}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {submission.challengeTitle}
                                </Badge>
                                {submission.rank && (
                                  <Badge className="bg-yellow-500 text-white text-xs">
                                    #{submission.rank}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(submission.submittedAt)}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {submission.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {submission.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => voteSubmission(submission.id)}
                            className={submission.hasVoted ? 'text-blue-500' : ''}
                          >
                            <Star className={`w-4 h-4 mr-1 ${submission.hasVoted ? 'fill-current' : ''}`} />
                            {submission.votes} votes
                          </Button>
                          <Button variant="outline" size="sm">
                            View Entry
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge, index) => {
                  const CategoryIcon = challengeIcons[challenge.category as keyof typeof challengeIcons] || Target;
                  const difficultyColor = difficultyColors[challenge.difficulty];
                  const statusColor = statusColors[challenge.status];
                  
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                                <CategoryIcon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                  {challenge.title}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <Badge className={`${difficultyColor} text-white text-xs`}>
                                    {challenge.difficulty}
                                  </Badge>
                                  <Badge className={`${statusColor} text-white text-xs`}>
                                    {challenge.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {challenge.isParticipating && (
                              <Badge className="bg-green-500">Joined</Badge>
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                            {challenge.description}
                          </p>

                          {challenge.status === 'active' && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                <span className="font-medium">{getTimeRemaining(challenge.endDate)}</span>
                              </div>
                              <Progress value={getProgress(challenge)} className="h-2" />
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Participants</span>
                              <span className="font-medium">{challenge.participants}/{challenge.maxParticipants}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Submissions</span>
                              <span className="font-medium">{challenge.submissions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Prize</span>
                              <span className="font-medium text-yellow-600">{challenge.prize}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {challenge.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="pt-2">
                            {challenge.status === 'ended' ? (
                              <Button variant="outline" className="w-full" disabled>
                                Challenge Ended
                              </Button>
                            ) : challenge.isParticipating ? (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => leaveChallenge(challenge.id)}
                              >
                                Leave Challenge
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                onClick={() => joinChallenge(challenge.id)}
                                disabled={challenge.participants >= challenge.maxParticipants}
                              >
                                {challenge.participants >= challenge.maxParticipants ? 'Challenge Full' : 'Join Challenge'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}