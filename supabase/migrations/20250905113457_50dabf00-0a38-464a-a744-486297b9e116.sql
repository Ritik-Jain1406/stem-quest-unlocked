-- Insert sample quests
INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
('Introduction to Physics', 'Explore the fundamental laws of physics through interactive experiments and simulations.', 'science', 'beginner', 100, 45),
('Web Development Basics', 'Learn the foundations of web development using HTML, CSS, and JavaScript.', 'technology', 'beginner', 150, 60),
('Bridge Building Challenge', 'Design and test virtual bridges using engineering principles.', 'engineering', 'intermediate', 200, 90),
('Algebra Adventures', 'Master algebraic concepts through engaging problem-solving activities.', 'mathematics', 'beginner', 120, 50),
('Chemical Reactions Lab', 'Discover the fascinating world of chemistry through virtual experiments.', 'science', 'intermediate', 180, 75),
('Python Programming Quest', 'Learn programming fundamentals with Python through hands-on coding challenges.', 'technology', 'intermediate', 250, 120);

-- Insert sample labs for the physics quest
INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
((SELECT id FROM public.quests WHERE title = 'Introduction to Physics'), 'Forces and Motion Quiz', 'Test your understanding of basic physics concepts.', 'quiz', 'Answer questions about forces, motion, and energy.', 0),
((SELECT id FROM public.quests WHERE title = 'Introduction to Physics'), 'Pendulum Simulation', 'Explore pendulum motion through interactive simulation.', 'simulation', 'Adjust parameters and observe how they affect pendulum behavior.', 1),
((SELECT id FROM public.quests WHERE title = 'Introduction to Physics'), 'Free Fall Experiment', 'Investigate gravity and free fall motion.', 'experiment', 'Drop objects from different heights and measure their acceleration.', 2);

-- Insert sample labs for the web development quest
INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
((SELECT id FROM public.quests WHERE title = 'Web Development Basics'), 'HTML Structure Challenge', 'Build a webpage using proper HTML structure.', 'coding', 'Create a webpage with headers, paragraphs, and lists.', 0),
((SELECT id FROM public.quests WHERE title = 'Web Development Basics'), 'CSS Styling Quiz', 'Test your knowledge of CSS properties and selectors.', 'quiz', 'Answer questions about CSS styling and layout.', 1),
((SELECT id FROM public.quests WHERE title = 'Web Development Basics'), 'JavaScript Basics', 'Learn fundamental JavaScript programming concepts.', 'coding', 'Write JavaScript functions to manipulate webpage elements.', 2);

-- Insert sample labs for the bridge building quest
INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
((SELECT id FROM public.quests WHERE title = 'Bridge Building Challenge'), 'Structural Analysis Quiz', 'Learn about forces and structural integrity.', 'quiz', 'Answer questions about tension, compression, and load distribution.', 0),
((SELECT id FROM public.quests WHERE title = 'Bridge Building Challenge'), 'Bridge Design Simulation', 'Design and test your bridge structure.', 'simulation', 'Create a bridge design and test its load-bearing capacity.', 1);

-- Insert sample labs for the algebra quest
INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
((SELECT id FROM public.quests WHERE title = 'Algebra Adventures'), 'Linear Equations Challenge', 'Solve various linear equation problems.', 'quiz', 'Practice solving linear equations with different complexities.', 0),
((SELECT id FROM public.quests WHERE title = 'Algebra Adventures'), 'Graphing Calculator', 'Explore functions and their graphs.', 'simulation', 'Plot different mathematical functions and observe their behavior.', 1);

-- Insert sample quiz questions for physics quiz
INSERT INTO public.quiz_questions (lab_id, question, options, correct_answer, explanation, order_index) VALUES
((SELECT id FROM public.labs WHERE title = 'Forces and Motion Quiz'), 'What is Newton''s first law of motion?', ARRAY['An object at rest stays at rest unless acted upon by force', 'Force equals mass times acceleration', 'For every action there is an equal and opposite reaction', 'Objects fall at the same rate regardless of mass'], 0, 'Newton''s first law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.', 0),
((SELECT id FROM public.labs WHERE title = 'Forces and Motion Quiz'), 'What is the formula for acceleration?', ARRAY['a = v/t', 'a = f/m', 'a = (v_f - v_i)/t', 'a = d/t²'], 2, 'Acceleration is the change in velocity over time, so a = (v_final - v_initial) / time.', 1),
((SELECT id FROM public.labs WHERE title = 'Forces and Motion Quiz'), 'Which unit is used to measure force?', ARRAY['Joules', 'Watts', 'Newtons', 'Pascals'], 2, 'Force is measured in Newtons (N), named after Sir Isaac Newton.', 2);

-- Insert simulation config for pendulum
INSERT INTO public.simulation_configs (lab_id, simulation_type, parameters) VALUES
((SELECT id FROM public.labs WHERE title = 'Pendulum Simulation'), 'physics', '{"type": "pendulum", "parameters": ["length", "mass", "angle", "gravity"], "defaultValues": {"length": 1.0, "mass": 1.0, "angle": 15, "gravity": 9.81}}');

-- Insert code challenge for HTML
INSERT INTO public.code_challenges (lab_id, language, starter_code, expected_output, test_cases) VALUES
((SELECT id FROM public.labs WHERE title = 'HTML Structure Challenge'), 'html', '<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
</head>
<body>
    <!-- Create your content here -->
    
</body>
</html>', '<h1>Welcome to My Site</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul>', '[{"input": "HTML structure", "expectedOutput": "Valid HTML with h1, p, and ul elements"}]');

-- Insert sample badges
INSERT INTO public.badges (name, description, icon, category, criteria) VALUES
('First Steps', 'Complete your first lab', '🏆', 'science', '{"type": "lab_completion", "count": 1}'),
('Quiz Master', 'Score 100% on a quiz', '🧠', 'mathematics', '{"type": "perfect_score", "lab_type": "quiz"}'),
('Code Warrior', 'Complete 5 coding challenges', '💻', 'technology', '{"type": "lab_completion", "lab_type": "coding", "count": 5}'),
('Experimenter', 'Complete 3 experiments', '🔬', 'science', '{"type": "lab_completion", "lab_type": "experiment", "count": 3}'),
('Engineering Mind', 'Complete an engineering quest', '⚙️', 'engineering', '{"type": "quest_completion", "category": "engineering"}'),
('Rising Star', 'Reach level 3', '⭐', 'mathematics', '{"type": "level_reached", "level": 3}');