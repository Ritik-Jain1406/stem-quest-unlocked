import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  questionsCount: number;
  isActive: boolean;
  attempts: number;
  avgScore: number;
  createdAt: string;
}

export function QuizManagement() {
  const { t } = useTranslation();
  
  // Mock data - replace with actual data from Supabase
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Basic Mathematics',
      category: 'mathematics',
      difficulty: 'beginner',
      questionsCount: 10,
      isActive: true,
      attempts: 25,
      avgScore: 85,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Physics Fundamentals',
      category: 'science',
      difficulty: 'intermediate',
      questionsCount: 15,
      isActive: true,
      attempts: 18,
      avgScore: 78,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Advanced Chemistry',
      category: 'science',
      difficulty: 'advanced',
      questionsCount: 20,
      isActive: false,
      attempts: 5,
      avgScore: 92,
      createdAt: '2024-01-05'
    }
  ]);

  const toggleQuizStatus = (id: string) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === id ? { ...quiz, isActive: !quiz.isActive } : quiz
    ));
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('manageQuizes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {quiz.category}
                    </Badge>
                    <Badge variant={quiz.isActive ? "default" : "secondary"}>
                      {quiz.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleQuizStatus(quiz.id)}
                    >
                      {quiz.isActive ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteQuiz(quiz.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Questions:</span>
                    <div className="font-medium">{quiz.questionsCount}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Attempts:</span>
                    <div className="font-medium">{quiz.attempts}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Score:</span>
                    <div className="font-medium">{quiz.avgScore}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <div className="font-medium">{quiz.createdAt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}