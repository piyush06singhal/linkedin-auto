import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET workspace members
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: members, error: fetchError } = await supabase
      .from('workspace_members')
      .select(`
        *,
        users(id, email, full_name, avatar_url)
      `)
      .eq('workspace_id', params.id)
      .order('joined_at', { ascending: true })

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }

    return NextResponse.json({ success: true, members })

  } catch (error: any) {
    console.error('Get members error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get members' },
      { status: 500 }
    )
  }
}
