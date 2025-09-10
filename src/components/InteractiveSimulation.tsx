import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Line, Path } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Beaker,
  Zap,
  Activity,
  FlaskConical,
  Thermometer,
  Timer
} from 'lucide-react';

interface InteractiveSimulationProps {
  labType: string;
  onProgress?: (progress: number) => void;
}

export function InteractiveSimulation({ labType, onProgress }: InteractiveSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState<any>({});
  const [measurements, setMeasurements] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Simulation parameters
  const [parameters, setParameters] = useState({
    temperature: 25,
    concentration: 0.1,
    pH: 7,
    time: 0,
    speed: 1
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#f8fafc',
    });

    setFabricCanvas(canvas);
    initializeSimulation(canvas, labType);

    return () => {
      canvas.dispose();
    };
  }, [labType]);

  const initializeSimulation = (canvas: FabricCanvas, type: string) => {
    canvas.clear();
    canvas.backgroundColor = '#f8fafc';

    switch (type) {
      case 'titration':
        setupTitrationSimulation(canvas);
        break;
      case 'pendulum':
        setupPendulumSimulation(canvas);
        break;
      case 'cell':
        setupCellSimulation(canvas);
        break;
      case 'algorithms':
        setupAlgorithmVisualization(canvas);
        break;
      default:
        setupDefaultSimulation(canvas);
    }

    canvas.renderAll();
  };

  const setupTitrationSimulation = (canvas: FabricCanvas) => {
    // Burette
    const burette = new Rect({
      left: 100,
      top: 50,
      width: 20,
      height: 200,
      fill: 'transparent',
      stroke: '#374151',
      strokeWidth: 2,
    });

    // Burette liquid
    const buretteLiquid = new Rect({
      left: 102,
      top: 52,
      width: 16,
      height: 150,
      fill: '#3b82f6',
      selectable: false,
    });

    // Beaker
    const beaker = new Circle({
      left: 300,
      top: 200,
      radius: 80,
      fill: 'transparent',
      stroke: '#374151',
      strokeWidth: 3,
    });

    // Beaker liquid
    const beakerLiquid = new Circle({
      left: 302,
      top: 202,
      radius: 75,
      fill: '#ec4899',
      opacity: 0.7,
      selectable: false,
    });

    // Add titration setup
    canvas.add(burette, buretteLiquid, beaker, beakerLiquid);

    // Store references for animation
    setSimulationData({
      burette,
      buretteLiquid,
      beaker,
      beakerLiquid,
      type: 'titration'
    });
  };

  const setupPendulumSimulation = (canvas: FabricCanvas) => {
    // Pendulum string
    const string = new Line([300, 50, 350, 200], {
      stroke: '#374151',
      strokeWidth: 2,
      selectable: false,
    });

    // Pendulum bob
    const bob = new Circle({
      left: 340,
      top: 190,
      radius: 15,
      fill: '#f59e0b',
      stroke: '#d97706',
      strokeWidth: 2,
    });

    // Pivot point
    const pivot = new Circle({
      left: 295,
      top: 45,
      radius: 5,
      fill: '#374151',
      selectable: false,
    });

    canvas.add(string, bob, pivot);

    setSimulationData({
      string,
      bob,
      pivot,
      angle: Math.PI / 6,
      angularVelocity: 0,
      type: 'pendulum'
    });
  };

  const setupCellSimulation = (canvas: FabricCanvas) => {
    // Cell membrane
    const membrane = new Circle({
      left: 200,
      top: 150,
      radius: 120,
      fill: 'transparent',
      stroke: '#374151',
      strokeWidth: 3,
    });

    // Nucleus
    const nucleus = new Circle({
      left: 220,
      top: 170,
      radius: 40,
      fill: '#8b5cf6',
      opacity: 0.7,
    });

    // Mitochondria
    const mitochondria1 = new Circle({
      left: 280,
      top: 120,
      radius: 15,
      fill: '#ef4444',
      opacity: 0.8,
    });

    const mitochondria2 = new Circle({
      left: 160,
      top: 200,
      radius: 15,
      fill: '#ef4444',
      opacity: 0.8,
    });

    canvas.add(membrane, nucleus, mitochondria1, mitochondria2);

    setSimulationData({
      membrane,
      nucleus,
      mitochondria: [mitochondria1, mitochondria2],
      type: 'cell'
    });
  };

  const setupAlgorithmVisualization = (canvas: FabricCanvas) => {
    // Array visualization
    const array = [64, 34, 25, 12, 22, 11, 90];
    const bars = array.map((value, index) => {
      return new Rect({
        left: 50 + index * 70,
        top: 300 - value * 2,
        width: 60,
        height: value * 2,
        fill: '#3b82f6',
        stroke: '#1d4ed8',
        strokeWidth: 2,
      });
    });

    bars.forEach(bar => canvas.add(bar));

    setSimulationData({
      bars,
      array,
      type: 'sorting'
    });
  };

  const setupDefaultSimulation = (canvas: FabricCanvas) => {
    // Default interactive elements
    const molecule1 = new Circle({
      left: 150,
      top: 150,
      radius: 20,
      fill: '#3b82f6',
    });

    const molecule2 = new Circle({
      left: 400,
      top: 200,
      radius: 20,
      fill: '#ef4444',
    });

    canvas.add(molecule1, molecule2);

    setSimulationData({
      molecule1,
      molecule2,
      type: 'default'
    });
  };

  const runSimulation = () => {
    if (!fabricCanvas || isRunning) return;

    setIsRunning(true);
    setProgress(0);

    let animationFrame: number;
    let startTime = Date.now();
    const duration = 5000; // 5 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressPercent);

      switch (simulationData.type) {
        case 'titration':
          animateTitration(elapsed / duration);
          break;
        case 'pendulum':
          animatePendulum(elapsed / 100);
          break;
        case 'cell':
          animateCell(elapsed / 1000);
          break;
        case 'sorting':
          animateSorting(elapsed / duration);
          break;
      }

      fabricCanvas.renderAll();

      if (progressPercent < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        recordMeasurement();
        onProgress?.(100);
      }
    };

    animationFrame = requestAnimationFrame(animate);
  };

  const animateTitration = (progress: number) => {
    if (!simulationData.beakerLiquid) return;

    // Color change simulation
    const r = Math.floor(236 + (59 - 236) * progress); // Pink to blue
    const g = Math.floor(72 + (130 - 72) * progress);
    const b = Math.floor(153 + (246 - 153) * progress);

    simulationData.beakerLiquid.set('fill', `rgb(${r}, ${g}, ${b})`);

    // Burette liquid level
    if (simulationData.buretteLiquid) {
      const newHeight = Math.max(20, 150 - progress * 130);
      simulationData.buretteLiquid.set('height', newHeight);
    }
  };

  const animatePendulum = (time: number) => {
    if (!simulationData.bob || !simulationData.string) return;

    const length = 150;
    const gravity = 9.81;
    const damping = 0.995;

    // Simple pendulum physics
    simulationData.angularVelocity += (-gravity / length) * Math.sin(simulationData.angle) * 0.01;
    simulationData.angularVelocity *= damping;
    simulationData.angle += simulationData.angularVelocity;

    const bobX = 300 + length * Math.sin(simulationData.angle);
    const bobY = 50 + length * Math.cos(simulationData.angle);

    simulationData.bob.set({
      left: bobX - 15,
      top: bobY - 15
    });

    simulationData.string.set({
      x2: bobX,
      y2: bobY
    });
  };

  const animateCell = (time: number) => {
    if (!simulationData.mitochondria) return;

    // Animate mitochondria movement
    simulationData.mitochondria.forEach((mito: any, index: number) => {
      const offset = Math.sin(time + index * Math.PI) * 10;
      mito.set({
        left: mito.originalLeft || mito.left + Math.cos(time + index) * 5,
        top: mito.originalTop || mito.top + offset
      });
    });
  };

  const animateSorting = (progress: number) => {
    // Simple bubble sort visualization
    if (!simulationData.bars || progress < 0.5) return;

    const sortProgress = (progress - 0.5) * 2;
    const targetArray = [11, 12, 22, 25, 34, 64, 90];

    simulationData.bars.forEach((bar: any, index: number) => {
      const currentHeight = simulationData.array[index] * 2;
      const targetHeight = targetArray[index] * 2;
      const newHeight = currentHeight + (targetHeight - currentHeight) * sortProgress;
      
      bar.set({
        height: newHeight,
        top: 300 - newHeight,
        fill: sortProgress > 0.8 ? '#10b981' : '#3b82f6'
      });
    });
  };

  const recordMeasurement = () => {
    const measurement = generateMeasurement();
    setMeasurements(prev => [...prev, measurement]);
    
    toast({
      title: "Measurement Recorded",
      description: measurement,
    });
  };

  const generateMeasurement = () => {
    switch (simulationData.type) {
      case 'titration':
        return `pH change: ${(7 + Math.random() * 2).toFixed(2)} → ${(3 + Math.random()).toFixed(2)}`;
      case 'pendulum':
        return `Period: ${(2 + Math.random() * 0.5).toFixed(2)} seconds`;
      case 'cell':
        return `Mitochondria count: ${Math.floor(15 + Math.random() * 10)}`;
      case 'sorting':
        return `Comparisons: ${Math.floor(10 + Math.random() * 15)}`;
      default:
        return `Value: ${(Math.random() * 100).toFixed(2)} units`;
    }
  };

  const resetSimulation = () => {
    if (!fabricCanvas) return;
    
    setIsRunning(false);
    setProgress(0);
    setMeasurements([]);
    initializeSimulation(fabricCanvas, labType);
  };

  const getSimulationTitle = () => {
    switch (labType) {
      case 'titration': return 'Acid-Base Titration';
      case 'pendulum': return 'Simple Pendulum';
      case 'cell': return 'Cell Structure';
      case 'algorithms': return 'Sorting Algorithm';
      default: return 'Interactive Simulation';
    }
  };

  const getSimulationIcon = () => {
    switch (labType) {
      case 'titration': return <FlaskConical className="h-5 w-5" />;
      case 'pendulum': return <Activity className="h-5 w-5" />;
      case 'cell': return <Zap className="h-5 w-5" />;
      case 'algorithms': return <Settings className="h-5 w-5" />;
      default: return <Beaker className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getSimulationIcon()}
            {getSimulationTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Canvas */}
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
              <canvas 
                ref={canvasRef} 
                className="max-w-full border rounded-lg shadow-sm bg-white"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={runSimulation} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Timer className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Simulation
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={resetSimulation}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Progress */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Simulation Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Simulation Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium">Temperature (°C)</label>
                    <Slider
                      value={[parameters.temperature]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, temperature: value }))}
                      max={100}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-muted-foreground">{parameters.temperature}°C</span>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Speed</label>
                    <Slider
                      value={[parameters.speed]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, speed: value }))}
                      max={3}
                      min={0.5}
                      step={0.1}
                      className="mt-2"
                    />
                    <span className="text-xs text-muted-foreground">{parameters.speed}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Measurements */}
      {measurements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Recorded Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {measurements.map((measurement, index) => (
                <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
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
}