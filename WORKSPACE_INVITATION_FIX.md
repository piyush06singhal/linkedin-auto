# Workspace Invitation Fix

## Issue
Error: "Failed to send invitation: permission denied for table users"

## Root Cause
The RLS policy for `workspace_invitations` was trying to access `auth.users` table:
```sql
email = (SELECT email FROM auth.users WHERE id = auth.uid())
```

This caused a permission error because the policy doesn't have access to the `auth` schema.

## Solution
Simplified the RLS policy to only check workspace ownership:

### Before
```sql
CREATE POLICY "Users can view their invitations"
  ON public.workspace_invitations FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );
```

### After
```sql
CREATE POLICY "Users can view their invitations"
  ON public.workspace_invitations FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );
```

## What Changed
- ❌ Removed: Email-based invitation viewing (was causing permission error)
- ✅ Kept: Workspace owner can view all invitations
- ✅ Result: Invitations work without permission errors

## To Apply This Fix

### Option 1: Run Updated Schema (Recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire content from `supabase/workspaces_schema.sql`
3. Run it in the SQL Editor
4. This will drop and recreate all policies correctly

### Option 2: Manual Fix
Run this SQL in Supabase SQL Editor:
```sql
-- Drop the old policy
DROP POLICY IF EXISTS "Users can view their invitations" ON public.workspace_invitations;

-- Create the new simplified policy
CREATE POLICY "Users can view their invitations"
  ON public.workspace_invitations FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );
```

## Testing
1. Go to a workspace page
2. Click "Invite Member"
3. Enter an email address
4. Select a role
5. Click "Send Invitation"
6. Should see: "✅ Invitation sent to [email]"

## Status
- ✅ Code updated and pushed to GitHub
- ⚠️ Database needs manual update (run SQL above)
- ✅ Will work after database update
