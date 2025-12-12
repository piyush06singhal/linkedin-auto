import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(
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
    const { email, role = 'editor' } = body

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user is workspace owner or has permission to invite
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    const isOwner = workspace.owner_id === user.id
    
    if (!isOwner) {
      const { data: member } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', params.id)
        .eq('user_id', user.id)
        .single()

      if (!member || !['owner', 'admin'].includes(member.role)) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
      }
    }

    // Check if already invited or member
    const { data: existing } = await supabase
      .from('workspace_invitations')
      .select('*')
      .eq('workspace_id', params.id)
      .eq('email', email.trim().toLowerCase())
      .eq('status', 'pending')
      .single()

    if (existing) {
      return NextResponse.json({ error: 'User already invited' }, { status: 400 })
    }

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: params.id,
        email: email.trim().toLowerCase(),
        role,
        invited_by: user.id
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return NextResponse.json({ 
        error: 'Failed to send invitation', 
        details: inviteError.message 
      }, { status: 500 })
    }

    // TODO: Send email notification

    return NextResponse.json({ success: true, invitation })

  } catch (error: any) {
    console.error('Invite error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send invitation' },
      { status: 500 }
    )
  }
}
