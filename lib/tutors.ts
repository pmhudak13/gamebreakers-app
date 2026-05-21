import { supabase } from './supabase'

export type RateType = 'free' | 'paid'
export type RequestStatus = 'pending' | 'accepted' | 'declined'

export interface Tutor {
  id: string
  name: string
  bio: string
  avatar_url: string | null
  subjects: string[]
  grade_levels: string[]
  availability: string[]
  rate_type: RateType
  rate_note: string | null
  contact_email: string | null
  created_at: string
}

export interface TutorRequest {
  id: string
  student_id: string
  tutor_id: string
  subject: string
  message: string | null
  preferred_days: string[]
  status: RequestStatus
  created_at: string
  tutor: { name: string } | null
}

export async function getTutors(subject?: string): Promise<Tutor[]> {
  let query = supabase
    .from('tutors')
    .select('*')
    .eq('active', true)
    .order('name')

  if (subject) {
    query = query.contains('subjects', [subject])
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Tutor[]
}

export function getUniqueSubjects(tutors: Tutor[]): string[] {
  const set = new Set<string>()
  for (const t of tutors) {
    for (const s of t.subjects) set.add(s)
  }
  return Array.from(set).sort()
}

export async function getMyTutorRequests(): Promise<TutorRequest[]> {
  const { data, error } = await supabase
    .from('tutor_requests')
    .select('*, tutor:tutors(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as TutorRequest[]
}

export async function submitTutorRequest(params: {
  tutor_id: string
  subject: string
  message: string
  preferred_days: string[]
}): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('tutor_requests').insert({
    student_id: user.id,
    tutor_id: params.tutor_id,
    subject: params.subject,
    message: params.message || null,
    preferred_days: params.preferred_days,
  })
  if (error) throw error
}
