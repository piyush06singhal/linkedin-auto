import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET preferences
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: preferences, error: fetchError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
    }

    // Create default if doesn't exist
    if (!preferences) {
      const { data: newPrefs } = await supabase
        .from('notification_preferences')
        .insert({ user_id: user.id })
        .select()
        .single()

      return NextResponse.json({ success: true, preferences: newPrefs })
    }

    return NextResponse.json({ success: true, preferences })

  } catch (error: any) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get preferences' },
      { status: 500 }
    )
  }
}

// PUT update preferences
export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data: preferences, error: updateError } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...body
      })
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
    }

    return NextResponse.json({ success: true, preferences })

  } catch (error: any) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
