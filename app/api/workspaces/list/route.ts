import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspaces where user is owner or member
    const { data: workspaces, error: fetchError } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members!inner(role)
      `)
      .eq('workspace_members.user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching workspaces:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 })
    }

    // Get member counts for each workspace
    const workspacesWithCounts = await Promise.all(
      (workspaces || []).map(async (workspace) => {
        const { count } = await supabase
          .from('workspace_members')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)

        return {
          ...workspace,
          members: count || 0,
          role: workspace.workspace_members[0]?.role || 'viewer'
        }
      })
    )

    return NextResponse.json({ success: true, workspaces: workspacesWithCounts })

  } catch (error: any) {
    console.error('List workspaces error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to list workspaces' },
      { status: 500 }
    )
  }
}
