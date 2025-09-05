-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  daily_streak INTEGER NOT NULL DEFAULT 1,
  last_active_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create STEM categories enum
CREATE TYPE stem_category AS ENUM ('science', 'technology', 'engineering', 'mathematics');

-- Create difficulty enum
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create lab type enum
CREATE TYPE lab_type AS ENUM ('simulation', 'experiment', 'coding', 'quiz');

-- Create quests table
CREATE TABLE public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category stem_category NOT NULL,
  difficulty difficulty_level NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  estimated_time INTEGER NOT NULL DEFAULT 30,
  prerequisites TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create labs table
CREATE TABLE public.labs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type lab_type NOT NULL,
  instructions TEXT NOT NULL,
  materials TEXT[],
  steps TEXT[],
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create simulation configs table
CREATE TABLE public.simulation_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  simulation_type TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create code challenges table
CREATE TABLE public.code_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  starter_code TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  test_cases JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category stem_category NOT NULL,
  criteria JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create lab progress table
CREATE TABLE public.lab_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lab_id)
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for quests (public read)
CREATE POLICY "Anyone can view quests" ON public.quests
  FOR SELECT USING (is_active = true);

-- Create RLS policies for labs (public read)
CREATE POLICY "Anyone can view labs" ON public.labs
  FOR SELECT USING (true);

-- Create RLS policies for quiz questions (public read)
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions
  FOR SELECT USING (true);

-- Create RLS policies for simulation configs (public read)
CREATE POLICY "Anyone can view simulation configs" ON public.simulation_configs
  FOR SELECT USING (true);

-- Create RLS policies for code challenges (public read)
CREATE POLICY "Anyone can view code challenges" ON public.code_challenges
  FOR SELECT USING (true);

-- Create RLS policies for badges (public read)
CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

-- Create RLS policies for user progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for lab progress
CREATE POLICY "Users can view their own lab progress" ON public.lab_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lab progress" ON public.lab_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lab progress" ON public.lab_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all user badges for leaderboard" ON public.user_badges
  FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labs_updated_at
  BEFORE UPDATE ON public.labs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_progress_updated_at
  BEFORE UPDATE ON public.lab_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate level from XP
CREATE OR REPLACE FUNCTION public.calculate_level(xp_amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(xp_amount / 1000.0) + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to update user XP and level
CREATE OR REPLACE FUNCTION public.update_user_xp(user_uuid UUID, xp_to_add INTEGER)
RETURNS VOID AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  UPDATE public.profiles 
  SET xp = xp + xp_to_add,
      last_active_date = now()
  WHERE user_id = user_uuid;
  
  SELECT xp INTO new_xp FROM public.profiles WHERE user_id = user_uuid;
  new_level := public.calculate_level(new_xp);
  
  UPDATE public.profiles 
  SET level = new_level
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;