import { Phone, MessageSquare, MapPin, Clock, Heart, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Crisis() {
  const emergencyContacts = [
    {
      name: "iCall",
      number: "9152987821",
      description: "Emotional support helpline",
      hours: "8:00 AM - 10:00 PM",
      languages: ["English", "Hindi"]
    },
    {
      name: "KIRAN",
      number: "18005990019", 
      description: "Mental health rehabilitation helpline",
      hours: "24/7",
      languages: ["English", "Hindi", "Regional languages"]
    },
    {
      name: "Vandrevala Foundation",
      number: "9999666555",
      description: "Crisis intervention helpline",
      hours: "24/7",
      languages: ["English", "Hindi"]
    }
  ];

  const selfCareStrategies = [
    {
      title: "Breathing Exercise",
      description: "Take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.",
      icon: "🫁"
    },
    {
      title: "Grounding Technique",
      description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      icon: "🌱"
    },
    {
      title: "Safe Person",
      description: "Call or message someone you trust - a friend, family member, or counselor.",
      icon: "🤝"
    },
    {
      title: "Safe Space",
      description: "Go to a place where you feel secure and comfortable.",
      icon: "🏠"
    }
  ];

  const warningSignsText = [
    "I want to hurt myself",
    "I want to end my life", 
    "I feel hopeless",
    "I can't go on",
    "hurt myself",
    "kill myself",
    "end it all"
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleSMS = (number: string) => {
    const message = "Hi, I need support right now. Can you help me?";
    window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-hero rounded-2xl p-6 text-white">
        <Heart className="w-16 h-16 mx-auto mb-4 text-white" />
        <h1 className="text-3xl font-bold mb-2">Crisis Support</h1>
        <p className="text-white/90 text-lg">
          You're not alone. Help is available 24/7.
        </p>
      </div>

      {/* Emergency Alert */}
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">
                If you're in immediate danger
              </h3>
              <p className="text-destructive/80 mb-4">
                If you're having thoughts of harming yourself or others, please reach out for immediate help.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleCall("112")}
                  className="gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Emergency: 112
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCall("102")}
                  className="gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Medical Emergency: 102
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Helplines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Mental Health Helplines
          </CardTitle>
          <CardDescription>
            Free, confidential support from trained counselors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="p-4 border border-border rounded-xl hover:shadow-elevated transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{contact.name}</h4>
                  <p className="text-muted-foreground">{contact.description}</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {contact.hours}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {contact.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleCall(contact.number)}
                  className="gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call {contact.number}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSMS(contact.number)}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  SMS
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Immediate Coping Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Immediate Coping Strategies</CardTitle>
          <CardDescription>
            Things you can try right now to feel safer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selfCareStrategies.map((strategy, index) => (
              <div key={index} className="p-4 border border-border rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{strategy.icon}</span>
                  <div>
                    <h4 className="font-medium mb-2">{strategy.title}</h4>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Find Local Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Local Support
          </CardTitle>
          <CardDescription>
            Mental health facilities and professionals near you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">Location Services</h4>
            <p className="text-muted-foreground mb-4">
              Enable location access to find nearby mental health facilities and crisis centers.
            </p>
            <Button variant="outline">
              Find Nearby Facilities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Planning */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Planning</CardTitle>
          <CardDescription>
            Create a personalized plan for crisis situations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <h4 className="font-medium mb-2">Warning Signs</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Recognize early signs that you might be entering a crisis:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Feeling overwhelmed or hopeless</li>
              <li>• Isolation from friends and family</li>
              <li>• Changes in sleep or appetite</li>
              <li>• Increased substance use</li>
            </ul>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl">
            <h4 className="font-medium mb-2">Coping Strategies</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Things that help you feel better when you're struggling:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Call a trusted friend or family member</li>
              <li>• Practice breathing exercises</li>
              <li>• Go for a walk or do light exercise</li>
              <li>• Listen to calming music</li>
            </ul>
          </div>

          <Button variant="outline" className="w-full">
            Create My Safety Plan
          </Button>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            More support and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <h4 className="font-medium">Mental Health First Aid</h4>
                <p className="text-sm text-muted-foreground">Learn how to help yourself and others</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <h4 className="font-medium">Crisis Text Line</h4>
                <p className="text-sm text-muted-foreground">Text-based crisis support</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <h4 className="font-medium">Suicide Prevention</h4>
                <p className="text-sm text-muted-foreground">Information and resources</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <h4 className="font-medium">Support Groups</h4>
                <p className="text-sm text-muted-foreground">Connect with others who understand</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-accent-foreground">Remember</h4>
              <p className="text-sm text-accent-foreground/80 mt-1">
                Crisis feelings are temporary. You deserve support and care. Reaching out for help is a sign of strength, not weakness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}