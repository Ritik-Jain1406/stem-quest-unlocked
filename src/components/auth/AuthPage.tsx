import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Users, Shield, Eye, EyeOff, Mail, Lock, User, GraduationCap, Chrome } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "🎉 Welcome back!",
        description: "You've been successfully logged in.",
      });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      toast({
        title: "Login Failed",
        description: err.message || 'Please check your credentials',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            name: signUpData.name,
            role: signUpData.role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: signUpData.name,
            email: signUpData.email,
            role: signUpData.role,
            xp: 0,
            level: 1,
            daily_streak: 0
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        toast({
          title: "🎉 Account Created!",
          description: `Welcome to ZENITH LEARN, ${signUpData.name}!`,
        });

        // Clear form
        setSignUpData({
          email: '',
          password: '',
          name: '',
          role: 'student'
        });
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      toast({
        title: "Sign Up Failed",
        description: err.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecting to Google...",
        description: "Please complete authentication with Google",
      });
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
      toast({
        title: "Google Sign In Failed",
        description: err.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Create a demo account with unique credentials
      const demoTimestamp = Date.now();
      const demoEmail = `demo_${demoTimestamp}@zenithlearn.demo`;
      const demoPassword = 'DemoUser123!';
      
      const { data, error } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            name: 'Demo Student',
            role: 'student'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile for demo user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: 'Demo Student',
            email: demoEmail,
            role: 'student',
            xp: 500,
            level: 3,
            daily_streak: 5
          });

        if (profileError) {
          console.error('Demo profile creation error:', profileError);
        }

        // Auto-sign in the demo user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        if (signInError) throw signInError;

        toast({
          title: "🎮 Demo Access Granted!",
          description: "Exploring ZENITH LEARN as Demo Student",
        });
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
      toast({
        title: "Demo Login Failed",
        description: err.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 animate-scale-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ZENITH LEARN
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Next-generation STEM learning platform
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">🧪 Chemistry</Badge>
            <Badge variant="outline" className="text-xs">⚡ Physics</Badge>
            <Badge variant="outline" className="text-xs">🧬 Biology</Badge>
            <Badge variant="outline" className="text-xs">💻 Computer Science</Badge>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-xl animate-slide-in-right">
          <CardHeader className="space-y-1">
            <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(value) => setIsLogin(value === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary/10">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary/10">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-scale-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 focus:ring-2 focus:ring-primary/20"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={signUpData.role === 'student' ? 'default' : 'outline'}
                      onClick={() => setSignUpData(prev => ({ ...prev, role: 'student' }))}
                      className="flex items-center gap-2 h-12"
                    >
                      <BookOpen className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Student</div>
                        <div className="text-xs opacity-70">Learn & Explore</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={signUpData.role === 'teacher' ? 'default' : 'outline'}
                      onClick={() => setSignUpData(prev => ({ ...prev, role: 'teacher' }))}
                      className="flex items-center gap-2 h-12"
                    >
                      <Users className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Teacher</div>
                        <div className="text-xs opacity-70">Create & Teach</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full hover:bg-primary/5 hover:border-primary/20"
              >
                <Chrome className="h-4 w-4 mr-2 text-blue-500" />
                Continue with Google
              </Button>

              {/* Demo Access */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-dashed border-primary/20">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="bg-background border-primary/30">
                    🎮 Try Without Account
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Explore demo lessons and labs as a visitor
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:bg-primary/10 w-full"
                    onClick={handleDemoLogin}
                    disabled={loading}
                  >
                    {loading ? 'Loading Demo...' : 'Access Demo →'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}