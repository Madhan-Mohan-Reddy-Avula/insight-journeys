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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          conversation_type: string
          created_at: string
          id: string
          messages: Json
          trip_plan_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_type?: string
          created_at?: string
          id?: string
          messages?: Json
          trip_plan_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          id?: string
          messages?: Json
          trip_plan_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_details: Json | null
          booking_type: string
          created_at: string
          departure_date: string | null
          from_location: string | null
          id: string
          passengers: number
          return_date: string | null
          status: string
          to_location: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_details?: Json | null
          booking_type: string
          created_at?: string
          departure_date?: string | null
          from_location?: string | null
          id?: string
          passengers?: number
          return_date?: string | null
          status?: string
          to_location?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_details?: Json | null
          booking_type?: string
          created_at?: string
          departure_date?: string | null
          from_location?: string | null
          id?: string
          passengers?: number
          return_date?: string | null
          status?: string
          to_location?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      buses: {
        Row: {
          amenities: string[] | null
          arrival_time: string
          available_seats: number
          bus_number: string
          bus_type: string
          created_at: string
          departure_time: string
          duration_hours: number
          from_city: string
          id: string
          is_active: boolean
          operator_name: string
          price: number
          to_city: string
        }
        Insert: {
          amenities?: string[] | null
          arrival_time: string
          available_seats?: number
          bus_number: string
          bus_type: string
          created_at?: string
          departure_time: string
          duration_hours: number
          from_city: string
          id?: string
          is_active?: boolean
          operator_name: string
          price: number
          to_city: string
        }
        Update: {
          amenities?: string[] | null
          arrival_time?: string
          available_seats?: number
          bus_number?: string
          bus_type?: string
          created_at?: string
          departure_time?: string
          duration_hours?: number
          from_city?: string
          id?: string
          is_active?: boolean
          operator_name?: string
          price?: number
          to_city?: string
        }
        Relationships: []
      }
      flights: {
        Row: {
          aircraft_type: string | null
          airline_name: string
          arrival_time: string
          available_seats: number
          created_at: string
          departure_time: string
          duration_hours: number
          flight_number: string
          from_airport: string
          id: string
          is_active: boolean
          price: number
          to_airport: string
        }
        Insert: {
          aircraft_type?: string | null
          airline_name: string
          arrival_time: string
          available_seats?: number
          created_at?: string
          departure_time: string
          duration_hours: number
          flight_number: string
          from_airport: string
          id?: string
          is_active?: boolean
          price: number
          to_airport: string
        }
        Update: {
          aircraft_type?: string | null
          airline_name?: string
          arrival_time?: string
          available_seats?: number
          created_at?: string
          departure_time?: string
          duration_hours?: number
          flight_number?: string
          from_airport?: string
          id?: string
          is_active?: boolean
          price?: number
          to_airport?: string
        }
        Relationships: []
      }
      hotel_contacts: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          hotel_id: string
          id: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          hotel_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          hotel_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_contacts_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          amenities: string[] | null
          available_rooms: number
          city: string
          created_at: string
          description: string | null
          hotel_name: string
          id: string
          images: string[] | null
          is_active: boolean
          location: string
          price_per_night: number
          star_rating: number | null
        }
        Insert: {
          amenities?: string[] | null
          available_rooms?: number
          city: string
          created_at?: string
          description?: string | null
          hotel_name: string
          id?: string
          images?: string[] | null
          is_active?: boolean
          location: string
          price_per_night: number
          star_rating?: number | null
        }
        Update: {
          amenities?: string[] | null
          available_rooms?: number
          city?: string
          created_at?: string
          description?: string | null
          hotel_name?: string
          id?: string
          images?: string[] | null
          is_active?: boolean
          location?: string
          price_per_night?: number
          star_rating?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trains: {
        Row: {
          amenities: string[] | null
          arrival_time: string
          classes: Json
          created_at: string
          departure_time: string
          duration_hours: number
          from_station: string
          id: string
          is_active: boolean
          to_station: string
          train_name: string
          train_number: string
        }
        Insert: {
          amenities?: string[] | null
          arrival_time: string
          classes: Json
          created_at?: string
          departure_time: string
          duration_hours: number
          from_station: string
          id?: string
          is_active?: boolean
          to_station: string
          train_name: string
          train_number: string
        }
        Update: {
          amenities?: string[] | null
          arrival_time?: string
          classes?: Json
          created_at?: string
          departure_time?: string
          duration_hours?: number
          from_station?: string
          id?: string
          is_active?: boolean
          to_station?: string
          train_name?: string
          train_number?: string
        }
        Relationships: []
      }
      trip_plans: {
        Row: {
          created_at: string
          destinations: string[]
          end_date: string
          group_size: number
          id: string
          start_date: string
          status: string
          total_budget: number | null
          trip_details: Json | null
          trip_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destinations: string[]
          end_date: string
          group_size?: number
          id?: string
          start_date: string
          status?: string
          total_budget?: number | null
          trip_details?: Json | null
          trip_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destinations?: string[]
          end_date?: string
          group_size?: number
          id?: string
          start_date?: string
          status?: string
          total_budget?: number | null
          trip_details?: Json | null
          trip_name?: string
          updated_at?: string
          user_id?: string
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
