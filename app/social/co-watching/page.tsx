'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Users, 
  MessageSquare, 
  Share2, 
  Settings, 
  Volume2,
  Maximize,
  Clock,
  UserPlus,
  Crown,
  Mic,
  MicOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';

interface CoWatchingSession {
  id: string;
  title: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  videoDuration: string;
  currentTime: number;
  isPlaying: boolean;
  host: {
    username: string;
    avatar: string;
  };
  participants: {
    id: string;
    username: string;
    avatar: string;
    isHost: boolean;
    joinedAt: Date;
  }[];
  maxParticipants: number;
  isPublic: boolean;
  createdAt: Date;
  status: 'waiting' | 'playing' | 'paused' | 'ended';
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'reaction';
}

const mockSessions: CoWatchingSession[] = [
  {
    id: '1',
    title: 'AI Learning Session',
    videoId: 'abc123',
    videoTitle: 'Introduction to Machine Learning - Complete Course',
    videoThumbnail: 'https://i.pinimg.com/originals/96/68/73/966873d7527c073d930c1559f1d19618.png',
    videoDuration: '2:45:30',
    currentTime: 1847, // 30:47
    isPlaying: true,
    host: {
      username: 'ai_teacher',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    participants: [
      {
        id: '1',
        username: 'ai_teacher',
        avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
        isHost: true,
        joinedAt: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        id: '2',
        username: 'student_alex',
        avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
        isHost: false,
        joinedAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: '3',
        username: 'ml_enthusiast',
        avatar: 'https://img.freepik.com/premium-photo/headshot-smiling-computer-programmer_810293-341518.jpg?w=996',
        isHost: false,
        joinedAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    ],
    maxParticipants: 10,
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    status: 'playing',
  },
  {
    id: '2',
    title: 'Quantum Physics Study Group',
    videoId: 'def456',
    videoTitle: 'Quantum Computing Explained: The Future is Here',
    videoThumbnail: 'https://pbs.twimg.com/media/E490g5bWEAMs1I0.jpg',
    videoDuration: '45:20',
    currentTime: 0,
    isPlaying: false,
    host: {
      username: 'quantum_prof',
      avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    },
    participants: [
      {
        id: '1',
        username: 'quantum_prof',
        avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
        isHost: true,
        joinedAt: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        id: '2',
        username: 'physics_student',
        avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
        isHost: false,
        joinedAt: new Date(Date.now() - 1000 * 60 * 5),
      },
    ],
    maxParticipants: 6,
    isPublic: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    status: 'waiting',
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    username: 'ai_teacher',
    avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
    message: 'Welcome everyone! We\'re about to start the neural networks section.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'message',
  },
  {
    id: '2',
    userId: '2',
    username: 'student_alex',
    avatar: 'https://i.pinimg.com/originals/8d/f5/83/8df583c007f822eb49c6423fc8116571.jpg',
    message: 'Great! I\'ve been looking forward to this part.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    type: 'message',
  },
  {
    id: '3',
    userId: 'system',
    username: 'System',
    avatar: '',
    message: 'ml_enthusiast joined the session',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: 'system',
  },
  {
    id: '4',
    userId: '3',
    username: 'ml_enthusiast',
    avatar: 'https://img.freepik.com/premium-photo/headshot-smiling-computer-programmer_810293-341518.jpg?w=996',
    message: 'Hi everyone! Did I miss anything important?',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    type: 'message',
  },
];

export default function CoWatchingPage() {
  const [sessions, setSessions] = useState<CoWatchingSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<CoWatchingSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
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

  const joinSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.participants.length < session.maxParticipants) {
      setSelectedSession(session);
    }
  };

  const leaveSession = () => {
    setSelectedSession(null);
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedSession) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current_user',
        username: 'You',
        avatar: 'https://i.pinimg.com/originals/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg',
        message: newMessage,
        timestamp: new Date(),
        type: 'message',
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'waiting': return 'bg-blue-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
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

  if (selectedSession) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <div className="flex h-screen">
          {/* Video Player Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Player */}
            <div className="flex-1 bg-black relative">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">{selectedSession.videoTitle}</h3>
                  <p className="text-gray-400">
                    {formatTime(selectedSession.currentTime)} / {selectedSession.videoDuration}
                  </p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      {selectedSession.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Volume2 className="w-5 h-5" />
                    </Button>
                    <span className="text-sm">
                      {formatTime(selectedSession.currentTime)} / {selectedSession.videoDuration}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-white hover:bg-white/20 ${isMicEnabled ? 'bg-red-500/20' : ''}`}
                      onClick={() => setIsMicEnabled(!isMicEnabled)}
                    >
                      {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Settings className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Maximize className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-white/20"
                      onClick={leaveSession}
                    >
                      Leave
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 bg-gray-900 flex flex-col">
            {/* Session Info */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold mb-2">{selectedSession.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{selectedSession.participants.length}/{selectedSession.maxParticipants} viewers</span>
                <Badge className={`${getStatusColor(selectedSession.status)} text-white`}>
                  {selectedSession.status}
                </Badge>
              </div>
            </div>

            {/* Participants */}
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-white font-medium mb-3">Participants</h4>
              <div className="space-y-2">
                {selectedSession.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs">
                        {participant.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm flex-1">{participant.username}</span>
                    {participant.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  {message.type === 'system' ? (
                    <div className="text-center text-gray-400 text-xs">
                      {message.message}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="text-xs">
                            {message.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm font-medium">{message.username}</span>
                        <span className="text-gray-400 text-xs">
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm ml-7">{message.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <Button onClick={sendMessage} size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
              Co-Watching <span className="gradient-text">Sessions</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Watch videos together with friends and engage in real-time discussions
            </p>
          </div>
          <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Co-Watching Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Session title..." />
                <Input placeholder="YouTube video URL..." />
                <Input placeholder="Max participants..." type="number" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateSessionOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Session</Button>
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
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Sessions</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {sessions.filter(s => s.status !== 'ended').length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Participants</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {sessions.reduce((sum, session) => sum + session.participants.length, 0)}
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
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Public Sessions</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {sessions.filter(s => s.isPublic).length}
                  </p>
                </div>
                <Share2 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Watch Time</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">24h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className={`${getStatusColor(session.status)} text-white`}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                      {session.videoDuration}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {session.videoTitle}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={session.host.avatar} />
                      <AvatarFallback className="text-xs">
                        {session.host.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {session.host.username}
                    </span>
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{session.participants.length}/{session.maxParticipants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatRelativeTime(session.createdAt)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => joinSession(session.id)}
                    disabled={session.participants.length >= session.maxParticipants}
                  >
                    {session.participants.length >= session.maxParticipants ? (
                      <>Session Full</>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Session
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}