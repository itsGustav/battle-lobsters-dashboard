// Generated types - run `npm run db:types` to regenerate from Supabase

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
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          level: number
          xp: number
          xp_to_next_level: number
          gold: number
          pearls: number
          total_play_time_seconds: number
          enemies_defeated: number
          bosses_defeated: number
          items_collected: number
          highest_zone_reached: string
          created_at: string
          updated_at: string
          last_login_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          xp_to_next_level?: number
          gold?: number
          pearls?: number
          total_play_time_seconds?: number
          enemies_defeated?: number
          bosses_defeated?: number
          items_collected?: number
          highest_zone_reached?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          xp_to_next_level?: number
          gold?: number
          pearls?: number
          total_play_time_seconds?: number
          enemies_defeated?: number
          bosses_defeated?: number
          items_collected?: number
          highest_zone_reached?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          slot: string
          grade: string
          grade_index: number
          stat_multiplier: number
          is_equipped: boolean
          equipped_slot: string | null
          is_favorite: boolean
          is_locked: boolean
          is_account_bound: boolean
          from_full_set: boolean
          config_hash: number | null
          acquired_at: string
          acquired_from: string | null
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          slot: string
          grade?: string
          grade_index?: number
          stat_multiplier?: number
          is_equipped?: boolean
          equipped_slot?: string | null
          is_favorite?: boolean
          is_locked?: boolean
          is_account_bound?: boolean
          from_full_set?: boolean
          config_hash?: number | null
          acquired_at?: string
          acquired_from?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          slot?: string
          grade?: string
          grade_index?: number
          stat_multiplier?: number
          is_equipped?: boolean
          equipped_slot?: string | null
          is_favorite?: boolean
          is_locked?: boolean
          is_account_bound?: boolean
          from_full_set?: boolean
          config_hash?: number | null
          acquired_at?: string
          acquired_from?: string | null
        }
      }
      loadouts: {
        Row: {
          id: string
          user_id: string
          name: string
          is_active: boolean
          head_item_id: string | null
          antennae_item_id: string | null
          claw_left_item_id: string | null
          claw_right_item_id: string | null
          thorax_item_id: string | null
          legs_item_id: string | null
          abdomen_item_id: string | null
          tail_item_id: string | null
          cosmetic_item_id: string | null
          synergy_theme: string | null
          synergy_count: number
          synergy_power: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          is_active?: boolean
          head_item_id?: string | null
          antennae_item_id?: string | null
          claw_left_item_id?: string | null
          claw_right_item_id?: string | null
          thorax_item_id?: string | null
          legs_item_id?: string | null
          abdomen_item_id?: string | null
          tail_item_id?: string | null
          cosmetic_item_id?: string | null
          synergy_theme?: string | null
          synergy_count?: number
          synergy_power?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_active?: boolean
          head_item_id?: string | null
          antennae_item_id?: string | null
          claw_left_item_id?: string | null
          claw_right_item_id?: string | null
          thorax_item_id?: string | null
          legs_item_id?: string | null
          abdomen_item_id?: string | null
          tail_item_id?: string | null
          cosmetic_item_id?: string | null
          synergy_theme?: string | null
          synergy_count?: number
          synergy_power?: number
          created_at?: string
          updated_at?: string
        }
      }
      collection: {
        Row: {
          id: string
          user_id: string
          item_id: string
          slot: string
          general_discovered: boolean
          rare_discovered: boolean
          epic_discovered: boolean
          legendary_discovered: boolean
          one_of_one_discovered: boolean
          highest_grade_owned: string | null
          times_acquired: number
          first_discovered_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          slot: string
          general_discovered?: boolean
          rare_discovered?: boolean
          epic_discovered?: boolean
          legendary_discovered?: boolean
          one_of_one_discovered?: boolean
          highest_grade_owned?: string | null
          times_acquired?: number
          first_discovered_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          slot?: string
          general_discovered?: boolean
          rare_discovered?: boolean
          epic_discovered?: boolean
          legendary_discovered?: boolean
          one_of_one_discovered?: boolean
          highest_grade_owned?: string | null
          times_acquired?: number
          first_discovered_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string | null
          category: string
          requirements: Json
          reward_gold: number
          reward_pearls: number
          reward_xp: number
          reward_item_id: string | null
        }
        Insert: {
          id: string
          name: string
          description: string
          icon?: string | null
          category: string
          requirements?: Json
          reward_gold?: number
          reward_pearls?: number
          reward_xp?: number
          reward_item_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string | null
          category?: string
          requirements?: Json
          reward_gold?: number
          reward_pearls?: number
          reward_xp?: number
          reward_item_id?: string | null
        }
      }
      player_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          progress: number
          is_completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          progress?: number
          is_completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          progress?: number
          is_completed?: boolean
          completed_at?: string | null
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          ended_at: string | null
          duration_seconds: number | null
          zone: string | null
          enemies_defeated: number
          bosses_defeated: number
          items_dropped: number
          gold_earned: number
          xp_earned: number
        }
        Insert: {
          id?: string
          user_id: string
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          zone?: string | null
          enemies_defeated?: number
          bosses_defeated?: number
          items_dropped?: number
          gold_earned?: number
          xp_earned?: number
        }
        Update: {
          id?: string
          user_id?: string
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          zone?: string | null
          enemies_defeated?: number
          bosses_defeated?: number
          items_dropped?: number
          gold_earned?: number
          xp_earned?: number
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          language: string
          show_damage_numbers: boolean
          screen_shake: boolean
          master_volume: number
          music_volume: number
          sfx_volume: number
          notify_drops: boolean
          notify_achievements: boolean
          notify_friends: boolean
          profile_public: boolean
          show_online_status: boolean
          allow_friend_requests: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          language?: string
          show_damage_numbers?: boolean
          screen_shake?: boolean
          master_volume?: number
          music_volume?: number
          sfx_volume?: number
          notify_drops?: boolean
          notify_achievements?: boolean
          notify_friends?: boolean
          profile_public?: boolean
          show_online_status?: boolean
          allow_friend_requests?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          language?: string
          show_damage_numbers?: boolean
          screen_shake?: boolean
          master_volume?: number
          music_volume?: number
          sfx_volume?: number
          notify_drops?: boolean
          notify_achievements?: boolean
          notify_friends?: boolean
          profile_public?: boolean
          show_online_status?: boolean
          allow_friend_requests?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
