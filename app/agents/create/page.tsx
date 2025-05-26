'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Brain, Search, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const agentTypes = [
  {
    id: 'content_analyzer',
    name: 'Content Analyzer',
    description: 'Analyzes video content, extracts key information, and identifies topics. Perfect for understanding complex educational content.',
    icon: Brain,
    color: 'bg-blue-500',
    features: ['Topic Extraction', 'Content Summarization', 'Difficulty Assessment', 'Key Points Identification'],
  },
  {
    id: 'recommendation_agent',
    name: 'Recommendation Agent',
    description: 'Finds and suggests videos based on your interests and viewing history. Discovers content you\'ll love.',
    icon: Search,
    color: 'bg-green-500',
    features: ['Personalized Recommendations', 'Interest Matching', 'Trend Analysis', 'Content Discovery'],
  },
  {
    id: 'summarization_agent',
    name: 'Summarization Agent',
    description: 'Creates concise summaries and key takeaways from video content. Save time with instant insights.',
    icon: MessageSquare,
    color: 'bg-purple-500',
    features: ['Video Summaries', 'Key Takeaways', 'Time-stamped Notes', 'Quick Insights'],
  },
  {
    id: 'social_facilitator',
    name: 'Social Facilitator',
    description: 'Manages social interactions and collaborative learning features. Connect and learn with others.',
    icon: Bot,
    color: 'bg-orange-500',
    features: ['Social Learning', 'Knowledge Sharing', 'Collaboration', 'Community Building'],
  },
];

export default function CreateAgentPage() {
  const [agentName, setAgentName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, checkAuth, accessToken } = useAuth();
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

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleCreateAgent = async () => {
    if (!agentName || !selectedType || !accessToken) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          agentName,
          agentType: selectedType,
          configuration: {
            interests,
            preferences: {},
            createdAt: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        router.push('/agents');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    } finally {
      setIsLoading(false);
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

  const selectedAgentType = agentTypes.find(type => type.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/agents">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New <span className="gradient-text">AI Agent</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Choose an agent type and customize it to match your learning goals
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Agent Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Agent Name</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter a unique name for your agent..."
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Agent Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Agent Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agentTypes.map((type, index) => (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedType === type.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl ${type.color} flex-shrink-0`}>
                              <type.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {type.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {type.features.map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Type Details */}
          {selectedAgentType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${selectedAgentType.color}`}>
                      <selectedAgentType.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedAgentType.name}</h3>
                      <Badge className="bg-primary">Selected</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedAgentType.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Interests & Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add an interest or topic..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button onClick={addInterest} disabled={!newInterest.trim()}>
                    Add
                  </Button>
                </div>
                
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Create Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end space-x-4"
          >
            <Link href="/agents">
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleCreateAgent}
              disabled={!agentName || !selectedType || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Agent...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Create Agent</span>
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}