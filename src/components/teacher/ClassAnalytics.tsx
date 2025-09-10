import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Users } from 'lucide-react';

interface ClassAnalyticsProps {
  onBack: () => void;
}

export function ClassAnalytics({ onBack }: ClassAnalyticsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Class Analytics</h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Performance Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed performance insights</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">Student progress over time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Class Overview</h3>
              <p className="text-sm text-muted-foreground">Overall class statistics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}