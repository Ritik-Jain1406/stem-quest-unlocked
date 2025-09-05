import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lab } from '@/types/stem';
import { ArrowLeft, Play, CheckCircle, Code, Beaker, Brain, HelpCircle } from 'lucide-react';
import { QuizComponent } from './QuizComponent';
import { SimulationComponent } from './SimulationComponent';
import { CodeEditor } from './CodeEditor';

interface VirtualLabProps {
  lab: Lab;
  onComplete: (score?: number) => void;
  onBack: () => void;
}

export function VirtualLab({ lab, onComplete, onBack }: VirtualLabProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [labScore, setLabScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const getLabIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <HelpCircle className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'simulation': return <Play className="h-5 w-5" />;
      case 'experiment': return <Beaker className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const handleLabComplete = (score: number) => {
    setLabScore(score);
    setIsCompleted(true);
  };

  const handleFinish = () => {
    onComplete(labScore);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Badge variant="outline" className="flex items-center gap-2">
            {getLabIcon(lab.type)}
            {lab.type.charAt(0).toUpperCase() + lab.type.slice(1)}
          </Badge>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {lab.title}
              {isCompleted && <CheckCircle className="h-6 w-6 text-success" />}
            </CardTitle>
            <p className="text-muted-foreground">{lab.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Instructions</h3>
              <p className="text-muted-foreground">{lab.content.instructions}</p>
              
              {lab.content.materials && (
                <div>
                  <h4 className="font-medium mb-2">Materials Needed:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {lab.content.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lab.content.steps && (
                <div>
                  <h4 className="font-medium mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {lab.content.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Lab Content */}
            <div className="border rounded-lg p-6 bg-muted/50">
              {lab.type === 'quiz' && lab.content.questions && (
                <QuizComponent
                  questions={lab.content.questions}
                  onComplete={handleLabComplete}
                />
              )}

              {lab.type === 'simulation' && lab.content.simulation && (
                <SimulationComponent
                  config={lab.content.simulation}
                  onComplete={handleLabComplete}
                />
              )}

              {lab.type === 'coding' && lab.content.code && (
                <CodeEditor
                  challenge={lab.content.code}
                  onComplete={handleLabComplete}
                />
              )}

              {lab.type === 'experiment' && (
                <div className="text-center py-8">
                  <Beaker className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Virtual Experiment</h3>
                  <p className="text-muted-foreground mb-4">
                    Follow the instructions above to complete this experiment.
                  </p>
                  <Button onClick={() => handleLabComplete(100)}>
                    Mark as Complete
                  </Button>
                </div>
              )}
            </div>

            {/* Completion Section */}
            {isCompleted && (
              <div className="border rounded-lg p-6 bg-success/10 border-success/20">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-success mb-2">
                    Lab Completed!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Score: {labScore}/100
                  </p>
                  <Button onClick={handleFinish}>
                    Continue to Next Lab
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}