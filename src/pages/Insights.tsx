import { TrendingUp, Calendar, Heart, Brain, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockJournalEntries, mockAssessments } from '@/lib/mock-data';
import { EMOTIONS } from '@/lib/types';

export default function Insights() {
  // Analyze emotion patterns
  const emotionCounts = mockJournalEntries.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = mockJournalEntries.length;
  const dominantEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  // Weekly trend
  const last7Days = mockJournalEntries.filter(entry => {
    const daysDiff = (new Date().getTime() - entry.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  const weeklyEmotions = last7Days.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Common themes from journal content
  const commonWords = mockJournalEntries
    .flatMap(entry => entry.content.toLowerCase().split(/\s+/))
    .filter(word => word.length > 4 && !['feeling', 'really', 'today', 'about'].includes(word))
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topThemes = Object.entries(commonWords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Assessment trend
  const latestAssessment = mockAssessments[0];
  const previousAssessment = mockAssessments[1];
  
  const assessmentTrend = latestAssessment && previousAssessment 
    ? latestAssessment.score - previousAssessment.score
    : null;

  // Generate AI-style insights (placeholder logic)
  const insights = [
    {
      title: "Sleep Patterns Affecting Mood",
      description: "Your entries suggest sleep quality is impacting your emotional state. Consider tracking sleep more consistently.",
      type: "pattern",
      confidence: "high"
    },
    {
      title: "Mid-week Energy Dips",
      description: "You tend to report lower energy levels on Tuesdays and Wednesdays. This might be due to work stress.",
      type: "trend",
      confidence: "medium"
    },
    {
      title: "Social Connection Benefits",
      description: "Entries mentioning family or friends correlate with more positive emotions. Consider scheduling more social time.",
      type: "correlation",
      confidence: "high"
    }
  ];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">
          AI-powered analysis of your mental health patterns and trends
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalEntries}</p>
                <p className="text-sm text-muted-foreground">Journal Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{last7Days.length}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {dominantEmotion && (
                <>
                  <span className="text-2xl">{EMOTIONS[dominantEmotion as keyof typeof EMOTIONS].emoji}</span>
                  <div>
                    <p className="text-lg font-bold">{EMOTIONS[dominantEmotion as keyof typeof EMOTIONS].label}</p>
                    <p className="text-sm text-muted-foreground">Dominant Mood</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">
                  {assessmentTrend !== null 
                    ? (assessmentTrend > 0 ? `+${assessmentTrend}` : assessmentTrend)
                    : 'N/A'
                  }
                </p>
                <p className="text-sm text-muted-foreground">Assessment Trend</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Patterns and trends discovered in your mental health data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border border-border rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <Badge variant={getConfidenceColor(insight.confidence) as any}>
                  {insight.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {insight.type}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emotion Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <CardDescription>Your emotional patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(emotionCounts).map(([emotion, count]) => {
                const percentage = (count / totalEntries) * 100;
                const emotionData = EMOTIONS[emotion as keyof typeof EMOTIONS];
                return (
                  <div key={emotion} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emotionData.emoji}</span>
                      <span className="text-sm font-medium">{emotionData.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${emotionData.color} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Your emotions in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(weeklyEmotions).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No recent entries</h4>
                <p className="text-muted-foreground">
                  Add journal entries to see weekly insights.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(weeklyEmotions).map(([emotion, count]) => {
                  const emotionData = EMOTIONS[emotion as keyof typeof EMOTIONS];
                  return (
                    <div key={emotion} className="flex items-center justify-between p-2 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{emotionData.emoji}</span>
                        <span className="text-sm font-medium">{emotionData.label}</span>
                      </div>
                      <Badge variant="outline">{count} entries</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Common Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Common Themes</CardTitle>
          <CardDescription>Frequently mentioned topics in your journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          {topThemes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Not enough journal entries to identify themes yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topThemes.map(([word, count]) => (
                <Badge key={word} variant="outline" className="text-sm">
                  {word} ({count})
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Brain className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-accent-foreground">AI Insights Disclaimer</h4>
              <p className="text-sm text-accent-foreground/80 mt-1">
                These insights are generated using pattern analysis and should not replace professional medical advice. 
                Always consult with a healthcare provider for personalized guidance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}