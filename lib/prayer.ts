import { supabase } from './supabase'

export type PrayerCategory = 'personal' | 'family' | 'school' | 'health' | 'other'

export interface PrayerRequest {
  id: string
  user_id: string
  body: string
  category: PrayerCategory
  anonymous: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  // computed client-side
  author_name: string | null
  prayer_count: number
  i_prayed: boolean
}

export async function getPrayerRequests(userId: string): Promise<PrayerRequest[]> {
  const { data: rows, error } = await supabase
    .from('prayer_requests')
    .select('*, profiles:user_id(name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!rows || rows.length === 0) return []

  const ids = rows.map((r) => r.id)

  const [{ data: allReactions }, { data: myReactions }] = await Promise.all([
    supabase.from('prayer_reactions').select('request_id').in('request_id', ids),
    supabase
      .from('prayer_reactions')
      .select('request_id')
      .eq('user_id', userId)
      .in('request_id', ids),
  ])

  const countMap = new Map<string, number>()
  for (const r of allReactions ?? []) {
    countMap.set(r.request_id, (countMap.get(r.request_id) ?? 0) + 1)
  }
  const mySet = new Set((myReactions ?? []).map((r) => r.request_id))

  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    body: r.body,
    category: r.category as PrayerCategory,
    anonymous: r.anonymous,
    status: r.status as PrayerRequest['status'],
    created_at: r.created_at,
    author_name: r.anonymous ? null : ((r.profiles as { name: string } | null)?.name ?? null),
    prayer_count: countMap.get(r.id) ?? 0,
    i_prayed: mySet.has(r.id),
  }))
}

export async function submitPrayerRequest(
  userId: string,
  body: string,
  category: PrayerCategory,
  anonymous: boolean
): Promise<void> {
  const { error } = await supabase
    .from('prayer_requests')
    .insert({ user_id: userId, body: body.trim(), category, anonymous })
  if (error) throw error
}

export async function togglePrayer(
  requestId: string,
  userId: string,
  currentlyPrayed: boolean
): Promise<void> {
  if (currentlyPrayed) {
    const { error } = await supabase
      .from('prayer_reactions')
      .delete()
      .eq('request_id', requestId)
      .eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('prayer_reactions')
      .insert({ request_id: requestId, user_id: userId })
    if (error) throw error
  }
}
