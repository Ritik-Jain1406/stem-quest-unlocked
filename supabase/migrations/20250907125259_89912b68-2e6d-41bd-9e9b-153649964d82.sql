-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('teacher', 'student', 'admin'));

-- Create teacher_questions table for teachers to upload questions
CREATE TABLE public.teacher_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category USER-DEFINED REFERENCES stem_category DEFAULT 'science',
  difficulty USER-DEFINED REFERENCES difficulty_level DEFAULT 'beginner',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_attempts INTEGER DEFAULT 3,
  time_limit INTEGER DEFAULT 30, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on teacher_questions
ALTER TABLE public.teacher_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_questions
CREATE POLICY "Teachers can view their own questions" 
ON public.teacher_questions 
FOR SELECT 
USING (auth.uid() = teacher_id OR EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Teachers can create questions" 
ON public.teacher_questions 
FOR INSERT 
WITH CHECK (auth.uid() = teacher_id AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
));

CREATE POLICY "Teachers can update their own questions" 
ON public.teacher_questions 
FOR UPDATE 
USING (auth.uid() = teacher_id AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
));

CREATE POLICY "Teachers can delete their own questions" 
ON public.teacher_questions 
FOR DELETE 
USING (auth.uid() = teacher_id AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
));

-- Create student_quiz_attempts table
CREATE TABLE public.student_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  teacher_question_id UUID NOT NULL REFERENCES public.teacher_questions(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  max_score INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_quiz_attempts
ALTER TABLE public.student_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for student_quiz_attempts
CREATE POLICY "Students can view their own attempts" 
ON public.student_quiz_attempts 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own attempts" 
ON public.student_quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own attempts" 
ON public.student_quiz_attempts 
FOR UPDATE 
USING (auth.uid() = student_id);

-- Teachers can view attempts for their questions
CREATE POLICY "Teachers can view attempts for their questions" 
ON public.student_quiz_attempts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.teacher_questions 
  WHERE id = teacher_question_id AND teacher_id = auth.uid()
));

-- Add trigger for updated_at on teacher_questions
CREATE TRIGGER update_teacher_questions_updated_at
BEFORE UPDATE ON public.teacher_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Allow students to view active teacher questions
CREATE POLICY "Students can view active teacher questions" 
ON public.teacher_questions 
FOR SELECT 
USING (is_active = true AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'student'
));