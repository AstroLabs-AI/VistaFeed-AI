'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  MessageSquare, 
  TrendingUp,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { enhancedAIService, UserFeedback } from '@/lib/ai-services';

interface FeedbackSystemProps {
  videoId: string;
  agentId: string;
  userId: string;
  recommendation: {
    title: string;
    explanation: string;
    confidence: number;
    factors: string[];
  };
  onFeedbackSubmitted?: (feedback: UserFeedback) => void;
}

export function FeedbackSystem({
  videoId,
  agentId,
  userId,
  recommendation,
  onFeedbackSubmitted
}: FeedbackSystemProps) {
  const [feedback, setFeedback] = useState<{
    rating?: number;
    helpful?: boolean;
    comments?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailedFeedbackOpen, setIsDetailedFeedbackOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submitFeedback = async (feedbackType: 'like' | 'dislike' | 'detailed') => {
    setIsSubmitting(true);
    
    try {
      const feedbackData: UserFeedback = {
        userId,
        videoId,
        agentId,
        feedbackType: feedbackType === 'like' ? 'like' : feedbackType === 'dislike' ? 'dislike' : 'save',
        value: feedbackType === 'like' ? true : feedbackType === 'dislike' ? false : feedback.rating || 5,
        timestamp: new Date(),
        context: {
          session_duration: Math.random() * 3600, // Mock session duration
          previous_videos: [], // Would be populated with actual data
          device_type: 'desktop',
          time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'
        }
      };

      const result = await enhancedAIService.processFeedback(feedbackData);
      
      if (result.processed) {
        setHasSubmitted(true);
        onFeedbackSubmitted?.(feedbackData);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
      setIsDetailedFeedbackOpen(false);
    }
  };

  const submitDetailedFeedback = async () => {
    await submitFeedback('detailed');
  };

  if (hasSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <ThumbsUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-200">
              Thank you for your feedback!
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300">
              Your input helps improve future recommendations.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200/50 dark:border-blue-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Brain className="w-4 h-4" />
          <span>Help Improve Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Feedback */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Was this recommendation helpful?
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => submitFeedback('like')}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Yes</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => submitFeedback('dislike')}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>No</span>
            </Button>
            <Dialog open={isDetailedFeedbackOpen} onOpenChange={setIsDetailedFeedbackOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Detailed Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Detailed Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rate this recommendation (1-5 stars)
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          onClick={() => setFeedback({ ...feedback, rating: star })}
                          className={`p-1 ${
                            (feedback.rating || 0) >= star ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-5 h-5" fill="currentColor" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Additional Comments (Optional)
                    </label>
                    <Textarea
                      placeholder="Tell us what you liked or how we can improve..."
                      value={feedback.comments || ''}
                      onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDetailedFeedbackOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitDetailedFeedback} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Recommendation Explanation */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Why this was recommended:</h4>
            <Badge variant="outline" className="text-xs">
              {Math.round(recommendation.confidence * 100)}% confidence
            </Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {recommendation.explanation}
          </p>
          
          <div className="space-y-1">
            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">Key factors:</h5>
            <div className="grid grid-cols-1 gap-1">
              {recommendation.factors.slice(0, 3).map((factor, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <Lightbulb className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Impact */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Your feedback improves future recommendations</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-3 h-3" />
            <span>Learning in progress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}