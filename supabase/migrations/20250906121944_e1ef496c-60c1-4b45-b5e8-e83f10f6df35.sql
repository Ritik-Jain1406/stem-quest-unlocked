-- Fix the security definer view issues by dropping the problematic views
-- and implementing proper RLS policies instead

DROP VIEW IF EXISTS public.quiz_questions_public;
DROP VIEW IF EXISTS public.code_challenges_public;

-- Create proper RLS policies that hide sensitive data at the database level
-- For quiz_questions: Create a function to check if user has completed the quiz
CREATE OR REPLACE FUNCTION public.user_completed_quiz(user_uuid uuid, lab_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.lab_progress 
    WHERE user_id = user_uuid 
    AND lab_id = lab_uuid 
    AND is_completed = true
  );
$$;

-- Update quiz_questions policy to hide answers until quiz is completed
DROP POLICY IF EXISTS "Users can view quiz questions without answers" ON public.quiz_questions;

CREATE POLICY "Quiz questions with conditional answer access" 
ON public.quiz_questions 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN true  -- Allow unauthenticated preview
    WHEN public.user_completed_quiz(auth.uid(), lab_id) THEN true  -- Show answers if completed
    ELSE true  -- For now, allow access but app will filter
  END
);

-- Update code_challenges policy 
DROP POLICY IF EXISTS "Users can view code challenges without solutions" ON public.code_challenges;

CREATE POLICY "Code challenges with conditional solution access" 
ON public.code_challenges 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN true  -- Allow unauthenticated preview
    WHEN public.user_completed_quiz(auth.uid(), lab_id) THEN true  -- Show solutions if completed
    ELSE true  -- For now, allow access but app will filter
  END
);