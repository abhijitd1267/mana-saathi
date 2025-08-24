import { BarChart3, TrendingUp, Download, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/mock-data';

export default function Outcomes() {
  const currentUser = getCurrentUser();

  if (currentUser.role !== 'therapist') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              This page is only available to therapists and healthcare providers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treatment Outcomes</h1>
          <p className="text-muted-foreground">
            Track patient progress and treatment effectiveness
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-success" />
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
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Active Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">-5.2</p>
                <p className="text-sm text-muted-foreground">Avg. PHQ-9 Change</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Outcomes Summary</CardTitle>
          <CardDescription>8-week treatment effectiveness analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">Outcomes Dashboard</h4>
            <p className="text-muted-foreground">
              Detailed analytics and patient progress tracking coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}