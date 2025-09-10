import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Search, 
  ArrowLeft,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'science' | 'physics' | 'chemistry' | 'biology' | 'engineering';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  completed: boolean;
  progress: number;
  rating: number;
  enrolledStudents: number;
  xpReward: number;
  thumbnail?: string;
}

interface LessonsHubProps {
  onBack?: () => void;
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Organic Chemistry',
    description: 'Learn the fundamentals of organic chemistry including carbon bonding, functional groups, and basic nomenclature.',
    subject: 'chemistry',
    difficulty: 'beginner',
    duration: 45,
    completed: false,
    progress: 67,
    rating: 4.8,
    enrolledStudents: 234,
    xpReward: 150
  },
  {
    id: '2',
    title: 'Linear Algebra Foundations',
    description: 'Master vectors, matrices, and linear transformations with interactive visualizations.',
    subject: 'math',
    difficulty: 'intermediate',
    duration: 60,
    completed: true,
    progress: 100,
    rating: 4.9,
    enrolledStudents: 189,
    xpReward: 200
  },
  {
    id: '3',
    title: 'Cell Biology and Genetics',
    description: 'Explore cellular structures, DNA replication, and inheritance patterns through virtual microscopy.',
    subject: 'biology',
    difficulty: 'intermediate',
    duration: 55,
    completed: false,
    progress: 23,
    rating: 4.7,
    enrolledStudents: 156,
    xpReward: 180
  },
  {
    id: '4',
    title: 'Quantum Physics Basics',
    description: 'Understand quantum mechanics principles with interactive simulations and real-world applications.',
    subject: 'physics',
    difficulty: 'advanced',
    duration: 75,
    completed: false,
    progress: 0,
    rating: 4.6,
    enrolledStudents: 98,
    xpReward: 250
  },
  {
    id: '5',
    title: 'Engineering Design Process',
    description: 'Learn systematic approach to engineering problems with case studies and project-based learning.',
    subject: 'engineering',
    difficulty: 'intermediate',
    duration: 50,
    completed: false,
    progress: 45,
    rating: 4.8,
    enrolledStudents: 167,
    xpReward: 190
  },
  {
    id: '6',
    title: 'Advanced Calculus Applications',
    description: 'Apply calculus concepts to real-world problems in physics, engineering, and economics.',
    subject: 'math',
    difficulty: 'advanced',
    duration: 70,
    completed: false,
    progress: 12,
    rating: 4.5,
    enrolledStudents: 143,
    xpReward: 230
  }
];

export function LessonsHub({ onBack }: LessonsHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const subjects = [
    { value: 'all', label: 'All Subjects', icon: '📚' },
    { value: 'math', label: 'Mathematics', icon: '📐' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'physics', label: 'Physics', icon: '⚛️' },
    { value: 'chemistry', label: 'Chemistry', icon: '🧪' },
    { value: 'biology', label: 'Biology', icon: '🧬' },
    { value: 'engineering', label: 'Engineering', icon: '⚙️' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || lesson.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'hsl(var(--success))';
      case 'intermediate': return 'hsl(var(--warning))';
      case 'advanced': return 'hsl(var(--destructive))';
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
      case 'engineering': return 'hsl(var(--technology))';
      default: return 'hsl(var(--primary))';
    }
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          <Button variant="outline" onClick={() => setSelectedLesson(null)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessons
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{selectedLesson.description}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: getDifficultyColor(selectedLesson.difficulty),
                        color: getDifficultyColor(selectedLesson.difficulty)
                      }}
                    >
                      {selectedLesson.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  {selectedLesson.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{selectedLesson.progress}%</span>
                      </div>
                      <Progress value={selectedLesson.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Interactive Lesson Content */}
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8 text-center border-2 border-dashed border-primary/20">
                    <BookOpen className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold mb-4">Interactive Lesson Content</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      This lesson includes interactive diagrams, animations, practice problems, and real-world applications of {selectedLesson.subject}.
                    </p>
                    
                    {/* Sample lesson content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-white/50 rounded-lg border">
                        <h4 className="font-medium mb-2">📖 Theory</h4>
                        <p className="text-sm text-muted-foreground">Interactive explanations with diagrams</p>
                      </div>
                      <div className="p-4 bg-white/50 rounded-lg border">
                        <h4 className="font-medium mb-2">🧪 Practice</h4>
                        <p className="text-sm text-muted-foreground">Hands-on exercises and simulations</p>
                      </div>
                      <div className="p-4 bg-white/50 rounded-lg border">
                        <h4 className="font-medium mb-2">📊 Assessment</h4>
                        <p className="text-sm text-muted-foreground">Quiz questions and feedback</p>
                      </div>
                      <div className="p-4 bg-white/50 rounded-lg border">
                        <h4 className="font-medium mb-2">🎯 Application</h4>
                        <p className="text-sm text-muted-foreground">Real-world examples and cases</p>
                      </div>
                    </div>
                    
                    <Button size="lg" className="animate-pulse">
                      <PlayCircle className="h-5 w-5 mr-2" />
                      {selectedLesson.progress > 0 ? 'Continue Learning' : 'Start Lesson'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Lesson Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lesson Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedLesson.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="text-sm">{selectedLesson.rating}/5.0 rating</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedLesson.enrolledStudents} students enrolled</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-success" />
                    <span className="text-sm">{selectedLesson.xpReward} XP reward</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Basic understanding of high school mathematics and science concepts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Interactive Lessons
                </h1>
                <p className="text-muted-foreground">Discover and learn with our comprehensive STEM curriculum</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-8 animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Subject Filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.value}
                      variant={selectedSubject === subject.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubject(subject.value)}
                      className="text-xs"
                    >
                      {subject.icon} {subject.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Difficulty Filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty.value}
                      variant={selectedDifficulty === difficulty.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty.value)}
                      className="text-xs"
                    >
                      {difficulty.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <Card 
              key={lesson.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {lesson.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getSubjectColor(lesson.subject),
                          color: getSubjectColor(lesson.subject)
                        }}
                        className="text-xs"
                      >
                        {lesson.subject}
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getDifficultyColor(lesson.difficulty),
                          color: getDifficultyColor(lesson.difficulty)
                        }}
                        className="text-xs"
                      >
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {lesson.completed && (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lesson.description}
                </p>
                
                {/* Progress */}
                {lesson.progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-1.5" />
                  </div>
                )}
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{lesson.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>{lesson.xpReward} XP</span>
                  </div>
                </div>
                
                <Button className="w-full" size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {lesson.progress > 0 ? 'Continue' : 'Start Lesson'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredLessons.length === 0 && (
          <Card className="p-12 text-center animate-fade-in">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more lessons.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}