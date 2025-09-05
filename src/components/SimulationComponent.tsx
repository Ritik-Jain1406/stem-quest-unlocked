import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { SimulationConfig } from '@/types/stem';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface SimulationComponentProps {
  config: SimulationConfig;
  onComplete: (score: number) => void;
}

export function SimulationComponent({ config, onComplete }: SimulationComponentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState(config.parameters);
  const [simulationStep, setSimulationStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
    // Simulate running animation
    const interval = setInterval(() => {
      setSimulationStep(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setIsCompleted(true);
          onComplete(85); // Give a good score for completing
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimulationStep(0);
    setIsCompleted(false);
  };

  const updateParameter = (key: string, value: number[]) => {
    setParameters(prev => ({ ...prev, [key]: value[0] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-6">
            {config.type.charAt(0).toUpperCase() + config.type.slice(1)} Simulation
          </h3>

          {/* Simulation Controls */}
          <div className="space-y-4 mb-6">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Parameters
            </h4>
            
            {Object.entries(parameters).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {typeof value === 'number' ? value.toFixed(1) : value}
                  </span>
                </div>
                {typeof value === 'number' && (
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => updateParameter(key, newValue)}
                    max={key === 'gravity' ? 20 : 100}
                    min={0}
                    step={0.1}
                    disabled={isRunning}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Simulation Display */}
          <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-lg p-8 min-h-[300px] relative overflow-hidden">
            {config.type === 'physics' && (
              <PhysicsSimulation 
                parameters={parameters} 
                step={simulationStep} 
                isRunning={isRunning} 
              />
            )}
            {config.type === 'chemistry' && (
              <ChemistrySimulation 
                parameters={parameters} 
                step={simulationStep} 
                isRunning={isRunning} 
              />
            )}
            {config.type === 'biology' && (
              <BiologySimulation 
                parameters={parameters} 
                step={simulationStep} 
                isRunning={isRunning} 
              />
            )}
            {config.type === 'math' && (
              <MathSimulation 
                parameters={parameters} 
                step={simulationStep} 
                isRunning={isRunning} 
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-6">
            <Button 
              onClick={handleStart} 
              disabled={isRunning || isCompleted}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isCompleted ? 'Completed' : 'Start Simulation'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            {isRunning && (
              <div className="ml-4 text-sm text-muted-foreground">
                Running... {simulationStep}%
              </div>
            )}
          </div>

          {isCompleted && (
            <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-success font-medium">
                ✅ Simulation completed successfully! Great observation skills.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simulation Components
function PhysicsSimulation({ parameters, step, isRunning }: any) {
  const dropHeight = Math.min(step * 2, 200);
  
  return (
    <div className="relative w-full h-full">
      <div className="text-center mb-4">
        <h4 className="font-semibold">Gravity Simulation</h4>
        <p className="text-sm text-muted-foreground">
          Watch objects fall under gravity: {parameters.gravity} m/s²
        </p>
      </div>
      
      {parameters.objects?.map((obj: string, index: number) => (
        <div
          key={obj}
          className={`absolute w-8 h-8 rounded-full transition-all duration-100 ${
            obj === 'feather' ? 'bg-yellow-300' : 
            obj === 'ball' ? 'bg-red-500' : 'bg-gray-600'
          }`}
          style={{
            left: `${20 + index * 60}px`,
            top: `${dropHeight * (parameters.gravity / 10)}px`,
            transform: isRunning ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
            {obj[0].toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChemistrySimulation({ parameters, step }: any) {
  return (
    <div className="text-center">
      <h4 className="font-semibold mb-4">Chemical Reaction</h4>
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
          H₂O
        </div>
        <div className="text-2xl">+</div>
        <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
          NaCl
        </div>
        <div className="text-2xl">→</div>
        <div 
          className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center transition-all"
          style={{ opacity: step / 100 }}
        >
          Solution
        </div>
      </div>
      <p className="mt-4 text-sm">Reaction progress: {step}%</p>
    </div>
  );
}

function BiologySimulation({ parameters, step }: any) {
  return (
    <div className="text-center">
      <h4 className="font-semibold mb-4">Cell Division</h4>
      <div className="flex items-center justify-center">
        <div 
          className="relative transition-all duration-500"
          style={{ 
            transform: step > 50 ? 'scale(1.5)' : 'scale(1)',
            opacity: step > 75 ? 0.5 : 1 
          }}
        >
          <div className="w-20 h-20 border-4 border-green-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-green-300 rounded-full"></div>
          </div>
          {step > 75 && (
            <div className="absolute top-0 left-24 w-20 h-20 border-4 border-green-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-300 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm">Cell division progress: {step}%</p>
    </div>
  );
}

function MathSimulation({ parameters, step }: any) {
  const x = (step / 100) * 6 - 3; // -3 to 3
  const y = Math.sin(x) * 50 + 100; // sine wave
  
  return (
    <div className="text-center">
      <h4 className="font-semibold mb-4">Function Visualization</h4>
      <div className="relative bg-white rounded border" style={{ height: '200px' }}>
        <svg width="100%" height="100%" viewBox="0 0 300 200">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Axes */}
          <line x1="0" y1="100" x2="300" y2="100" stroke="#666" strokeWidth="2" />
          <line x1="150" y1="0" x2="150" y2="200" stroke="#666" strokeWidth="2" />
          
          {/* Function curve */}
          <path
            d={`M 0 ${100 + Math.sin(-3) * 50} ${Array.from({length: Math.floor(step * 3)}, (_, i) => {
              const xVal = (i / 100) * 6 - 3;
              const yVal = 100 + Math.sin(xVal) * 50;
              return `L ${(i / 100) * 300} ${yVal}`;
            }).join(' ')}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          
          {/* Moving point */}
          <circle 
            cx={(step / 100) * 300} 
            cy={y} 
            r="5" 
            fill="#ef4444"
          />
        </svg>
      </div>
      <p className="mt-4 text-sm">y = sin(x) at x = {x.toFixed(2)}</p>
    </div>
  );
}