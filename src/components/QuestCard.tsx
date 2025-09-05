import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Quest, STEMCategory } from '@/types/stem';
import { Clock, Trophy, CheckCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  quest: Quest;
  onStart: (questId: string) => void;
}

const categoryColors = {
  science: 'bg-science text-white',
  technology: 'bg-technology text-white', 
  engineering: 'bg-engineering text-white',
  mathematics: 'bg-mathematics text-white',
} as const;

const difficultyColors = {
  beginner: 'bg-success text-white',
  intermediate: 'bg-warning text-white',
  advanced: 'bg-destructive text-white',
} as const;

export function QuestCard({ quest, onStart }: QuestCardProps) {
  const completedLabs = quest.labs.filter(lab => lab.isCompleted).length;
  const totalLabs = quest.labs.length;
  const progressPercentage = totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0;
  const isInProgress = completedLabs > 0 && !quest.isCompleted;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      quest.isCompleted && "border-success/50 bg-success/5"
    )}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{quest.title}</CardTitle>
          {quest.isCompleted && (
            <CheckCircle className="h-6 w-6 text-success" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={categoryColors[quest.category]} variant="secondary">
            {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
          </Badge>
          <Badge className={difficultyColors[quest.difficulty]} variant="outline">
            {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {quest.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {isInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedLabs}/{totalLabs} labs</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        {/* Quest Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{quest.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>{quest.xpReward} XP</span>
            </div>
          </div>
          <span>{totalLabs} labs</span>
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={() => onStart(quest.id)}
          className="w-full"
          variant={quest.isCompleted ? "outline" : "default"}
          disabled={quest.isCompleted}
        >
          {quest.isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : isInProgress ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Continue Quest
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Quest
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}