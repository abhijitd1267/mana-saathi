import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCurrentUser } from '@/lib/mock-data';

export default function Messages() {
  const currentUser = getCurrentUser();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Secure communication with your care team
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {currentUser.role === 'patient' ? 'Dr. Anita Mehta' : 'Riya Sharma'}
          </CardTitle>
          <CardDescription>Secure messaging</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 h-64 overflow-y-auto">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-xl p-3 max-w-xs">
                <p className="text-sm">How are you feeling today? I noticed your recent journal entries mentioned some challenges with sleep.</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <div className="bg-primary text-primary-foreground rounded-xl p-3 max-w-xs">
                <p className="text-sm">Thank you for checking in. Yes, I've been having trouble sleeping. The techniques we discussed are helping though.</p>
                <p className="text-xs text-primary-foreground/80 mt-1">1 hour ago</p>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b332c5b8?w=150" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button size="sm" variant="outline">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}