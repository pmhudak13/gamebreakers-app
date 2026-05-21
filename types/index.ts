export interface Profile {
  id: string
  name: string
  school: string | null
  sport: string | null
  role: 'student' | 'tutor' | 'coach' | 'admin'
  avatar_url: string | null
  created_at: string
}
