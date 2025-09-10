import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  FlaskConical, 
  Zap, 
  Microscope, 
  Code,
  Play,
  RotateCcw,
  Settings,
  BookOpen,
  Award,
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react';

interface VirtualLabProps {
  onBack?: () => void;
}

interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  xpReward: number;
  steps: string[];
}

interface LabCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  labs: Lab[];
}

export function VirtualLab({ onBack }: VirtualLabProps) {
  const [activeTab, setActiveTab] = useState('physics');
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [labProgress, setLabProgress] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const labCategories: LabCategory[] = [
    {
      id: 'physics',
      name: 'Physics',
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      labs: [
        {
          id: 'pendulum',
          title: 'Simple Pendulum',
          description: 'Study oscillatory motion and calculate period',
          difficulty: 'Beginner',
          duration: '15 min',
          completed: false,
          xpReward: 50,
          steps: [
            'Set up the pendulum apparatus',
            'Adjust the length to 1 meter',
            'Release from 15° angle',
            'Measure 10 complete oscillations',
            'Calculate the period',
            'Record your observations'
          ]
        },
        {
          id: 'optics',
          title: 'Ray Optics',
          description: 'Explore reflection and refraction',
          difficulty: 'Intermediate',
          duration: '20 min',
          completed: false,
          xpReward: 75,
          steps: [
            'Set up ray box and mirrors',
            'Observe reflection patterns',
            'Test with convex lens',
            'Measure focal length',
            'Document light paths'
          ]
        }
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: FlaskConical,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      labs: [
        {
          id: 'titration',
          title: 'Acid-Base Titration',
          description: 'Determine concentration through titration',
          difficulty: 'Intermediate',
          duration: '25 min',
          completed: false,
          xpReward: 100,
          steps: [
            'Prepare the titration setup',
            'Fill burette with NaOH solution',
            'Add indicator to acid solution',
            'Begin titration slowly',
            'Observe color change',
            'Calculate concentration'
          ]
        },
        {
          id: 'reactions',
          title: 'Chemical Reactions',
          description: 'Visualize molecular interactions',
          difficulty: 'Advanced',
          duration: '30 min',
          completed: false,
          xpReward: 125,
          steps: [
            'Select reactant molecules',
            'Adjust temperature settings',
            'Initiate reaction simulation',
            'Observe bond formations',
            'Analyze energy changes'
          ]
        }
      ]
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: Microscope,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      labs: [
        {
          id: 'cell',
          title: 'Cell Structure',
          description: 'Explore plant and animal cells',
          difficulty: 'Beginner',
          duration: '20 min',
          completed: false,
          xpReward: 60,
          steps: [
            'Prepare microscope slide',
            'Focus on cell membrane',
            'Identify organelles',
            'Compare plant vs animal cells',
            'Sketch your observations'
          ]
        },
        {
          id: 'genetics',
          title: 'Genetics Lab',
          description: 'Study inheritance patterns',
          difficulty: 'Advanced',
          duration: '35 min',
          completed: false,
          xpReward: 150,
          steps: [
            'Set up Punnett squares',
            'Cross different traits',
            'Analyze F1 generation',
            'Predict F2 outcomes',
            'Calculate probability ratios'
          ]
        }
      ]
    },
    {
      id: 'computer',
      name: 'Computer Science',
      icon: Code,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      labs: [
        {
          id: 'algorithms',
          title: 'Sorting Algorithms',
          description: 'Visualize different sorting techniques',
          difficulty: 'Intermediate',
          duration: '20 min',
          completed: false,
          xpReward: 80,
          steps: [
            'Choose array size and type',
            'Select sorting algorithm',
            'Start visualization',
            'Observe comparison steps',
            'Analyze time complexity'
          ]
        },
        {
          id: 'data-structures',
          title: 'Data Structures',
          description: 'Interactive trees and graphs',
          difficulty: 'Advanced',
          duration: '30 min',
          completed: false,
          xpReward: 120,
          steps: [
            'Build binary tree structure',
            'Insert nodes interactively',
            'Perform tree traversals',
            'Balance the tree',
            'Test search operations'
          ]
        }
      ]
    }
  ];

  const handleStepComplete = () => {
    const lab = labCategories
      .find(cat => cat.labs.some(l => l.id === selectedLab))
      ?.labs.find(l => l.id === selectedLab);
    
    if (!lab) return;

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    const progress = Math.round((nextStep / lab.steps.length) * 100);
    setLabProgress(prev => ({ ...prev, [selectedLab!]: progress }));

    if (nextStep >= lab.steps.length) {
      // Lab completed
      toast({
        title: "🎉 Lab Completed!",
        description: `You earned ${lab.xpReward} XP!`,
      });
      
      // Here you would update the backend with completion status
      lab.completed = true;
    } else {
      toast({
        title: "Step Completed!",
        description: `Step ${nextStep} of ${lab.steps.length} completed.`,
      });
    }
  };

  const resetLab = () => {
    setCurrentStep(0);
    if (selectedLab) {
      setLabProgress(prev => ({ ...prev, [selectedLab]: 0 }));
    }
  };

  const InteractiveSimulation = ({ labId }: { labId: string }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [measurements, setMeasurements] = useState<string[]>([]);

    const runSimulation = () => {
      setIsRunning(true);
      
      // Simulate lab experiment
      setTimeout(() => {
        const measurement = Math.random() * 10 + 5; // Random measurement
        setMeasurements(prev => [...prev, `${measurement.toFixed(2)} units`]);
        setIsRunning(false);
        
        toast({
          title: "Measurement Recorded",
          description: `Value: ${measurement.toFixed(2)} units`,
        });
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 border-2 border-dashed border-primary/20">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <FlaskConical className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Interactive Lab Environment</h3>
            <p className="text-muted-foreground">
              Click 'Run Simulation' to begin the experiment
            </p>
            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </div>

        {measurements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {measurements.map((measurement, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span>{measurement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (selectedLab) {
    const category = labCategories.find(cat => cat.labs.some(lab => lab.id === selectedLab));
    const lab = category?.labs.find(lab => lab.id === selectedLab);
    
    if (!lab) return null;

    const progress = labProgress[selectedLab] || 0;
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedLab(null)}
              className="mb-4 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Labs
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {lab.title}
            </h1>
            <p className="text-muted-foreground mt-2">{lab.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetLab}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                <InteractiveSimulation labId={selectedLab} />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lab Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lab.steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        index < currentStep 
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                          : index === currentStep
                          ? 'bg-primary/5 border border-primary/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className={`mt-0.5 ${
                        index < currentStep 
                          ? 'text-green-500' 
                          : index === currentStep
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}>
                        {index < currentStep ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          index < currentStep ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {step}
                        </p>
                        {index === currentStep && (
                          <Button 
                            size="sm" 
                            className="mt-2"
                            onClick={handleStepComplete}
                          >
                            Complete Step
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{currentStep}</div>
                      <div className="text-xs text-muted-foreground">Steps Done</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent flex items-center justify-center gap-1">
                        {Math.round((progress / 100) * lab.xpReward)}
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-muted-foreground">XP Earned</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Virtual Labs
        </h1>
        <p className="text-muted-foreground text-lg">
          Hands-on experiments in immersive virtual environments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          {labCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className="flex items-center gap-2 data-[state=active]:bg-primary/10"
              >
                <Icon className={`h-4 w-4 ${category.color}`} />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {labCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {category.labs.map((lab) => (
                <Card 
                  key={lab.id} 
                  className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 border-0 shadow-md"
                  onClick={() => setSelectedLab(lab.id)}
                >
                  <CardHeader className={category.bgColor}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${category.bgColor} border`}>
                          <category.icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{lab.title}</CardTitle>
                          <p className="text-muted-foreground text-sm mt-1">
                            {lab.description}
                          </p>
                        </div>
                      </div>
                      {lab.completed && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge 
                          variant="outline" 
                          className={
                            lab.difficulty === 'Beginner' ? 'border-green-400 text-green-600' :
                            lab.difficulty === 'Intermediate' ? 'border-yellow-400 text-yellow-600' :
                            'border-red-400 text-red-600'
                          }
                        >
                          {lab.difficulty}
                        </Badge>
                        <Badge variant="outline">{lab.duration}</Badge>
                        <Badge variant="outline" className="text-accent">
                          +{lab.xpReward} XP
                        </Badge>
                      </div>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Lab
                      </Button>
                    </div>
                    
                    {labProgress[lab.id] && labProgress[lab.id] > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{labProgress[lab.id]}%</span>
                        </div>
                        <Progress value={labProgress[lab.id]} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}