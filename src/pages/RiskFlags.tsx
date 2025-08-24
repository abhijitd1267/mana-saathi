import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter, Search, User, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { mockRiskFlags, mockPatients, getCurrentUser } from '@/lib/mock-data';
import { RiskFlag, RiskLevel } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function RiskFlags() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  
  const [flags, setFlags] = useState(mockRiskFlags);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'acknowledged'>('all');

  // Only show if user is therapist
  if (currentUser.role !== 'therapist') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              This page is only available to therapists and healthcare providers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const acknowledgeFlag = (flagId: string, note?: string) => {
    setFlags(prev => prev.map(flag => 
      flag.id === flagId 
        ? { 
            ...flag, 
            acknowledgedBy: currentUser.id, 
            acknowledgedAt: new Date(),
            note: note || flag.note
          }
        : flag
    ));
    
    toast({
      title: "Risk flag acknowledged",
      description: "The flag has been marked as reviewed and acknowledged.",
    });
  };

  const getSeverityColor = (severity: RiskLevel): "default" | "secondary" | "destructive" => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const filteredFlags = flags.filter(flag => {
    const patient = mockPatients.find(p => p.id === flag.patientId);
    const matchesSearch = !searchTerm || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flag.note.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || flag.severity === severityFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && !flag.acknowledgedBy) ||
      (statusFilter === 'acknowledged' && flag.acknowledgedBy);

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const pendingFlags = flags.filter(flag => !flag.acknowledgedBy);
  const acknowledgedFlags = flags.filter(flag => flag.acknowledgedBy);

  const AcknowledgeDialog = ({ flag }: { flag: RiskFlag }) => {
    const [note, setNote] = useState('');
    const patient = mockPatients.find(p => p.id === flag.patientId);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Acknowledge
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acknowledge Risk Flag</DialogTitle>
            <DialogDescription>
              Mark this risk flag as reviewed for {patient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Flag Details</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getSeverityColor(flag.severity)}>
                    {flag.severity} risk
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {flag.source}
                  </span>
                </div>
                <p className="text-sm">{flag.note}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="note">Acknowledgment Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add any notes about your review or follow-up actions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => acknowledgeFlag(flag.id, note)}
                className="flex-1"
              >
                Acknowledge Flag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const FlagCard = ({ flag }: { flag: RiskFlag }) => {
    const patient = mockPatients.find(p => p.id === flag.patientId);
    
    return (
      <Card className="hover:shadow-elevated transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={patient?.avatar} />
                <AvatarFallback>
                  {patient?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{patient?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {flag.createdAt.toLocaleDateString()} • {flag.source}
                </p>
              </div>
            </div>
            <Badge variant={getSeverityColor(flag.severity)}>
              {flag.severity} risk
            </Badge>
          </div>

          <p className="text-sm text-foreground mb-4">{flag.note}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {flag.acknowledgedBy ? (
                <span>Acknowledged {flag.acknowledgedAt?.toLocaleDateString()}</span>
              ) : (
                <span>Pending review</span>
              )}
            </div>
            
            {!flag.acknowledgedBy && <AcknowledgeDialog flag={flag} />}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Flags</h1>
          <p className="text-muted-foreground">
            Monitor and respond to patient risk indicators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            {pendingFlags.length} pending
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{pendingFlags.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{acknowledgedFlags.length}</p>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(flags.map(f => f.patientId)).size}
                </p>
                <p className="text-sm text-muted-foreground">Patients Affected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(pendingFlags.reduce((sum, flag) => {
                    const hours = (new Date().getTime() - flag.createdAt.getTime()) / (1000 * 60 * 60);
                    return sum + hours;
                  }, 0) / pendingFlags.length || 0)}h
                </p>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Risk Flags */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Pending ({pendingFlags.length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Acknowledged ({acknowledgedFlags.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <FileText className="w-4 h-4" />
            All Flags ({flags.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredFlags.filter(flag => !flag.acknowledgedBy).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                <p className="text-muted-foreground">
                  No pending risk flags. Great job staying on top of patient care.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredFlags
                .filter(flag => !flag.acknowledgedBy)
                .map(flag => <FlagCard key={flag.id} flag={flag} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFlags
              .filter(flag => flag.acknowledgedBy)
              .map(flag => <FlagCard key={flag.id} flag={flag} />)}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFlags.map(flag => <FlagCard key={flag.id} flag={flag} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}