import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
  Award,
  Zap
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
  },
  {
    id: '5',
    title: 'Thermodynamics Basics',
    description: 'Heat, work, energy transfers, and the laws of thermodynamics.',
    subject: 'physics',
    difficulty: 'hard',
    questionsCount: 14,
    timeLimit: 22,
    attempts: 0,
    xpReward: 180
  },
  {
    id: '6',
    title: 'Calculus Applications',
    description: 'Derivatives, integrals, and their applications in real-world problems.',
    subject: 'math',
    difficulty: 'medium',
    questionsCount: 16,
    timeLimit: 28,
    bestScore: 84,
    attempts: 2,
    xpReward: 160
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
  },
  {
    id: '4',
    question: 'What is the first law of thermodynamics?',
    options: [
      'Energy cannot be created or destroyed',
      'Entropy always increases',
      'Heat flows from hot to cold',
      'Work equals force times distance'
    ],
    correctAnswer: 0,
    explanation: 'The first law states that energy cannot be created or destroyed, only transferred or converted from one form to another.'
  },
  {
    id: '5',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic reticulum'],
    correctAnswer: 1,
    explanation: 'Mitochondria generate most of the cell\'s ATP through cellular respiration, earning them the nickname "powerhouse of the cell".'
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
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

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
    
    toast({
      title: "Quiz Started!",
      description: `You have ${quiz.timeLimit} minutes to complete ${quiz.questionsCount} questions.`,
    });
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

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    if (!selectedQuiz) return;
    
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === mockQuestions[index]?.correctAnswer ? count + 1 : count;
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

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}% and earned ${xpEarned} XP!`,
    });
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center animate-scale-in">
              <CardHeader className="pb-4">
                <div className="mb-6">
                  {quizResults.score >= 80 ? (
                    <Trophy className="h-20 w-20 text-warning mx-auto animate-bounce" />
                  ) : quizResults.score >= 60 ? (
                    <Star className="h-20 w-20 text-success mx-auto" />
                  ) : (
                    <Target className="h-20 w-20 text-muted-foreground mx-auto" />
                  )}
                </div>
                <CardTitle className="text-3xl mb-2">
                  {quizResults.score >= 80 ? 'Outstanding! 🎉' : 
                   quizResults.score >= 60 ? 'Great Job! 👏' : 
                   quizResults.score >= 40 ? 'Good Effort! 💪' : 'Keep Practicing! 📚'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {quizResults.score >= 80 ? 'You\'ve mastered this topic!' : 
                   quizResults.score >= 60 ? 'You have a solid understanding!' : 
                   'Practice makes perfect!'}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {quizResults.score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Your Score</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{quizResults.correctAnswers}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{quizResults.totalQuestions - quizResults.correctAnswers}</div>
                    <div className="text-xs text-muted-foreground">Incorrect</div>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {Math.floor(quizResults.timeUsed / 60)}:{(quizResults.timeUsed % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">Time Used</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-success/10 to-warning/10 rounded-lg border border-success/20">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5 text-warning" />
                    <span className="font-semibold text-success text-lg">
                      +{quizResults.xpEarned} XP Earned!
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quizResults.score >= 80 ? 'Bonus XP for excellent performance!' : 'Keep learning to earn more XP!'}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => startQuiz(selectedQuiz!)} className="flex-1">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={resetQuiz} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
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
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <Card className="mb-6 animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedQuiz.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {mockQuestions.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      timeRemaining < 300 ? 'bg-destructive/10 text-destructive' : 'bg-muted'
                    }`}>
                      <Timer className="h-4 w-4" />
                      <span className="font-mono font-medium">
                        {minutes}:{seconds.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Progress: {Math.round(progress)}%</span>
                  <span>{selectedAnswers.filter(a => a !== undefined).length} answered</span>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed">{currentQuestion?.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={selectedAnswers[currentQuestionIndex]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                >
                  {currentQuestion?.options.map((option, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-between pt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={finishQuiz}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Finish Early
                    </Button>
                    
                    <Button 
                      onClick={nextQuestion}
                      disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    >
                      {currentQuestionIndex === mockQuestions.length - 1 ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Finish Quiz
                        </>
                      ) : (
                        <>
                          Next Question
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </>
                      )}
                    </Button>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
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
              <p className="text-muted-foreground">Test your knowledge and earn XP rewards</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz, index) => (
            <Card 
              key={quiz.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2">
                      {quiz.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
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
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {quiz.description}
                </p>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1 p-2 bg-muted/50 rounded">
                    <Brain className="h-3 w-3" />
                    <span>{quiz.questionsCount}q</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 bg-muted/50 rounded">
                    <Clock className="h-3 w-3" />
                    <span>{quiz.timeLimit}m</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 bg-muted/50 rounded">
                    <Award className="h-3 w-3" />
                    <span>{quiz.xpReward} XP</span>
                  </div>
                </div>
                
                {quiz.attempts > 0 && (
                  <div className="text-xs text-muted-foreground p-2 bg-primary/5 rounded">
                    📊 Attempted {quiz.attempts} time{quiz.attempts > 1 ? 's' : ''}
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