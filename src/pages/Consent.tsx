import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Bell, Share, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ConsentSettings } from '@/lib/types';
import { getCurrentUser } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function Consent() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    shareMood: true,
    shareText: true,
    shareAssessments: true,
    allowNudges: true,
    updatedAt: new Date()
  });

  // Load from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem('sahaay-consent-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setConsentSettings({
        ...parsed,
        updatedAt: new Date(parsed.updatedAt)
      });
    } else if (currentUser.role === 'patient' && 'consentSettings' in currentUser) {
      setConsentSettings(currentUser.consentSettings);
    }
  }, [currentUser]);

  const updateSetting = (key: keyof Omit<ConsentSettings, 'updatedAt'>, value: boolean) => {
    const newSettings = {
      ...consentSettings,
      [key]: value,
      updatedAt: new Date()
    };
    setConsentSettings(newSettings);
    localStorage.setItem('sahaay-consent-settings', JSON.stringify(newSettings));
    
    toast({
      title: "Consent updated",
      description: `Your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} preference has been updated.`,
    });
  };

  // Mock audit trail
  const auditTrail = [
    {
      id: '1',
      action: 'Shared mood data',
      recipient: 'Dr. Anita Mehta',
      timestamp: new Date('2024-02-20T10:30:00'),
      type: 'mood'
    },
    {
      id: '2', 
      action: 'Shared journal entry',
      recipient: 'Dr. Anita Mehta',
      timestamp: new Date('2024-02-19T14:22:00'),
      type: 'journal'
    },
    {
      id: '3',
      action: 'Shared PHQ-9 assessment',
      recipient: 'Dr. Anita Mehta', 
      timestamp: new Date('2024-02-15T09:15:00'),
      type: 'assessment'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mood': return <span className="text-lg">😊</span>;
      case 'journal': return <Eye className="w-4 h-4" />;
      case 'assessment': return <CheckCircle className="w-4 h-4" />;
      default: return <Share className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Share & Consent</h1>
          <p className="text-muted-foreground">
            You control what's shared. Change settings at any time.
          </p>
        </div>
      </div>

      {/* Current Therapist */}
      {currentUser.role === 'patient' && 'connectedTherapistId' in currentUser && currentUser.connectedTherapistId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connected Therapist</CardTitle>
            <CardDescription>Your data can be shared with this healthcare provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <span className="text-lg">👩‍⚕️</span>
              </div>
              <div>
                <p className="font-medium">Dr. Anita Mehta</p>
                <p className="text-sm text-muted-foreground">
                  Serenity Mental Health Clinic • License: MH-PSY-2019-001
                </p>
              </div>
              <Badge variant="outline" className="ml-auto">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Granular Consent Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sharing Preferences</CardTitle>
          <CardDescription>
            Choose exactly what information you want to share with your care team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Share Mood */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😊</span>
              <div>
                <Label htmlFor="share-mood" className="text-base font-medium">
                  Share mood data
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow your therapist to see your daily mood check-ins and emotional patterns
                </p>
              </div>
            </div>
            <Switch
              id="share-mood"
              checked={consentSettings.shareMood}
              onCheckedChange={(checked) => updateSetting('shareMood', checked)}
            />
          </div>

          <Separator />

          {/* Share Text */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-muted-foreground" />
              <div>
                <Label htmlFor="share-text" className="text-base font-medium">
                  Share journal text
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow your therapist to read the content of your journal entries
                </p>
              </div>
            </div>
            <Switch
              id="share-text"
              checked={consentSettings.shareText}
              onCheckedChange={(checked) => updateSetting('shareText', checked)}
            />
          </div>

          <Separator />

          {/* Share Assessments */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-muted-foreground" />
              <div>
                <Label htmlFor="share-assessments" className="text-base font-medium">
                  Share assessment scores
                </Label>
                <p className="text-sm text-muted-foreground">
                  Share PHQ-9, GAD-7, and other assessment results with your therapist
                </p>
              </div>
            </div>
            <Switch
              id="share-assessments"
              checked={consentSettings.shareAssessments}
              onCheckedChange={(checked) => updateSetting('shareAssessments', checked)}
            />
          </div>

          <Separator />

          {/* Allow Nudges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-muted-foreground" />
              <div>
                <Label htmlFor="allow-nudges" className="text-base font-medium">
                  Allow therapist nudges
                </Label>
                <p className="text-sm text-muted-foreground">
                  Let your therapist send gentle reminders and check-in messages
                </p>
              </div>
            </div>
            <Switch
              id="allow-nudges"
              checked={consentSettings.allowNudges}
              onCheckedChange={(checked) => updateSetting('allowNudges', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Sharing History
          </CardTitle>
          <CardDescription>
            Track what data has been shared and when
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditTrail.length === 0 ? (
            <div className="text-center py-8">
              <EyeOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No data shared yet</h4>
              <p className="text-muted-foreground">
                When you share data with your therapist, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditTrail.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    {getTypeIcon(entry.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">
                      with {entry.recipient}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Rights & Privacy */}
      <Card className="border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="text-accent-foreground">Your Data Rights</CardTitle>
          <CardDescription className="text-accent-foreground/80">
            Under India's Digital Personal Data Protection Act 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-accent-foreground mb-2">Right to Access</h4>
              <p className="text-sm text-accent-foreground/80">
                You can request a copy of all your personal data at any time.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-accent-foreground mb-2">Right to Correction</h4>
              <p className="text-sm text-accent-foreground/80">
                You can request correction of any inaccurate personal data.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-accent-foreground mb-2">Right to Erasure</h4>
              <p className="text-sm text-accent-foreground/80">
                You can request deletion of your personal data.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-accent-foreground mb-2">Right to Portability</h4>
              <p className="text-sm text-accent-foreground/80">
                You can export your data in a commonly used format.
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm">
              Download My Data
            </Button>
            <Button variant="outline" size="sm">
              Privacy Policy
            </Button>
            <Button variant="outline" size="sm">
              Contact Privacy Officer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Consent settings last updated: {consentSettings.updatedAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}