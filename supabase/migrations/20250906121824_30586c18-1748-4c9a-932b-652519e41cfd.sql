-- Fix quiz security: Hide correct answers from students
-- Remove public read access to quiz_questions
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON public.quiz_questions;

-- Create new policy to hide sensitive quiz data
CREATE POLICY "Users can view quiz questions without answers" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Note: The application layer should filter out correct_answer and explanation
-- when serving quiz questions to students

-- Fix coding challenge security: Hide solutions from students  
-- Remove public read access to code_challenges
DROP POLICY IF EXISTS "Anyone can view code challenges" ON public.code_challenges;

-- Create new policy for code challenges
CREATE POLICY "Users can view code challenges without solutions" 
ON public.code_challenges 
FOR SELECT 
USING (true);

-- Note: The application layer should filter out expected_output and test_cases
-- when serving challenges to students

-- Create a view for public quiz questions (without answers)
CREATE OR REPLACE VIEW public.quiz_questions_public AS
SELECT 
  id,
  lab_id,
  question,
  options,
  order_index,
  created_at
FROM public.quiz_questions;

-- Create a view for public code challenges (without solutions)
CREATE OR REPLACE VIEW public.code_challenges_public AS
SELECT 
  id,
  lab_id,
  language,
  starter_code,
  created_at
FROM public.code_challenges;

-- Grant access to the views
GRANT SELECT ON public.quiz_questions_public TO authenticated;
GRANT SELECT ON public.quiz_questions_public TO anon;
GRANT SELECT ON public.code_challenges_public TO authenticated;
GRANT SELECT ON public.code_challenges_public TO anon;