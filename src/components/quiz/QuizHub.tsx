import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  PlayCircle,
  Timer,
  Target,
  Award
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'science' | 'physics' | 'chemistry' | 'biology';
  difficulty: 'easy' | 'medium' | 'hard';
  questionsCount: number;
  timeLimit: number;
  bestScore?: number;
  attempts: number;
  xpReward: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizHubProps {
  onBack?: () => void;
}

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Organic Chemistry Fundamentals',
    description: 'Test your knowledge of carbon compounds, functional groups, and basic reactions.',
    subject: 'chemistry',
    difficulty: 'medium',
    questionsCount: 15,
    timeLimit: 20,
    bestScore: 87,
    attempts: 3,
    xpReward: 150
  },
  {
    id: '2',
    title: 'Linear Algebra Concepts',
    description: 'Vector operations, matrix multiplication, and linear transformations.',
    subject: 'math',
    difficulty: 'hard',
    questionsCount: 12,
    timeLimit: 25,
    bestScore: 92,
    attempts: 2,
    xpReward: 200
  },
  {
    id: '3',
    title: 'Cell Biology Basics',
    description: 'Cellular structures, organelles, and basic cellular processes.',
    subject: 'biology',
    difficulty: 'easy',
    questionsCount: 10,
    timeLimit: 15,
    attempts: 0,
    xpReward: 100
  },
  {
    id: '4',
    title: 'Classical Mechanics',
    description: 'Newton\'s laws, kinematics, and energy conservation principles.',
    subject: 'physics',
    difficulty: 'medium',
    questionsCount: 18,
    timeLimit: 30,
    bestScore: 78,
    attempts: 1,
    xpReward: 175
  }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'Which of the following is the correct molecular formula for methane?',
    options: ['CH₄', 'C₂H₆', 'C₃H₈', 'C₄H₁₀'],
    correctAnswer: 0,
    explanation: 'Methane is the simplest hydrocarbon with one carbon atom bonded to four hydrogen atoms.'
  },
  {
    id: '2',
    question: 'What type of bond exists between carbon atoms in alkenes?',
    options: ['Single bond', 'Double bond', 'Triple bond', 'Ionic bond'],
    correctAnswer: 1,
    explanation: 'Alkenes contain at least one carbon-carbon double bond, which gives them their characteristic properties.'
  },
  {
    id: '3',
    question: 'Which functional group is present in alcohols?',
    options: ['-COOH', '-NH₂', '-OH', '-CHO'],
    correctAnswer: 2,
    explanation: 'Alcohols contain the hydroxyl functional group (-OH) attached to a carbon atom.'
  }
];

export function QuizHub({ onBack }: QuizHubProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeUsed: number;
    xpEarned: number;
  } | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'hsl(var(--success))';
      case 'medium': return 'hsl(var(--warning))';
      case 'hard': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--primary))';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'math': return 'hsl(var(--mathematics))';
      case 'science': return 'hsl(var(--science))';
      case 'physics': return 'hsl(var(--primary))';
      case 'chemistry': return 'hsl(var(--warning))';
      case 'biology': return 'hsl(var(--engineering))';
      default: return 'hsl(var(--primary))';
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!selectedQuiz) return;
    
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === mockQuestions[index].correctAnswer ? count + 1 : count;
    }, 0);
    
    const score = Math.round((correctAnswers / mockQuestions.length) * 100);
    const timeUsed = (selectedQuiz.timeLimit * 60) - timeRemaining;
    const xpEarned = Math.round(selectedQuiz.xpReward * (score / 100));
    
    setQuizResults({
      score,
      correctAnswers,
      totalQuestions: mockQuestions.length,
      timeUsed,
      xpEarned
    });
    
    setIsQuizActive(false);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizResults(null);
  };

  // Quiz Results Screen
  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="mb-4">
                  {quizResults.score >= 80 ? (
                    <Trophy className="h-16 w-16 text-warning mx-auto" />
                  ) : quizResults.score >= 60 ? (
                    <Star className="h-16 w-16 text-success mx-auto" />
                  ) : (
                    <Target className="h-16 w-16 text-muted-foreground mx-auto" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {quizResults.score >= 80 ? 'Excellent Work!' : 
                   quizResults.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold text-primary">
                  {quizResults.score}%
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Correct Answers</p>
                    <p className="text-xl font-semibold">
                      {quizResults.correctAnswers}/{quizResults.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time Used</p>
                    <p className="text-xl font-semibold">
                      {Math.floor(quizResults.timeUsed / 60)}m {quizResults.timeUsed % 60}s
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center justify-center gap-2">
                    <Award className="h-5 w-5 text-success" />
                    <span className="font-semibold text-success">
                      +{quizResults.xpEarned} XP Earned!
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => startQuiz(selectedQuiz!)} className="flex-1">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={resetQuiz} className="flex-1">
                    Back to Quizzes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Screen
  if (isQuizActive && selectedQuiz) {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Quiz Header */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{selectedQuiz.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {mockQuestions.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
                <Progress value={progress} className="mt-3 h-2" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedAnswers[currentQuestionIndex]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={nextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  >
                    {currentQuestionIndex === mockQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Interactive Quizzes
              </h1>
              <p className="text-muted-foreground">Test your knowledge and earn XP</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {quiz.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getSubjectColor(quiz.subject),
                          color: getSubjectColor(quiz.subject)
                        }}
                        className="text-xs"
                      >
                        {quiz.subject}
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getDifficultyColor(quiz.difficulty),
                          color: getDifficultyColor(quiz.difficulty)
                        }}
                        className="text-xs"
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {quiz.bestScore && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">{quiz.bestScore}%</div>
                      <div className="text-xs text-muted-foreground">best score</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    <span>{quiz.questionsCount}q</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{quiz.timeLimit}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>{quiz.xpReward} XP</span>
                  </div>
                </div>
                
                {quiz.attempts > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Attempted {quiz.attempts} time{quiz.attempts > 1 ? 's' : ''}
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => startQuiz(quiz)}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {quiz.attempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}