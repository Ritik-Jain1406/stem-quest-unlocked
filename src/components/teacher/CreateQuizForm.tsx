import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export function CreateQuizForm() {
  const { t } = useTranslation();
  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    category: 'science',
    difficulty: 'beginner',
    timeLimit: 30,
    maxAttempts: 3,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString()
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setCurrentQuestion({
      id: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });

    toast({
      title: "Success",
      description: "Question added to quiz"
    });
  };

  const removeQuestion = (id: string) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const saveQuiz = async () => {
    if (!quizData.title.trim() || quizData.questions.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a title and at least one question",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Save to Supabase teacher_questions table
      console.log('Saving quiz:', quizData);
      
      toast({
        title: "Success",
        description: "Quiz created successfully!"
      });

      // Reset form
      setQuizData({
        title: '',
        description: '',
        category: 'science',
        difficulty: 'beginner',
        timeLimit: 30,
        maxAttempts: 3,
        questions: []
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quiz Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('createQuiz')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quizData.title}
                onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={quizData.category}
                onValueChange={(value) => setQuizData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={quizData.description}
              onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter quiz description"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select 
                value={quizData.difficulty}
                onValueChange={(value) => setQuizData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => setQuizData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                min="1"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Max Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                value={quizData.maxAttempts}
                onChange={(e) => setQuizData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Add Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter your question"
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Badge variant={index === currentQuestion.correctAnswer ? "default" : "outline"}>
                  {index + 1}
                </Badge>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  size="sm"
                  variant={index === currentQuestion.correctAnswer ? "default" : "outline"}
                  onClick={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                >
                  Correct
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              value={currentQuestion.explanation}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder="Explain why this is the correct answer"
            />
          </div>

          <Button onClick={addQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Question List */}
      {quizData.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({quizData.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizData.questions.map((question, index) => (
                <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {index + 1}. {question.question}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Correct: {question.options[question.correctAnswer]}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Quiz */}
      <div className="flex justify-end">
        <Button onClick={saveQuiz} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {t('save')} Quiz
        </Button>
      </div>
    </div>
  );
}