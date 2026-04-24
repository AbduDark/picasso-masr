import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Public POST — anyone can submit an inquiry
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { name, phone, product_name, product_id, message } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert({ name, phone, product_name, product_id: product_id ?? null, message })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

// Admin GET — list all inquiries
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') ?? 'all'

  let query = supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (filter === 'new') query = query.eq('is_read', false)
  if (filter === 'converted') query = query.eq('is_converted', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Admin PATCH — mark as read / converted
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, is_read, is_converted } = await request.json()
  const updates: Record<string, boolean> = {}
  if (is_read !== undefined) updates.is_read = is_read
  if (is_converted !== undefined) updates.is_converted = is_converted

  const { data, error } = await supabase.from('inquiries').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
