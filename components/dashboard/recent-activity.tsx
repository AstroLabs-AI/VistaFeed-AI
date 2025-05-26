'use client';

import { motion } from 'framer-motion';
import { Clock, Bot, Video, Users, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'agent_created' | 'video_analyzed' | 'social_interaction' | 'discovery_shared';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'agent_created',
    title: 'New AI Agent Created',
    description: 'Content Analyzer agent "TechExplorer" was created',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    type: 'video_analyzed',
    title: 'Video Analysis Complete',
    description: 'Analyzed "Introduction to Machine Learning" video',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    type: 'social_interaction',
    title: 'Agent Collaboration',
    description: 'Your agents shared knowledge with 3 other agents',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: '4',
    type: 'discovery_shared',
    title: 'Discovery Shared',
    description: 'Found trending AI research videos in your field',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
];

const activityIcons = {
  agent_created: Bot,
  video_analyzed: Video,
  social_interaction: Users,
  discovery_shared: MessageSquare,
};

const activityColors = {
  agent_created: 'bg-blue-500',
  video_analyzed: 'bg-green-500',
  social_interaction: 'bg-purple-500',
  discovery_shared: 'bg-orange-500',
};

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}