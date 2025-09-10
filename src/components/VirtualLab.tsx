import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, Beaker, Microscope, Cpu, Calculator, Lightbulb } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Experiment {
  id: string;
  title: string;
  subject: 'physics' | 'chemistry' | 'biology' | 'computer';
  grade: string;
  description: string;
  materials: string[];
  steps: string[];
  code?: string;
  expectedResult: string;
}

const experiments: Experiment[] = [
  {
    id: '1',
    title: 'Simple Pendulum Motion',
    subject: 'physics',
    grade: 'Class 9-10',
    description: 'Study the motion of a simple pendulum and calculate its time period.',
    materials: ['String', 'Bob', 'Scale', 'Stopwatch'],
    steps: [
      'Set up the pendulum with a 1-meter string',
      'Release the bob from a 15-degree angle',
      'Measure time for 10 oscillations',
      'Calculate the time period using T = total time / 10',
      'Compare with theoretical value T = 2π√(l/g)'
    ],
    expectedResult: 'Time period ≈ 2 seconds for 1-meter pendulum'
  },
  {
    id: '2',
    title: 'Acid-Base Reaction',
    subject: 'chemistry',
    grade: 'Class 8-9',
    description: 'Observe the neutralization reaction between HCl and NaOH.',
    materials: ['HCl solution', 'NaOH solution', 'Phenolphthalein', 'Beaker'],
    steps: [
      'Add 2-3 drops of phenolphthalein to NaOH solution',
      'Slowly add HCl drop by drop',
      'Observe color change from pink to colorless',
      'Note the point of neutralization'
    ],
    expectedResult: 'Pink color disappears at neutralization point'
  },
  {
    id: '3',
    title: 'Cell Structure Observation',
    subject: 'biology',
    grade: 'Class 7-8',
    description: 'Observe plant and animal cells under microscope.',
    materials: ['Microscope', 'Onion peel', 'Cheek cells', 'Iodine', 'Methylene blue'],
    steps: [
      'Prepare onion peel slide with iodine stain',
      'Observe under 10x and 40x magnification',
      'Prepare cheek cell slide with methylene blue',
      'Compare plant and animal cell structures'
    ],
    expectedResult: 'Plant cells show cell wall, animal cells show flexible membrane'
  },
  {
    id: '4',
    title: 'Python Functions',
    subject: 'computer',
    grade: 'Class 11-12',
    description: 'Learn to create and use functions in Python.',
    materials: ['Computer', 'Python IDE'],
    steps: [
      'Define a function to calculate area of circle',
      'Use parameters and return values',
      'Call the function with different inputs',
      'Test with various radius values'
    ],
    code: `def calculate_area(radius):
    """Calculate area of circle"""
    import math
    area = math.pi * radius * radius
    return area

# Test the function
radius = 5
area = calculate_area(radius)
print(f"Area of circle with radius {radius} is {area:.2f}")`,
    expectedResult: 'Area of circle with radius 5 is 78.54'
  }
];

interface VirtualLabProps {
  lab?: any;
  onComplete?: (score: number) => void;
  onBack?: () => void;
}

export function VirtualLab({ lab, onComplete, onBack }: VirtualLabProps) {
  const { t } = useTranslation();
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [activeTab, setActiveTab] = useState('physics');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [userCode, setUserCode] = useState<string>('');

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'physics': return <Calculator className="h-4 w-4" />;
      case 'chemistry': return <Beaker className="h-4 w-4" />;
      case 'biology': return <Microscope className="h-4 w-4" />;
      case 'computer': return <Cpu className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'physics': return 'hsl(var(--mathematics))';
      case 'chemistry': return 'hsl(var(--science))';
      case 'biology': return 'hsl(var(--engineering))';
      case 'computer': return 'hsl(var(--technology))';
      default: return 'hsl(var(--primary))';
    }
  };

  const runCode = () => {
    if (!selectedExperiment?.code) return;
    
    try {
      // Simulate code execution
      if (selectedExperiment.subject === 'computer') {
        setCodeOutput(selectedExperiment.expectedResult);
      }
    } catch (error) {
      setCodeOutput('Error: Invalid code');
    }
  };

  const filteredExperiments = experiments.filter(exp => exp.subject === activeTab);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Virtual Labs - Interactive Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="physics" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Physics
              </TabsTrigger>
              <TabsTrigger value="chemistry" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Chemistry
              </TabsTrigger>
              <TabsTrigger value="biology" className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Biology
              </TabsTrigger>
              <TabsTrigger value="computer" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Computer Science
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredExperiments.map((experiment) => (
                  <Card 
                    key={experiment.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedExperiment(experiment)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSubjectIcon(experiment.subject)}
                          <h3 className="font-medium">{experiment.title}</h3>
                        </div>
                        <Badge variant="outline">{experiment.grade}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {experiment.description}
                      </p>
                      <Button size="sm" className="w-full">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Experiment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedExperiment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSubjectIcon(selectedExperiment.subject)}
              {selectedExperiment.title}
              <Badge variant="outline">{selectedExperiment.grade}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{selectedExperiment.description}</p>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">Materials Required:</h4>
                <ul className="space-y-1">
                  {selectedExperiment.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Procedure:</h4>
                <ol className="space-y-2">
                  {selectedExperiment.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {selectedExperiment.code && (
              <div className="space-y-4">
                <h4 className="font-medium">Code:</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{selectedExperiment.code}</code>
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button onClick={runCode}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Run Code
                  </Button>
                </div>
                {codeOutput && (
                  <div className="bg-muted rounded-lg p-4">
                    <h5 className="font-medium mb-2">Output:</h5>
                    <pre className="text-sm">{codeOutput}</pre>
                  </div>
                )}
              </div>
            )}

            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-medium mb-2">Expected Result:</h4>
              <p className="text-sm">{selectedExperiment.expectedResult}</p>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setSelectedExperiment(null)}
            >
              Back to Experiments
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}