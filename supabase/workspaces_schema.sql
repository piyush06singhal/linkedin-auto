-- Workspaces Feature Schema
-- This adds team collaboration functionality to the LinkedIn automation app

-- Create workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace members table (for team collaboration)
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'editor', 'viewer')) DEFAULT 'editor',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Create workspace invitations table
CREATE TABLE IF NOT EXISTS public.workspace_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'editor',
  invited_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Add workspace_id to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- Add workspace_id to templates table
ALTER TABLE public.templates 
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_workspace_id ON public.workspace_invitations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_email ON public.workspace_invitations(email);
CREATE INDEX IF NOT EXISTS idx_posts_workspace_id ON public.posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_templates_workspace_id ON public.templates(workspace_id);

-- Enable Row Level Security
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace admins can manage members" ON public.workspace_members;
DROP POLICY IF EXISTS "Users can view their invitations" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Workspace admins can manage invitations" ON public.workspace_invitations;

-- RLS Policies for workspaces table
CREATE POLICY "Users can view workspaces they are members of"
  ON public.workspaces FOR SELECT
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners and admins can update workspaces"
  ON public.workspaces FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Workspace owners can delete their workspaces"
  ON public.workspaces FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for workspace_members table
CREATE POLICY "Users can view workspace members"
  ON public.workspace_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND (
        workspaces.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.workspace_members wm
          WHERE wm.workspace_id = workspaces.id
          AND wm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Workspace owners and admins can manage members"
  ON public.workspace_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND (
        workspaces.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.workspace_members wm
          WHERE wm.workspace_id = workspaces.id
          AND wm.user_id = auth.uid()
          AND wm.role IN ('owner', 'admin')
        )
      )
    )
  );

-- RLS Policies for workspace_invitations table
CREATE POLICY "Users can view their invitations"
  ON public.workspace_invitations FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = workspace_invitations.workspace_id
      AND (
        workspaces.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.workspace_members
          WHERE workspace_members.workspace_id = workspaces.id
          AND workspace_members.user_id = auth.uid()
          AND workspace_members.role IN ('owner', 'admin')
        )
      )
    )
  );

CREATE POLICY "Workspace admins can manage invitations"
  ON public.workspace_invitations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = workspace_invitations.workspace_id
      AND (
        workspaces.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.workspace_members
          WHERE workspace_members.workspace_id = workspaces.id
          AND workspace_members.user_id = auth.uid()
          AND workspace_members.role IN ('owner', 'admin')
        )
      )
    )
  );

-- Function to automatically add owner as member when workspace is created
CREATE OR REPLACE FUNCTION public.add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_workspace_created ON public.workspaces;

-- Trigger to add owner as member
CREATE TRIGGER on_workspace_created
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.add_owner_as_member();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_workspace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON public.workspaces;

-- Trigger for updated_at
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION update_workspace_updated_at();
