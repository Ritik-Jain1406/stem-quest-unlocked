import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, UserProgress } from '@/types/stem';
import { Trophy, Star, Award, Zap } from 'lucide-react';

interface UserProfileProps {
  user: User;
  progress: UserProgress;
}

export function UserProfile({ user, progress }: UserProfileProps) {
  const xpToNextLevel = (progress.currentLevel * 1000) - progress.totalXP;
  const levelProgress = ((progress.totalXP % 1000) / 1000) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl">{user.name}</CardTitle>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span>Level {progress.currentLevel}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP Progress</span>
            <span>{progress.totalXP} XP</span>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {xpToNextLevel} XP to next level
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent" />
            <div>
              <p className="text-sm font-medium">{progress.questsCompleted.length}</p>
              <p className="text-xs text-muted-foreground">Quests</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{progress.badges.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-secondary" />
            <div>
              <p className="text-sm font-medium">{progress.dailyStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-warning" />
            <div>
              <p className="text-sm font-medium">{progress.labsCompleted.length}</p>
              <p className="text-xs text-muted-foreground">Labs</p>
            </div>
          </div>
        </div>

        {/* Recent Badges */}
        {progress.badges.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Badges</h4>
            <div className="flex flex-wrap gap-2">
              {progress.badges.slice(-3).map((badge) => (
                <Badge key={badge.id} variant="secondary" className="text-xs">
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}