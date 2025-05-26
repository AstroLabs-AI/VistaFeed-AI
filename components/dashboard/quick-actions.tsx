'use client';

import { motion } from 'framer-motion';
import { Plus, Search, Share2, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const quickActions = [
  {
    title: 'Create Agent',
    description: 'Set up a new AI agent',
    icon: Plus,
    href: '/agents/create',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Search Videos',
    description: 'Find YouTube content',
    icon: Search,
    href: '/videos',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'Share Discovery',
    description: 'Share with community',
    icon: Share2,
    href: '/social',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'Settings',
    description: 'Customize preferences',
    icon: Settings,
    href: '/settings',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-300 group"
                >
                  <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}