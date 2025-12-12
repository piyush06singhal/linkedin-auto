import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET workspace details
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

    const { data: workspace, error: fetchError } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members(
          id,
          role,
          joined_at,
          users(id, email, full_name)
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, workspace })

  } catch (error: any) {
    console.error('Get workspace error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get workspace' },
      { status: 500 }
    )
  }
}

// PUT update workspace
export async function PUT(
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

    const body = await request.json()
    const { name, description } = body

    const { data: workspace, error: updateError } = await supabase
      .from('workspaces')
      .update({
        name: name?.trim(),
        description: description?.trim() || null
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 })
    }

    return NextResponse.json({ success: true, workspace })

  } catch (error: any) {
    console.error('Update workspace error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update workspace' },
      { status: 500 }
    )
  }
}

// DELETE workspace
export async function DELETE(
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

    const { error: deleteError } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', params.id)
      .eq('owner_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete workspace error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete workspace' },
      { status: 500 }
    )
  }
}
