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
      flashcards: {
        Row: {
          id: string
          user_id: string
          deck_id: string
          question: string
          answer: string
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          last_reviewed: string | null
          next_review: string | null
          repetitions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deck_id: string
          question: string
          answer: string
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          last_reviewed?: string | null
          next_review?: string | null
          repetitions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deck_id?: string
          question?: string
          answer?: string
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          last_reviewed?: string | null
          next_review?: string | null
          repetitions?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 