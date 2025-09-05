import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from './UserProfile';
import { QuestCard } from './QuestCard';
import { VirtualLab } from './VirtualLab';
import { Leaderboard } from './Leaderboard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User, Quest, Lab } from '@/types/stem';
import { Search, Users, BookOpen, Trophy, Settings, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
  const { user, progress, quests, isLoading, createUser, completeQuest, completeLab, resetProgress } = useLocalStorage();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserForm, setShowUserForm] = useState(!user);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showUserForm || !user) {
    return <UserSetupForm onSubmit={(userData) => {
      createUser(userData);
      setShowUserForm(false);
      toast({
        title: "Welcome to STEM Quest!",
        description: "Your learning adventure begins now!",
      });
    }} />;
  }

  if (selectedLab) {
    return (
      <VirtualLab
        lab={selectedLab}
        onComplete={(score) => {
          completeLab(selectedLab.id, score);
          setSelectedLab(null);
          setSelectedQuest(null);
          toast({
            title: "Lab Completed!",
            description: `Great job! You scored ${score || 0} points.`,
          });
        }}
        onBack={() => setSelectedLab(null)}
      />
    );
  }

  if (selectedQuest) {
    return <QuestDetail quest={selectedQuest} onSelectLab={setSelectedLab} onBack={() => setSelectedQuest(null)} />;
  }

  const filteredQuests = quests.filter(quest =>
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-engineering bg-clip-text text-transparent">
                STEM Quest
              </h1>
              <p className="text-muted-foreground">Unlock the wonders of Science, Technology, Engineering & Math</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={resetProgress}>
                <Settings className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfile user={user} progress={progress!} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="quests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="quests" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Quests
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quests" className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Quests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={() => setSelectedQuest(quest)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard">
                <Leaderboard currentUser={user} />
              </TabsContent>

              <TabsContent value="community">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Community features like forums, study groups, and collaborative projects would be available here.
                      Connect with fellow STEM enthusiasts and learn together!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Setup Form Component
function UserSetupForm({ onSubmit }: { onSubmit: (user: { name: string; email: string }) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onSubmit({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-engineering bg-clip-text text-transparent">
            Welcome to STEM Quest!
          </CardTitle>
          <p className="text-muted-foreground">Let's get started on your learning journey</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Start My Adventure!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Quest Detail Component
function QuestDetail({ quest, onSelectLab, onBack }: { quest: Quest; onSelectLab: (lab: Lab) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          ← Back to Quests
        </Button>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{quest.title}</h1>
            <p className="text-muted-foreground mt-2">{quest.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quest.labs.map((lab) => (
              <Card key={lab.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectLab(lab)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {lab.title}
                    {lab.isCompleted && <CheckCircle className="h-5 w-5 text-success" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{lab.description}</p>
                  <Badge variant="outline" className="mt-2">{lab.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}