'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bot, Brain, Search, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CreateAgentDialogProps {
  onAgentCreated?: (agent: any) => void;
}

const agentTypes = [
  {
    id: 'content_analyzer',
    name: 'Content Analyzer',
    description: 'Analyzes video content, extracts key information, and identifies topics',
    icon: Brain,
    color: 'bg-blue-500',
  },
  {
    id: 'recommendation_agent',
    name: 'Recommendation Agent',
    description: 'Finds and suggests videos based on your interests and viewing history',
    icon: Search,
    color: 'bg-green-500',
  },
  {
    id: 'summarization_agent',
    name: 'Summarization Agent',
    description: 'Creates concise summaries and key takeaways from video content',
    icon: MessageSquare,
    color: 'bg-purple-500',
  },
  {
    id: 'social_facilitator',
    name: 'Social Facilitator',
    description: 'Manages social interactions and collaborative learning features',
    icon: Bot,
    color: 'bg-orange-500',
  },
];

export function CreateAgentDialog({ onAgentCreated }: CreateAgentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAgent = async () => {
    if (!agentName || !selectedType) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          agentName,
          agentType: selectedType,
          configuration: {
            interests: [],
            preferences: {},
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onAgentCreated?.(data.agent);
        setIsOpen(false);
        setAgentName('');
        setSelectedType('');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Choose an agent type and give it a name to get started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agent Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Name</label>
            <Input
              placeholder="Enter a name for your agent..."
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
          </div>

          {/* Agent Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Agent Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agentTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${type.color} flex-shrink-0`}>
                          <type.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{type.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Type Info */}
          {selectedType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-primary">Selected</Badge>
                <span className="font-medium">
                  {agentTypes.find(t => t.id === selectedType)?.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {agentTypes.find(t => t.id === selectedType)?.description}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAgent}
              disabled={!agentName || !selectedType || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Agent</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}