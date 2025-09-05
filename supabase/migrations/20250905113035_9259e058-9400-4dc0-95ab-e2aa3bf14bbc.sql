-- Fix remaining function without search_path
CREATE OR REPLACE FUNCTION public.calculate_level(xp_amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(xp_amount / 1000.0) + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;