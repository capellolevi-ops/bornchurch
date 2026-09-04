export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          read: boolean
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          kind: string
          read?: boolean
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          ends_at: string | null
          id: string
          published: boolean
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          published?: boolean
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          published?: boolean
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean
          button_label: string
          created_at: string
          ends_at: string | null
          id: string
          image_url: string | null
          link: string
          starts_at: string | null
          text: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          button_label?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          link?: string
          starts_at?: string | null
          text: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          button_label?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          link?: string
          starts_at?: string | null
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          link: string
          location: string
          published: boolean
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          link?: string
          location?: string
          published?: boolean
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          link?: string
          location?: string
          published?: boolean
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          created_at: string
          description: string
          id: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      music_albums: {
        Row: {
          artist_id: string | null
          cover_url: string | null
          created_at: string
          description: string
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          artist_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          artist_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "music_albums_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "music_artists"
            referencedColumns: ["id"]
          },
        ]
      }
      music_artists: {
        Row: {
          bio: string
          created_at: string
          id: string
          name: string
          photo_url: string | null
          published: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          published?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          published?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      music_tracks: {
        Row: {
          album_id: string | null
          artist_id: string | null
          audio_url: string | null
          cover_url: string | null
          created_at: string
          credits: string
          description: string
          duration_seconds: number
          genre: string
          id: string
          kind: string
          lyrics: string
          play_count: number
          published: boolean
          released_on: string | null
          slug: string
          title: string
          track_number: number
          updated_at: string
          youtube_id: string
        }
        Insert: {
          album_id?: string | null
          artist_id?: string | null
          audio_url?: string | null
          cover_url?: string | null
          created_at?: string
          credits?: string
          description?: string
          duration_seconds?: number
          genre?: string
          id?: string
          kind?: string
          lyrics?: string
          play_count?: number
          published?: boolean
          released_on?: string | null
          slug: string
          title: string
          track_number?: number
          updated_at?: string
          youtube_id?: string
        }
        Update: {
          album_id?: string | null
          artist_id?: string | null
          audio_url?: string | null
          cover_url?: string | null
          created_at?: string
          credits?: string
          description?: string
          duration_seconds?: number
          genre?: string
          id?: string
          kind?: string
          lyrics?: string
          play_count?: number
          published?: boolean
          released_on?: string | null
          slug?: string
          title?: string
          track_number?: number
          updated_at?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "music_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_tracks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "music_artists"
            referencedColumns: ["id"]
          },
        ]
      }
      play_history: {
        Row: {
          id: string
          played_at: string
          seconds_played: number
          track_id: string
          user_id: string
        }
        Insert: {
          id?: string
          played_at?: string
          seconds_played?: number
          track_id: string
          user_id: string
        }
        Update: {
          id?: string
          played_at?: string
          seconds_played?: number
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks: {
        Row: {
          added_by: string | null
          created_at: string
          id: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: string
          playlist_id: string
          position?: number
          track_id: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string
          featured: boolean
          id: string
          is_collaborative: boolean
          is_public: boolean
          owner_id: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          is_collaborative?: boolean
          is_public?: boolean
          owner_id?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          is_collaborative?: boolean
          is_public?: boolean
          owner_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          admin_reply: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          prayer_count: number
          status: string
          updated_at: string
          visibility: string
        }
        Insert: {
          admin_reply?: string
          created_at?: string
          email?: string
          id?: string
          message: string
          name?: string
          phone?: string
          prayer_count?: number
          status?: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          admin_reply?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          prayer_count?: number
          status?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          created_at: string
          description: string
          id: string
          preached_on: string | null
          preacher: string
          published: boolean
          title: string
          updated_at: string
          youtube_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          preached_on?: string | null
          preacher?: string
          published?: boolean
          title: string
          updated_at?: string
          youtube_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          preached_on?: string | null
          preacher?: string
          published?: boolean
          title?: string
          updated_at?: string
          youtube_id?: string
        }
        Relationships: []
      }
      service_times: {
        Row: {
          created_at: string
          day: string
          description: string
          id: string
          published: boolean
          sort_order: number
          times: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day: string
          description?: string
          id?: string
          published?: boolean
          sort_order?: number
          times?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day?: string
          description?: string
          id?: string
          published?: boolean
          sort_order?: number
          times?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          email: string
          form_key: string
          form_label: string
          id: string
          message: string
          name: string
          needs_review: boolean
          notes: string
          payload: Json
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          form_key: string
          form_label?: string
          id?: string
          message?: string
          name?: string
          needs_review?: boolean
          notes?: string
          payload?: Json
          phone?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          form_key?: string
          form_label?: string
          id?: string
          message?: string
          name?: string
          needs_review?: boolean
          notes?: string
          payload?: Json
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_favorite_tracks: {
        Row: {
          created_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followed_artists: {
        Row: {
          artist_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followed_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "music_artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_saved_albums: {
        Row: {
          album_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          album_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          album_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_albums_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "music_albums"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_prayer_count: { Args: { _id: string }; Returns: number }
      increment_track_play: { Args: { _id: string }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
