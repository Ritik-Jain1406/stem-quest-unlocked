import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  totalQuizzes: number;
  completedQuizzes: number;
  avgScore: number;
  lastActive: string;
  recentQuizzes: {
    title: string;
    score: number;
    completedAt: string;
  }[];
}

interface StudentProgressProps {
  onBack?: () => void;
}

export function StudentProgress({ onBack }: StudentProgressProps) {
  const { t } = useTranslation();

  // Mock data - replace with actual data from Supabase
  const students: StudentProgress[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      totalQuizzes: 5,
      completedQuizzes: 3,
      avgScore: 87,
      lastActive: '2024-01-15',
      recentQuizzes: [
        { title: 'Basic Mathematics', score: 85, completedAt: '2024-01-15' },
        { title: 'Physics Fundamentals', score: 92, completedAt: '2024-01-12' },
        { title: 'Chemistry Basics', score: 84, completedAt: '2024-01-10' }
      ]
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      totalQuizzes: 5,
      completedQuizzes: 4,
      avgScore: 94,
      lastActive: '2024-01-14',
      recentQuizzes: [
        { title: 'Advanced Chemistry', score: 96, completedAt: '2024-01-14' },
        { title: 'Basic Mathematics', score: 89, completedAt: '2024-01-13' },
        { title: 'Physics Fundamentals', score: 98, completedAt: '2024-01-11' }
      ]
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      totalQuizzes: 5,
      completedQuizzes: 2,
      avgScore: 76,
      lastActive: '2024-01-13',
      recentQuizzes: [
        { title: 'Basic Mathematics', score: 78, completedAt: '2024-01-13' },
        { title: 'Physics Fundamentals', score: 74, completedAt: '2024-01-09' }
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('studentProgress')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {students.map((student) => {
              const completionPercentage = (student.completedQuizzes / student.totalQuizzes) * 100;
              
              return (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {student.lastActive}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(student.avgScore)}`}>
                        {student.avgScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{student.completedQuizzes}/{student.totalQuizzes}</span>
                      </div>
                      <Progress 
                        value={completionPercentage} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {student.completedQuizzes} completed
                      </Badge>
                      <Badge variant="secondary">
                        {student.totalQuizzes - student.completedQuizzes} remaining
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recent Quiz Results</h4>
                    <div className="space-y-2">
                      {student.recentQuizzes.map((quiz, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{quiz.title}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getScoreColor(quiz.score)}`}>
                              {quiz.score}%
                            </span>
                            <span className="text-muted-foreground">
                              {quiz.completedAt}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}