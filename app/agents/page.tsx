'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Settings, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateAgentDialog } from '@/components/agents/create-agent-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface Agent {
  id: string;
  agentName: string;
  agentType: string;
  lastActive: Date;
  configuration: any;
  _count?: {
    memories: number;
    discoveries: number;
  };
}

const agentTypeColors = {
  'content_analyzer': 'bg-blue-500',
  'recommendation_agent': 'bg-green-500',
  'summarization_agent': 'bg-purple-500',
  'social_facilitator': 'bg-orange-500',
};

const agentTypeLabels = {
  'content_analyzer': 'Content Analyzer',
  'recommendation_agent': 'Recommendation Agent',
  'summarization_agent': 'Summarization Agent',
  'social_facilitator': 'Social Facilitator',
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      fetchAgents();
    };

    validateAuth();
  }, [checkAuth, router]);

  const fetchAgents = async () => {
    if (!accessToken) return;
    
    try {
      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentCreated = (newAgent: Agent) => {
    setAgents([newAgent, ...agents]);
  };

  const deleteAgent = async (agentId: string) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setAgents(agents.filter(agent => agent.id !== agentId));
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  if (isChecking || isLoading) {
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
              AI <span className="gradient-text">Agents</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create and manage your specialized AI agents for YouTube content analysis
            </p>
          </div>
          <CreateAgentDialog onAgentCreated={handleAgentCreated} />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Agents</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{agents.length}</p>
                </div>
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Agents</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{agents.length}</p>
                </div>
                <Play className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Memories</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {agents.reduce((sum, agent) => sum + (agent._count?.memories || 0), 0)}
                  </p>
                </div>
                <Settings className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${agentTypeColors[agent.agentType as keyof typeof agentTypeColors] || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.agentName}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {agentTypeLabels[agent.agentType as keyof typeof agentTypeLabels] || agent.agentType}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Memories</span>
                      <span className="font-medium">{agent._count?.memories || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Discoveries</span>
                      <span className="font-medium">{agent._count?.discoveries || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last Active</span>
                      <span className="font-medium">
                        {new Date(agent.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteAgent(agent.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {agents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No agents yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first AI agent to start analyzing YouTube content
            </p>
            <CreateAgentDialog onAgentCreated={handleAgentCreated} />
          </motion.div>
        )}
      </div>
    </div>
  );
}