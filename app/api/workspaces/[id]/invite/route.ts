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
    console.log('📧 Invite API called for workspace:', params.id)
    
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.id)

    const body = await request.json()
    const { email, role = 'editor' } = body

    console.log('📝 Invite details - Email:', email, 'Role:', role)

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user is workspace owner or has permission to invite
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (workspaceError) {
      console.error('❌ Error fetching workspace:', workspaceError)
      return NextResponse.json({ 
        error: 'Workspace not found',
        details: workspaceError.message 
      }, { status: 404 })
    }

    if (!workspace) {
      console.error('❌ Workspace not found:', params.id)
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    console.log('✅ Workspace found. Owner:', workspace.owner_id, 'Current user:', user.id)

    // Check if user is owner or admin
    const isOwner = workspace.owner_id === user.id
    
    if (!isOwner) {
      console.log('⚠️ User is not owner, checking member role...')
      const { data: member } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', params.id)
        .eq('user_id', user.id)
        .single()

      console.log('Member data:', member)

      if (!member || !['owner', 'admin'].includes(member.role)) {
        console.error('❌ Permission denied. Member role:', member?.role)
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
      }
    } else {
      console.log('✅ User is workspace owner')
    }

    // Check if already invited or member
    console.log('🔍 Checking for existing invitation...')
    const { data: existing } = await supabase
      .from('workspace_invitations')
      .select('*')
      .eq('workspace_id', params.id)
      .eq('email', email.trim().toLowerCase())
      .eq('status', 'pending')
      .single()

    if (existing) {
      console.log('⚠️ User already invited')
      return NextResponse.json({ error: 'User already invited' }, { status: 400 })
    }

    console.log('✅ No existing invitation found')

    // Create invitation
    console.log('📨 Creating invitation...')
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
      console.error('❌ Error creating invitation:', inviteError)
      return NextResponse.json({ 
        error: 'Failed to send invitation', 
        details: inviteError.message,
        code: inviteError.code
      }, { status: 500 })
    }

    console.log('✅ Invitation created successfully:', invitation.id)

    // Get workspace details for email
    const { data: workspaceDetails } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', params.id)
      .single()

    // Get inviter details for email
    const { data: inviterData } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    // Send email notification
    try {
      const { sendWorkspaceInviteEmail } = await import('@/lib/email/workspace-invites')
      
      const emailResult = await sendWorkspaceInviteEmail({
        inviteeEmail: email.trim().toLowerCase(),
        inviterName: inviterData?.full_name || inviterData?.email || 'A team member',
        workspaceName: workspaceDetails?.name || 'Workspace',
        workspaceId: params.id,
        role: role,
        invitationId: invitation.id
      })

      if (emailResult.success) {
        console.log('✅ Invitation email sent successfully')
      } else {
        console.warn('⚠️ Email sending failed:', emailResult.error)
        // Don't fail the invitation if email fails
      }
    } catch (emailError) {
      console.error('❌ Error sending invitation email:', emailError)
      // Don't fail the invitation if email fails
    }

    return NextResponse.json({ success: true, invitation })

  } catch (error: any) {
    console.error('Invite error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send invitation' },
      { status: 500 }
    )
  }
}
