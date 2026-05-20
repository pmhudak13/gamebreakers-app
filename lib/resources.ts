import { supabase } from './supabase'

export type ResourceCategory = 'faith' | 'fitness' | 'academics' | 'life'
export type ResourceType = 'article' | 'video' | 'podcast' | 'tool'

export interface Resource {
  id: string
  title: string
  description: string
  url: string
  category: ResourceCategory
  resource_type: ResourceType
  created_at: string
}

export async function getResources(category?: ResourceCategory): Promise<Resource[]> {
  let query = supabase
    .from('resources')
    .select('*')
    .eq('active', true)
    .order('category')
    .order('created_at')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Resource[]
}
