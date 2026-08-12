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
    PostgrestVersion: "14.15"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_prayer_count: { Args: { _id: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
