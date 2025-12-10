export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          linkedin_connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          linkedin_connected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          linkedin_connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          status: 'draft' | 'scheduled' | 'published'
          scheduled_for: string | null
          published_at: string | null
          engagement_rate: number | null
          reach: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          status?: 'draft' | 'scheduled' | 'published'
          scheduled_for?: string | null
          published_at?: string | null
          engagement_rate?: number | null
          reach?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          status?: 'draft' | 'scheduled' | 'published'
          scheduled_for?: string | null
          published_at?: string | null
          engagement_rate?: number | null
          reach?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
