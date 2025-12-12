import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 })
    }

    // Create workspace
    const { data: workspace, error: createError } = await supabase
      .from('workspaces')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        owner_id: user.id
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating workspace:', createError)
      return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
    }

    return NextResponse.json({ success: true, workspace })

  } catch (error: any) {
    console.error('Create workspace error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create workspace' },
      { status: 500 }
    )
  }
}
