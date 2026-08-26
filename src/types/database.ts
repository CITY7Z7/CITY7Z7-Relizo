export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalDatabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      album_tracks: {
        Row: {
          album_id: string
          id: string
          track_id: string
          track_number: number
        }
        Insert: {
          album_id: string
          id?: string
          track_id: string
          track_number?: number
        }
        Update: {
          album_id?: string
          id?: string
          track_id?: string
          track_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "album_tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          artist: string
          catalog_number: string
          cover_art: string | null
          created_at: string
          id: string
          label: string
          release_date: string
          release_type: Database["public"]["Enums"]["release_type"]
          title: string
          upc: string
          updated_at: string
        }
        Insert: {
          artist: string
          catalog_number?: string
          cover_art?: string | null
          created_at?: string
          id?: string
          label?: string
          release_date?: string
          release_type?: Database["public"]["Enums"]["release_type"]
          title: string
          upc?: string
          updated_at?: string
        }
        Update: {
          artist?: string
          catalog_number?: string
          cover_art?: string | null
          created_at?: string
          id?: string
          label?: string
          release_date?: string
          release_type?: Database["public"]["Enums"]["release_type"]
          title?: string
          upc?: string
          updated_at?: string
        }
        Relationships: []
      }
      distributors: {
        Row: {
          contact_email: string
          created_at: string
          delivery_method: string
          distribution_status: string
          id: string
          name: string
          notes: string
          submission_format: string
        }
        Insert: {
          contact_email?: string
          created_at?: string
          delivery_method?: string
          distribution_status?: string
          id?: string
          name: string
          notes?: string
          submission_format?: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          delivery_method?: string
          distribution_status?: string
          id?: string
          name?: string
          notes?: string
          submission_format?: string
        }
        Relationships: []
      }
      production_subtasks: {
        Row: {
          completed: boolean
          end_date: string
          id: string
          production_task_id: string
          start_date: string
          title: string
          type: Database["public"]["Enums"]["subtask_type"]
        }
        Insert: {
          completed?: boolean
          end_date?: string
          id?: string
          production_task_id: string
          start_date?: string
          title: string
          type?: Database["public"]["Enums"]["subtask_type"]
        }
        Update: {
          completed?: boolean
          end_date?: string
          id?: string
          production_task_id?: string
          start_date?: string
          title?: string
          type?: Database["public"]["Enums"]["subtask_type"]
        }
        Relationships: [
          {
            foreignKeyName: "production_subtasks_production_task_id_fkey"
            columns: ["production_task_id"]
            isOneToOne: false
            referencedRelation: "production_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      production_tasks: {
        Row: {
          created_at: string
          end_date: string
          id: string
          phase: Database["public"]["Enums"]["production_phase"]
          progress: number
          release_id: string | null
          start_date: string
          title: string
          track_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string
          id?: string
          phase?: Database["public"]["Enums"]["production_phase"]
          progress?: number
          release_id?: string | null
          start_date?: string
          title: string
          track_title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          phase?: Database["public"]["Enums"]["production_phase"]
          progress?: number
          release_id?: string | null
          start_date?: string
          title?: string
          track_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_tasks_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_tasks: {
        Row: {
          campaign_name: string
          content_type: string
          created_at: string
          id: string
          platform: string
          scheduled_date: string
          status: string
          track_or_album: string
        }
        Insert: {
          campaign_name: string
          content_type?: string
          created_at?: string
          id?: string
          platform?: string
          scheduled_date?: string
          status?: string
          track_or_album?: string
        }
        Update: {
          campaign_name?: string
          content_type?: string
          created_at?: string
          id?: string
          platform?: string
          scheduled_date?: string
          status?: string
          track_or_album?: string
        }
        Relationships: []
      }
      promotion_channels: {
        Row: {
          contact_person: string
          created_at: string
          email: string
          id: string
          notes: string
          platform: string
        }
        Insert: {
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          notes?: string
          platform: string
        }
        Update: {
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          notes?: string
          platform?: string
        }
        Relationships: []
      }
      releases: {
        Row: {
          created_at: string
          distributor_submission_date: string
          id: string
          marketing_start_date: string
          planned_release_date: string
          reference_id: string
          status: Database["public"]["Enums"]["track_status"]
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          distributor_submission_date?: string
          id?: string
          marketing_start_date?: string
          planned_release_date?: string
          reference_id?: string
          status?: Database["public"]["Enums"]["track_status"]
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          distributor_submission_date?: string
          id?: string
          marketing_start_date?: string
          planned_release_date?: string
          reference_id?: string
          status?: Database["public"]["Enums"]["track_status"]
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string
          id: string
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          platform: string
          updated_at?: string
          url?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      track_audio_files: {
        Row: {
          created_at: string
          file_format: string
          file_size: number
          file_url: string
          id: string
          is_primary: boolean
          track_id: string
        }
        Insert: {
          created_at?: string
          file_format?: string
          file_size?: number
          file_url?: string
          id?: string
          is_primary?: boolean
          track_id: string
        }
        Update: {
          created_at?: string
          file_format?: string
          file_size?: number
          file_url?: string
          id?: string
          is_primary?: boolean
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_audio_files_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_distributors: {
        Row: {
          created_at: string
          distributor_id: string
          id: string
          track_id: string
        }
        Insert: {
          created_at?: string
          distributor_id: string
          id?: string
          track_id: string
        }
        Update: {
          created_at?: string
          distributor_id?: string
          id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_distributors_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_distributors_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_promotions: {
        Row: {
          created_at: string
          id: string
          promo_task_id: string
          track_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          promo_task_id: string
          track_id: string
        }
        Update: {
          created_at?: string
          id?: string
          promo_task_id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_promotions_promo_task_id_fkey"
            columns: ["promo_task_id"]
            isOneToOne: false
            referencedRelation: "promo_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_promotions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_relationships: {
        Row: {
          created_at: string
          id: string
          notes: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          source_track_id: string
          target_track_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          source_track_id: string
          target_track_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          source_track_id?: string
          target_track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_relationships_source_track_id_fkey"
            columns: ["source_track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_relationships_target_track_id_fkey"
            columns: ["target_track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          additional_contributors: string
          album_artist: string
          artist: string
          audio_file: string | null
          audio_file_type: string
          bitrate: string
          bpm: number
          catalog_tags: string
          channels: string
          comment: string
          composer: string
          conductor: string
          cover_art: string | null
          created_at: string
          description: string
          disc_number: number
          duration: string
          encoder: string
          explicit_flag: boolean
          featured_artists: string
          file_size: number
          genre: string
          grouping: string
          id: string
          id3_metadata: string
          isrc: string
          language: string
          last_played_at: string | null
          loudness_level: string
          lyrics: string
          musical_key: string
          musicians: string
          parent_track_id: string | null
          play_count: number
          publisher: string
          release_date: string
          release_type: string
          remixer_artist: string
          riff_metadata: string
          sample_rate: string
          status: Database["public"]["Enums"]["track_status"]
          subgenre: string
          title: string
          track_notes: string
          track_number: number
          track_type: Database["public"]["Enums"]["track_type"]
          upc: string
          updated_at: string
          version_name: string
          waveform_peaks: Json | null
          work_id: string | null
          year: number
        }
        Insert: {
          additional_contributors?: string
          album_artist?: string
          artist: string
          audio_file?: string | null
          audio_file_type?: string
          bitrate?: string
          bpm?: number
          catalog_tags?: string
          channels?: string
          comment?: string
          composer?: string
          conductor?: string
          cover_art?: string | null
          created_at?: string
          description?: string
          disc_number?: number
          duration?: string
          encoder?: string
          explicit_flag?: boolean
          featured_artists?: string
          file_size?: number
          genre?: string
          grouping?: string
          id?: string
          id3_metadata?: string
          isrc?: string
          language?: string
          last_played_at?: string | null
          loudness_level?: string
          lyrics?: string
          musical_key?: string
          musicians?: string
          parent_track_id?: string | null
          play_count?: number
          publisher?: string
          release_date?: string
          release_type?: string
          remixer_artist?: string
          riff_metadata?: string
          sample_rate?: string
          status?: Database["public"]["Enums"]["track_status"]
          subgenre?: string
          title: string
          track_notes?: string
          track_number?: number
          track_type?: Database["public"]["Enums"]["track_type"]
          upc?: string
          updated_at?: string
          version_name?: string
          waveform_peaks?: Json | null
          work_id?: string | null
          year?: number
        }
        Update: {
          additional_contributors?: string
          album_artist?: string
          artist?: string
          audio_file?: string | null
          audio_file_type?: string
          bitrate?: string
          bpm?: number
          catalog_tags?: string
          channels?: string
          comment?: string
          composer?: string
          conductor?: string
          cover_art?: string | null
          created_at?: string
          description?: string
          disc_number?: number
          duration?: string
          encoder?: string
          explicit_flag?: boolean
          featured_artists?: string
          file_size?: number
          genre?: string
          grouping?: string
          id?: string
          id3_metadata?: string
          isrc?: string
          language?: string
          last_played_at?: string | null
          loudness_level?: string
          lyrics?: string
          musical_key?: string
          musicians?: string
          parent_track_id?: string | null
          play_count?: number
          publisher?: string
          release_date?: string
          release_type?: string
          remixer_artist?: string
          riff_metadata?: string
          sample_rate?: string
          status?: Database["public"]["Enums"]["track_status"]
          subgenre?: string
          title?: string
          track_notes?: string
          track_number?: number
          track_type?: Database["public"]["Enums"]["track_type"]
          upc?: string
          updated_at?: string
          version_name?: string
          waveform_peaks?: Json | null
          work_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tracks_parent_track_id_fkey"
            columns: ["parent_track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      works: {
        Row: {
          composer: string
          created_at: string
          id: string
          lyricist: string
          notes: string
          publisher: string
          title: string
          updated_at: string
        }
        Insert: {
          composer?: string
          created_at?: string
          id?: string
          lyricist?: string
          notes?: string
          publisher?: string
          title: string
          updated_at?: string
        }
        Update: {
          composer?: string
          created_at?: string
          id?: string
          lyricist?: string
          notes?: string
          publisher?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      production_phase:
        | "writing"
        | "recording"
        | "mixing"
        | "mastering"
        | "review"
      relationship_type:
        | "remix_of"
        | "cover_of"
        | "sampled_from"
        | "interpolation_of"
      release_type: "Album" | "EP" | "Single"
      subtask_type: "production" | "release_prep" | "marketing" | "distribution"
      track_status: "Draft" | "Scheduled" | "Submitted" | "Ready" | "Released"
      track_type:
        | "Original"
        | "Remix"
        | "VIP Remix"
        | "Edit"
        | "Extended Mix"
        | "Radio Edit"
        | "Instrumental"
        | "Acapella"
        | "Live"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalDatabase">

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
    Enums: {
      production_phase: [
        "writing",
        "recording",
        "mixing",
        "mastering",
        "review",
      ],
      relationship_type: [
        "remix_of",
        "cover_of",
        "sampled_from",
        "interpolation_of",
      ],
      release_type: ["Album", "EP", "Single"],
      subtask_type: ["production", "release_prep", "marketing", "distribution"],
      track_status: ["Draft", "Scheduled", "Submitted", "Ready", "Released"],
      track_type: [
        "Original",
        "Remix",
        "VIP Remix",
        "Edit",
        "Extended Mix",
        "Radio Edit",
        "Instrumental",
        "Acapella",
        "Live",
      ],
    },
  },
} as const
