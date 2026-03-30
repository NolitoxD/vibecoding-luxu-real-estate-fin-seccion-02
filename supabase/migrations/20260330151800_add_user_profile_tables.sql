-- Create saved_properties table
CREATE TABLE public.saved_properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, property_id)
);

-- Enable RLS for saved_properties
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Policies for saved_properties
CREATE POLICY "Users can view their own saved properties"
  ON public.saved_properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved properties"
  ON public.saved_properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved properties"
  ON public.saved_properties FOR DELETE
  USING (auth.uid() = user_id);

-- Create scheduled_visits table
CREATE TABLE public.scheduled_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  visit_date date NOT NULL,
  visit_time time NOT NULL,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Enable RLS for scheduled_visits
ALTER TABLE public.scheduled_visits ENABLE ROW LEVEL SECURITY;

-- Policies for scheduled_visits
CREATE POLICY "Users can view their own scheduled visits"
  ON public.scheduled_visits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled visits"
  ON public.scheduled_visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled visits"
  ON public.scheduled_visits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled visits"
  ON public.scheduled_visits FOR DELETE
  USING (auth.uid() = user_id);
