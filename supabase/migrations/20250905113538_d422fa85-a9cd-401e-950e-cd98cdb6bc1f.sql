-- Insert sample quest data
DO $$
DECLARE
    physics_quest_id UUID;
    web_quest_id UUID;
    bridge_quest_id UUID;
    algebra_quest_id UUID;
    chemistry_quest_id UUID;
    python_quest_id UUID;
    
    physics_quiz_id UUID;
    physics_sim_id UUID;
    physics_exp_id UUID;
    web_html_id UUID;
    web_css_id UUID;
    web_js_id UUID;
    bridge_quiz_id UUID;
    bridge_sim_id UUID;
    algebra_quiz_id UUID;
    algebra_sim_id UUID;
BEGIN
    -- Insert quests and get their IDs
    INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
    ('Introduction to Physics', 'Explore the fundamental laws of physics through interactive experiments and simulations.', 'science', 'beginner', 100, 45)
    RETURNING id INTO physics_quest_id;
    
    INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
    ('Web Development Basics', 'Learn the foundations of web development using HTML, CSS, and JavaScript.', 'technology', 'beginner', 150, 60)
    RETURNING id INTO web_quest_id;
    
    INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
    ('Bridge Building Challenge', 'Design and test virtual bridges using engineering principles.', 'engineering', 'intermediate', 200, 90)
    RETURNING id INTO bridge_quest_id;
    
    INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
    ('Algebra Adventures', 'Master algebraic concepts through engaging problem-solving activities.', 'mathematics', 'beginner', 120, 50)
    RETURNING id INTO algebra_quest_id;
    
    INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
    ('Chemical Reactions Lab', 'Discover the fascinating world of chemistry through virtual experiments.', 'science', 'intermediate', 180, 75)
    RETURNING id INTO chemistry_quest_id;
    
    INSERT INTO public.quests (title, description, category, difficulty, xp_reward, estimated_time) VALUES
    ('Python Programming Quest', 'Learn programming fundamentals with Python through hands-on coding challenges.', 'technology', 'intermediate', 250, 120)
    RETURNING id INTO python_quest_id;

    -- Insert labs for physics quest
    INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
    (physics_quest_id, 'Forces and Motion Quiz', 'Test your understanding of basic physics concepts.', 'quiz', 'Answer questions about forces, motion, and energy.', 0)
    RETURNING id INTO physics_quiz_id;
    
    INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
    (physics_quest_id, 'Pendulum Simulation', 'Explore pendulum motion through interactive simulation.', 'simulation', 'Adjust parameters and observe how they affect pendulum behavior.', 1)
    RETURNING id INTO physics_sim_id;
    
    INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
    (physics_quest_id, 'Free Fall Experiment', 'Investigate gravity and free fall motion.', 'experiment', 'Drop objects from different heights and measure their acceleration.', 2)
    RETURNING id INTO physics_exp_id;

    -- Insert labs for web development quest
    INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
    (web_quest_id, 'HTML Structure Challenge', 'Build a webpage using proper HTML structure.', 'coding', 'Create a webpage with headers, paragraphs, and lists.', 0)
    RETURNING id INTO web_html_id;
    
    INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
    (web_quest_id, 'CSS Styling Quiz', 'Test your knowledge of CSS properties and selectors.', 'quiz', 'Answer questions about CSS styling and layout.', 1)
    RETURNING id INTO web_css_id;
    
    INSERT INTO public.labs (quest_id, title, description, type, instructions, order_index) VALUES
    (web_quest_id, 'JavaScript Basics', 'Learn fundamental JavaScript programming concepts.', 'coding', 'Write JavaScript functions to manipulate webpage elements.', 2)
    RETURNING id INTO web_js_id;

    -- Insert quiz questions for physics quiz
    INSERT INTO public.quiz_questions (lab_id, question, options, correct_answer, explanation, order_index) VALUES
    (physics_quiz_id, 'What is Newton''s first law of motion?', ARRAY['An object at rest stays at rest unless acted upon by force', 'Force equals mass times acceleration', 'For every action there is an equal and opposite reaction', 'Objects fall at the same rate regardless of mass'], 0, 'Newton''s first law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.', 0),
    (physics_quiz_id, 'What is the formula for acceleration?', ARRAY['a = v/t', 'a = f/m', 'a = (v_f - v_i)/t', 'a = d/t²'], 2, 'Acceleration is the change in velocity over time, so a = (v_final - v_initial) / time.', 1),
    (physics_quiz_id, 'Which unit is used to measure force?', ARRAY['Joules', 'Watts', 'Newtons', 'Pascals'], 2, 'Force is measured in Newtons (N), named after Sir Isaac Newton.', 2);

    -- Insert simulation config for pendulum
    INSERT INTO public.simulation_configs (lab_id, simulation_type, parameters) VALUES
    (physics_sim_id, 'physics', '{"type": "pendulum", "parameters": ["length", "mass", "angle", "gravity"], "defaultValues": {"length": 1.0, "mass": 1.0, "angle": 15, "gravity": 9.81}}');

    -- Insert code challenge for HTML
    INSERT INTO public.code_challenges (lab_id, language, starter_code, expected_output, test_cases) VALUES
    (web_html_id, 'html', '<!DOCTYPE html>
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
END $$;