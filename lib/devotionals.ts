import { supabase } from './supabase'

export interface Devotional {
  id: string
  title: string
  body: string
  scripture_ref: string | null
  scripture_text: string | null
  type: 'daily' | 'weekly'
  published_at: string
  created_at: string
}

export async function getDevotionals(type?: 'daily' | 'weekly'): Promise<Devotional[]> {
  let query = supabase
    .from('devotionals')
    .select('*')
    .order('published_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Devotional[]
}
