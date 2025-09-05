-- Fix security warning by adding search_path to functions that need it
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