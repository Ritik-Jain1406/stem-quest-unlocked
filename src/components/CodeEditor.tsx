import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CodeChallenge } from '@/types/stem';
import { Play, Check, X } from 'lucide-react';

interface CodeEditorProps {
  challenge: CodeChallenge;
  onComplete: (score: number) => void;
}

export function CodeEditor({ challenge, onComplete }: CodeEditorProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Simple JavaScript evaluation for demo
        if (challenge.language === 'javascript') {
          // Capture console.log output
          let capturedOutput = '';
          const originalLog = console.log;
          console.log = (...args) => {
            capturedOutput += args.join(' ') + '\n';
          };
          
          // Execute the code
          eval(code);
          
          // Restore console.log
          console.log = originalLog;
          
          setOutput(capturedOutput.trim());
          
          // Check if output matches expected
          const results = challenge.testCases.map(testCase => 
            capturedOutput.trim() === testCase.expectedOutput
          );
          setTestResults(results);
          
          if (results.every(result => result)) {
            setIsCompleted(true);
            onComplete(100);
          }
        }
      } catch (error) {
        setOutput(`Error: ${error}`);
        setTestResults([false]);
      }
      
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Code Challenge</h3>
          
          <div className="space-y-4">
            {/* Expected Output */}
            <div>
              <h4 className="font-medium mb-2">Expected Output:</h4>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                {challenge.expectedOutput}
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <h4 className="font-medium mb-2">Your Code ({challenge.language}):</h4>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                placeholder="Write your code here..."
              />
            </div>

            {/* Run Button */}
            <div className="flex gap-2">
              <Button 
                onClick={runCode} 
                disabled={isRunning || isCompleted}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>

            {/* Output */}
            {output && (
              <div>
                <h4 className="font-medium mb-2">Output:</h4>
                <div className="bg-black text-green-400 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                  {output}
                </div>
              </div>
            )}

            {/* Test Results */}
            {testResults.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Test Results:</h4>
                <div className="space-y-2">
                  {challenge.testCases.map((testCase, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 p-3 rounded ${
                        testResults[index] 
                          ? 'bg-success/10 border border-success/20 text-success'
                          : 'bg-destructive/10 border border-destructive/20 text-destructive'
                      }`}
                    >
                      {testResults[index] ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span className="font-mono text-sm">
                        Test {index + 1}: Expected "{testCase.expectedOutput}"
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {isCompleted && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-success">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold">Code Challenge Completed!</span>
                </div>
                <p className="text-sm mt-1">
                  Excellent work! Your code produces the expected output.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}