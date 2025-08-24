import { useState, useEffect } from 'react';
import { Plus, Mic, Hash, Eye, EyeOff, Edit3, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { JournalEntry, EMOTIONS, Emotion, ShareScope } from '@/lib/types';
import { getCurrentUser, mockJournalEntries } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function Journal() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [isComposing, setIsComposing] = useState(false);
  const [newEntry, setNewEntry] = useState({
    content: '',
    emotion: 'calm' as Emotion,
    tags: '',
    sharedScope: 'none' as ShareScope
  });

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('sahaay-journal-entries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      }));
      setEntries(parsed);
    }
  }, []);

  // Save entries to localStorage
  const saveEntries = (updatedEntries: JournalEntry[]) => {
    localStorage.setItem('sahaay-journal-entries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  const handleSaveEntry = () => {
    if (!newEntry.content.trim()) {
      toast({
        title: "Please write something",
        description: "Your journal entry cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      userId: currentUser.id,
      content: newEntry.content,
      emotion: newEntry.emotion,
      tags: newEntry.tags ? newEntry.tags.split(',').map(tag => tag.trim()) : [],
      sharedScope: newEntry.sharedScope,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedEntries = [entry, ...entries];
    saveEntries(updatedEntries);

    // Reset form
    setNewEntry({
      content: '',
      emotion: 'calm',
      tags: '',
      sharedScope: 'none'
    });
    setIsComposing(false);

    toast({
      title: "Entry saved!",
      description: "Your journal entry has been saved successfully.",
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    saveEntries(updatedEntries);
    
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    });
  };

  const handleUpdateShareScope = (entryId: string, newScope: ShareScope) => {
    const updatedEntries = entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, sharedScope: newScope, updatedAt: new Date() }
        : entry
    );
    saveEntries(updatedEntries);

    toast({
      title: "Sharing updated",
      description: `Entry sharing has been updated to "${newScope}".`,
    });
  };

  const EmotionPicker = ({ value, onChange }: { value: Emotion; onChange: (emotion: Emotion) => void }) => (
    <div className="flex flex-wrap gap-2">
      {Object.entries(EMOTIONS).map(([key, emotion]) => (
        <Button
          key={key}
          variant={value === emotion.emotion ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(emotion.emotion)}
          className="gap-2"
        >
          <span>{emotion.emoji}</span>
          <span>{emotion.label}</span>
        </Button>
      ))}
    </div>
  );

  const ShareScopeSelector = ({ value, onChange }: { value: ShareScope; onChange: (scope: ShareScope) => void }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            Keep Private
          </div>
        </SelectItem>
        <SelectItem value="therapist">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Share with Therapist
          </div>
        </SelectItem>
        <SelectItem value="therapist_ai">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Share + AI Summary
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">
            Share your thoughts and track your emotional journey
          </p>
        </div>
        <Dialog open={isComposing} onOpenChange={setIsComposing}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
              <DialogDescription>
                Express how you're feeling and what's on your mind.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>How are you feeling?</Label>
                <div className="mt-2">
                  <EmotionPicker 
                    value={newEntry.emotion} 
                    onChange={(emotion) => setNewEntry(prev => ({ ...prev, emotion }))} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Your thoughts</Label>
                <div className="relative mt-2">
                  <Textarea
                    id="content"
                    placeholder="Write about your day, feelings, or anything on your mind..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-32"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    disabled
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  placeholder="work, sleep, family, anxiety..."
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Sharing</Label>
                <div className="mt-2">
                  <ShareScopeSelector
                    value={newEntry.sharedScope}
                    onChange={(scope) => setNewEntry(prev => ({ ...prev, sharedScope: scope }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You control what's shared. Change at any time.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEntry} className="flex-1">
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setIsComposing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
          <p className="text-muted-foreground mb-4">
            Try a <strong>2-minute</strong> micro-journal to get started.
          </p>
          <Button onClick={() => setIsComposing(true)}>
            Write Your First Entry
          </Button>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-elevated transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{EMOTIONS[entry.emotion].emoji}</span>
                  <div>
                    <CardTitle className="text-lg">{EMOTIONS[entry.emotion].label}</CardTitle>
                    <CardDescription>
                      {entry.createdAt.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Share scope indicator */}
                  <Badge variant={entry.sharedScope === 'none' ? 'secondary' : 'default'}>
                    {entry.sharedScope === 'none' && <EyeOff className="w-3 h-3 mr-1" />}
                    {entry.sharedScope !== 'none' && <Eye className="w-3 h-3 mr-1" />}
                    {entry.sharedScope === 'none' && 'Private'}
                    {entry.sharedScope === 'therapist' && 'Shared'}
                    {entry.sharedScope === 'therapist_ai' && 'Shared + AI'}
                  </Badge>
                  
                  {/* Actions */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Sharing</DialogTitle>
                        <DialogDescription>
                          Change how this entry is shared with your care team.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <ShareScopeSelector
                          value={entry.sharedScope}
                          onChange={(scope) => handleUpdateShareScope(entry.id, scope)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Your therapist can only see entries you explicitly share.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed mb-3">
                {entry.content}
              </p>
              
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}