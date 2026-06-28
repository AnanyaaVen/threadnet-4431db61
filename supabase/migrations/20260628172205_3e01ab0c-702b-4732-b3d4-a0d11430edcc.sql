
-- PROJECTS
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  hook text,
  description text,
  vision text,
  category text,
  needs text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  cover_url text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view projects"
  ON public.projects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Founders insert own projects"
  ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders update own projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (auth.uid() = founder_id) WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders delete own projects"
  ON public.projects FOR DELETE TO authenticated USING (auth.uid() = founder_id);

CREATE INDEX projects_founder_id_idx ON public.projects(founder_id);
CREATE INDEX projects_category_idx ON public.projects(category);

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONNECTIONS (swipe / match relationships between users, optionally about a project)
CREATE TABLE public.connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'interested',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connections_no_self CHECK (from_user_id <> to_user_id),
  CONSTRAINT connections_unique UNIQUE (from_user_id, to_user_id, project_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.connections TO authenticated;
GRANT ALL ON public.connections TO service_role;

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view connections involving them"
  ON public.connections FOR SELECT TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users insert connections they initiate"
  ON public.connections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users update own connections"
  ON public.connections FOR UPDATE TO authenticated
  USING (auth.uid() = from_user_id) WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users delete own connections"
  ON public.connections FOR DELETE TO authenticated
  USING (auth.uid() = from_user_id);

CREATE INDEX connections_from_idx ON public.connections(from_user_id);
CREATE INDEX connections_to_idx ON public.connections(to_user_id);
CREATE INDEX connections_project_idx ON public.connections(project_id);

CREATE TRIGGER connections_set_updated_at
  BEFORE UPDATE ON public.connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
