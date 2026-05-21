import { supabase } from './supabase'
import type { RequestStatus } from './tutors'

export interface AdminTutorRequest {
  id: string
  student_id: string
  tutor_id: string
  subject: string
  message: string | null
  preferred_days: string[]
  status: RequestStatus
  created_at: string
  student: { name: string } | null
  tutor: { name: string } | null
}

export interface AdminUser {
  id: string
  name: string
  school: string | null
  sport: string | null
  role: 'student' | 'tutor' | 'coach' | 'admin'
  created_at: string
}

export async function getAllTutorRequests(): Promise<AdminTutorRequest[]> {
  const { data, error } = await supabase
    .from('tutor_requests')
    .select('*, student:profiles!student_id(name), tutor:tutors(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as AdminTutorRequest[]
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
  const { error } = await supabase
    .from('tutor_requests')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, school, sport, role, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as AdminUser[]
}
