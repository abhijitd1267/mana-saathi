import { useState } from 'react';
import { ClipboardList, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AssessmentType, PHQ9_QUESTIONS, GAD7_QUESTIONS } from '@/lib/types';
import { mockAssessments } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function Assessments() {
  const { toast } = useToast();
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const getQuestions = (type: AssessmentType) => {
    return type === 'PHQ9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  };

  const getScoreInterpretation = (type: AssessmentType, score: number) => {
    if (type === 'PHQ9') {
      if (score <= 4) return { level: 'Minimal', color: 'success' };
      if (score <= 9) return { level: 'Mild', color: 'warning' };
      if (score <= 14) return { level: 'Moderate', color: 'warning' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'destructive' };
      return { level: 'Severe', color: 'destructive' };
    } else {
      if (score <= 4) return { level: 'Minimal', color: 'success' };
      if (score <= 9) return { level: 'Mild', color: 'warning' };
      if (score <= 14) return { level: 'Moderate', color: 'warning' };
      return { level: 'Severe', color: 'destructive' };
    }
  };

  const startAssessment = (type: AssessmentType) => {
    setActiveAssessment(type);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    const questions = getQuestions(activeAssessment!);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const interpretation = getScoreInterpretation(activeAssessment!, score);
    
    // In a real app, this would save to the backend
    toast({
      title: `${activeAssessment} Assessment Complete`,
      description: `Your score: ${score} (${interpretation.level})`,
      variant: interpretation.color === 'destructive' ? 'destructive' : 'default'
    });

    setActiveAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (activeAssessment) {
    const questions = getQuestions(activeAssessment);
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{activeAssessment} Assessment</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {questions.length}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setActiveAssessment(null)}
              >
                Cancel
              </Button>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Over the last 2 weeks, how often have you been bothered by:
              </h3>
              <p className="text-foreground text-base leading-relaxed">
                {currentQ}
              </p>
            </div>

            <RadioGroup 
              value={answers[currentQuestion]?.toString()} 
              onValueChange={(value) => handleAnswer(parseInt(value))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="r0" />
                <Label htmlFor="r0" className="font-normal">Not at all</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1" className="font-normal">Several days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2" className="font-normal">More than half the days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r3" />
                <Label htmlFor="r3" className="font-normal">Nearly every day</Label>
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-6">
              <Button 
                variant="outline" 
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button 
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined}
                className="flex-1"
              >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-muted-foreground">
          Track your mental health with validated clinical assessments
        </p>
      </div>

      {/* Available Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-elevated transition-all duration-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>PHQ-9</CardTitle>
                <CardDescription>Depression screening questionnaire</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The PHQ-9 is a 9-question instrument for screening and measuring the severity of depression.
            </p>
            <Button onClick={() => startAssessment('PHQ9')} className="w-full">
              Take PHQ-9 Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <CardTitle>GAD-7</CardTitle>
                <CardDescription>Anxiety disorder screening tool</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The GAD-7 is a 7-question screening tool for identifying probable cases of anxiety disorders.
            </p>
            <Button onClick={() => startAssessment('GAD7')} className="w-full">
              Take GAD-7 Assessment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Assessment History
          </CardTitle>
          <CardDescription>Your recent assessment results and trends</CardDescription>
        </CardHeader>
        <CardContent>
          {mockAssessments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assessments yet</h3>
              <p className="text-muted-foreground">
                Take your first assessment to start tracking your mental health.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockAssessments.map((assessment) => {
                const interpretation = getScoreInterpretation(assessment.type, assessment.score);
                return (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <h4 className="font-medium">{assessment.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {assessment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{assessment.score}</p>
                        <Badge variant={interpretation.color as any}>
                          {interpretation.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-warning-foreground">Important Notice</h4>
              <p className="text-sm text-warning-foreground/80 mt-1">
                These assessments are screening tools and not diagnostic instruments. 
                If you're experiencing severe symptoms, please consult with a mental health professional 
                or contact crisis support immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}