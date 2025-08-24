import { useState } from 'react';
import { Calendar, TrendingUp, Heart, Users, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser, mockJournalEntries, mockAssessments, mockPatients, mockRiskFlags } from '@/lib/mock-data';
import { EMOTIONS } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Patient Dashboard
  if (currentUser.role === 'patient') {
    const recentEntries = mockJournalEntries.slice(0, 3);
    const latestAssessment = mockAssessments[0];
    const weeklyEmotions = mockJournalEntries.slice(0, 7).reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const dominantEmotion = Object.entries(weeklyEmotions).sort(([, a], [, b]) => b - a)[0]?.[0] as keyof typeof EMOTIONS;
    return <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/90">
            You've been taking great care of your mental health. Here's your daily overview.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-elevated transition-all duration-200" onClick={() => navigate('/journal')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Quick Journal</h3>
                <p className="text-sm text-muted-foreground">Share how you're feeling</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-elevated transition-all duration-200" onClick={() => navigate('/assessments')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium">Take Assessment</h3>
                <p className="text-sm text-muted-foreground">Track your progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-elevated transition-all duration-200" onClick={() => navigate('/insights')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">View Insights</h3>
                <p className="text-sm text-muted-foreground">Understand patterns</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Week's Mood
              </CardTitle>
              <CardDescription>Your emotional patterns over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {dominantEmotion && <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-xl">
                  <span className="text-2xl">{EMOTIONS[dominantEmotion].emoji}</span>
                  <div>
                    <p className="font-medium">Most frequent: {EMOTIONS[dominantEmotion].label}</p>
                    <p className="text-sm text-muted-foreground">
                      {weeklyEmotions[dominantEmotion]} out of {Object.values(weeklyEmotions).reduce((a, b) => a + b, 0)} entries
                    </p>
                  </div>
                </div>}
              <div className="space-y-2">
                {Object.entries(weeklyEmotions).map(([emotion, count]) => <div key={emotion} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{EMOTIONS[emotion as keyof typeof EMOTIONS].emoji}</span>
                      <span className="text-sm">{EMOTIONS[emotion as keyof typeof EMOTIONS].label}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Recent Journal Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Journal Entries</CardTitle>
              <CardDescription>Your latest thoughts and reflections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEntries.map(entry => <div key={entry.id} className="p-3 border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{EMOTIONS[entry.emotion].emoji}</span>
                      <span className="text-sm font-medium">{EMOTIONS[entry.emotion].label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.content}
                  </p>
                </div>)}
              <Button variant="outline" onClick={() => navigate('/journal')} className="w-full bg-red-100">
                View All Entries
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Progress */}
        {latestAssessment && <Card>
            <CardHeader>
              <CardTitle>Latest Assessment Results</CardTitle>
              <CardDescription>Your recent {latestAssessment.type} assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{latestAssessment.score}</p>
                  <p className="text-sm text-muted-foreground">
                    Score on {latestAssessment.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/assessments')} className="bg-red-100">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>}
      </div>;
  }

  // Therapist Dashboard
  if (currentUser.role === 'therapist') {
    const activeRiskFlags = mockRiskFlags.filter(flag => !flag.acknowledgedBy);
    return <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-calm rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, Dr. {currentUser.name.split(' ')[1]}! 👩‍⚕️
          </h1>
          <p className="text-white/90">
            You have {mockPatients.length} patients and {activeRiskFlags.length} pending risk flags to review.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockPatients.length}</p>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{activeRiskFlags.length}</p>
                  <p className="text-sm text-muted-foreground">Risk Flags</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">73%</p>
                  <p className="text-sm text-muted-foreground">Avg. Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Journal Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Risk Flags
              </CardTitle>
              <CardDescription>Patients requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeRiskFlags.map(flag => {
              const patient = mockPatients.find(p => p.id === flag.patientId);
              return <div key={flag.id} className="flex items-center gap-3 p-3 border border-destructive/20 rounded-xl bg-destructive/5">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={patient?.avatar} />
                      <AvatarFallback>{patient?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{patient?.name}</p>
                      <p className="text-sm text-muted-foreground">{flag.note}</p>
                    </div>
                    <Badge variant="destructive">{flag.severity}</Badge>
                  </div>;
            })}
              <Button variant="outline" className="w-full" onClick={() => navigate('/risk-flags')}>
                View All Risk Flags
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>Recent patient activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPatients.slice(0, 3).map(patient => <div key={patient.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">Last entry: 2 hours ago</p>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-lg">😊</span>
                    <span className="text-lg">😌</span>
                    <span className="text-lg">😢</span>
                  </div>
                </div>)}
              <Button variant="outline" className="w-full">
                View All Patients
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div>Dashboard</div>;
}