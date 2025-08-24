import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Globe, Shield, Palette, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '',
    bio: ''
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReports: true,
    assessmentReminders: true,
    therapistMessages: true,
    crisisAlerts: true
  });

  const [preferences, setPreferences] = useState({
    language: currentUser.locale,
    timezone: 'Asia/Kolkata',
    theme: 'system',
    dateFormat: 'DD/MM/YYYY'
  });

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateNotification = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    toast({
      title: "Notification updated",
      description: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const updatePreference = (field: string, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    toast({
      title: "Preference updated",
      description: `${field} has been updated.`,
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleExportData = () => {
    // In a real app, this would trigger a data export
    toast({
      title: "Data export initiated",
      description: "You'll receive an email with your data export shortly.",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would be a serious confirmation flow
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation instructions.",
      variant: "destructive"
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, privacy, and preferences
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-lg">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                placeholder="+91 99999 99999"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={currentUser.role}
                disabled
                className="mt-1 capitalize"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Input
              id="bio"
              value={profile.bio}
              onChange={(e) => updateProfile('bio', e.target.value)}
              placeholder="Tell us a bit about yourself..."
              className="mt-1"
            />
          </div>

          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-reminders">Daily journal reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded to write in your journal</p>
            </div>
            <Switch
              id="daily-reminders"
              checked={notifications.dailyReminders}
              onCheckedChange={(checked) => updateNotification('dailyReminders', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-reports">Weekly progress reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly insights about your progress</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => updateNotification('weeklyReports', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="assessment-reminders">Assessment reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded to take mental health assessments</p>
            </div>
            <Switch
              id="assessment-reminders"
              checked={notifications.assessmentReminders}
              onCheckedChange={(checked) => updateNotification('assessmentReminders', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="therapist-messages">Therapist messages</Label>
              <p className="text-sm text-muted-foreground">Notifications when your therapist sends a message</p>
            </div>
            <Switch
              id="therapist-messages"
              checked={notifications.therapistMessages}
              onCheckedChange={(checked) => updateNotification('therapistMessages', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="crisis-alerts">Crisis support alerts</Label>
              <p className="text-sm text-muted-foreground">Important safety and crisis support notifications</p>
            </div>
            <Switch
              id="crisis-alerts"
              checked={notifications.crisisAlerts}
              onCheckedChange={(checked) => updateNotification('crisisAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => updatePreference('language', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={preferences.timezone} 
                onValueChange={(value) => updatePreference('timezone', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="Asia/Mumbai">Asia/Mumbai (IST)</SelectItem>
                  <SelectItem value="Asia/Delhi">Asia/Delhi (IST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={preferences.theme} 
                onValueChange={(value) => updatePreference('theme', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-format">Date Format</Label>
              <Select 
                value={preferences.dateFormat} 
                onValueChange={(value) => updatePreference('dateFormat', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="w-4 h-4" />
              Export My Data
            </Button>
            <Button variant="outline" className="gap-2">
              <Shield className="w-4 h-4" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="gap-2">
              <Globe className="w-4 h-4" />
              Data Residency
            </Button>
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              Consent History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Before deleting your account, please consider:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>All journal entries will be permanently deleted</li>
                  <li>Assessment history will be lost</li>
                  <li>Connection with your therapist will be severed</li>
                  <li>This action cannot be reversed</li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Yes, Delete My Account
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}