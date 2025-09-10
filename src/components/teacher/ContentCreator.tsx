import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, BookOpen, Brain, FlaskConical } from 'lucide-react';

interface ContentCreatorProps {
  onBack: () => void;
}

export function ContentCreator({ onBack }: ContentCreatorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Content Creator</h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Create Lesson</h3>
              <p className="text-sm text-muted-foreground">Interactive multimedia lessons</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Create Quiz</h3>
              <p className="text-sm text-muted-foreground">Assessment and practice quizzes</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <FlaskConical className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Create Lab</h3>
              <p className="text-sm text-muted-foreground">Virtual laboratory experiments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}