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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      notification_logs: {
        Row: {
          channel: string
          cost_amount: number | null
          currency: string | null
          error_message: string | null
          event: string
          id: string
          message: string
          phone_number: string
          sent_at: string
          status: string
          subscription_id: string
        }
        Insert: {
          channel: string
          cost_amount?: number | null
          currency?: string | null
          error_message?: string | null
          event: string
          id?: string
          message: string
          phone_number: string
          sent_at?: string
          status: string
          subscription_id: string
        }
        Update: {
          channel?: string
          cost_amount?: number | null
          currency?: string | null
          error_message?: string | null
          event?: string
          id?: string
          message?: string
          phone_number?: string
          sent_at?: string
          status?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_price_changes: {
        Row: {
          application_type: Database["public"]["Enums"]["application_type"]
          applied_at: string | null
          auto_suspend_fixed_until_approval: boolean | null
          change_type: Database["public"]["Enums"]["price_change_type"]
          changed_by: string | null
          created_at: string | null
          difference: number | null
          id: string
          internal_notes: string | null
          new_base_amount: number
          old_base_amount: number
          percentage_change: number | null
          product_id: string
          reason: string
          requires_approval_for_fixed: boolean | null
          scheduled_date: string | null
          status: string
          subscriptions_applied: number | null
          subscriptions_failed: number | null
          subscriptions_pending_approval: number | null
          total_subscriptions_affected: number | null
          updated_at: string | null
        }
        Insert: {
          application_type: Database["public"]["Enums"]["application_type"]
          applied_at?: string | null
          auto_suspend_fixed_until_approval?: boolean | null
          change_type: Database["public"]["Enums"]["price_change_type"]
          changed_by?: string | null
          created_at?: string | null
          difference?: number | null
          id?: string
          internal_notes?: string | null
          new_base_amount: number
          old_base_amount: number
          percentage_change?: number | null
          product_id: string
          reason: string
          requires_approval_for_fixed?: boolean | null
          scheduled_date?: string | null
          status?: string
          subscriptions_applied?: number | null
          subscriptions_failed?: number | null
          subscriptions_pending_approval?: number | null
          total_subscriptions_affected?: number | null
          updated_at?: string | null
        }
        Update: {
          application_type?: Database["public"]["Enums"]["application_type"]
          applied_at?: string | null
          auto_suspend_fixed_until_approval?: boolean | null
          change_type?: Database["public"]["Enums"]["price_change_type"]
          changed_by?: string | null
          created_at?: string | null
          difference?: number | null
          id?: string
          internal_notes?: string | null
          new_base_amount?: number
          old_base_amount?: number
          percentage_change?: number | null
          product_id?: string
          reason?: string
          requires_approval_for_fixed?: boolean | null
          scheduled_date?: string | null
          status?: string
          subscriptions_applied?: number | null
          subscriptions_failed?: number | null
          subscriptions_pending_approval?: number | null
          total_subscriptions_affected?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_price_changes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active_subscriptions_count: number | null
          allow_pause: boolean | null
          allow_price_modification: boolean | null
          auto_apply_price_changes: boolean | null
          base_amount: number
          created_at: string | null
          description: string | null
          duration_type: Database["public"]["Enums"]["duration_type"]
          first_charge_type:
            | Database["public"]["Enums"]["first_charge_type"]
            | null
          frequency: Database["public"]["Enums"]["subscription_frequency"]
          id: string
          internal_code: string | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          number_of_payments: number | null
          send_reminder_before_charge: boolean | null
          total_subscriptions_count: number | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_subscriptions_count?: number | null
          allow_pause?: boolean | null
          allow_price_modification?: boolean | null
          auto_apply_price_changes?: boolean | null
          base_amount: number
          created_at?: string | null
          description?: string | null
          duration_type: Database["public"]["Enums"]["duration_type"]
          first_charge_type?:
            | Database["public"]["Enums"]["first_charge_type"]
            | null
          frequency: Database["public"]["Enums"]["subscription_frequency"]
          id?: string
          internal_code?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          number_of_payments?: number | null
          send_reminder_before_charge?: boolean | null
          total_subscriptions_count?: number | null
          trial_period_days?: number | null
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_subscriptions_count?: number | null
          allow_pause?: boolean | null
          allow_price_modification?: boolean | null
          auto_apply_price_changes?: boolean | null
          base_amount?: number
          created_at?: string | null
          description?: string | null
          duration_type?: Database["public"]["Enums"]["duration_type"]
          first_charge_type?:
            | Database["public"]["Enums"]["first_charge_type"]
            | null
          frequency?: Database["public"]["Enums"]["subscription_frequency"]
          id?: string
          internal_code?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          number_of_payments?: number | null
          send_reminder_before_charge?: boolean | null
          total_subscriptions_count?: number | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_price_changes: {
        Row: {
          application_type: Database["public"]["Enums"]["application_type"]
          applied_at: string | null
          approval_token: string | null
          change_type: Database["public"]["Enums"]["price_change_type"]
          changed_by: string | null
          client_approval_date: string | null
          client_approval_method: string | null
          client_approval_status:
            | Database["public"]["Enums"]["client_approval_status"]
            | null
          client_notified: boolean | null
          client_notified_at: string | null
          created_at: string
          difference: number | null
          id: string
          internal_notes: string | null
          new_amount: number
          old_amount: number
          percentage_change: number | null
          product_price_change_id: string | null
          reason: string
          requires_client_approval: boolean | null
          scheduled_date: string | null
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          application_type: Database["public"]["Enums"]["application_type"]
          applied_at?: string | null
          approval_token?: string | null
          change_type: Database["public"]["Enums"]["price_change_type"]
          changed_by?: string | null
          client_approval_date?: string | null
          client_approval_method?: string | null
          client_approval_status?:
            | Database["public"]["Enums"]["client_approval_status"]
            | null
          client_notified?: boolean | null
          client_notified_at?: string | null
          created_at?: string
          difference?: number | null
          id?: string
          internal_notes?: string | null
          new_amount: number
          old_amount: number
          percentage_change?: number | null
          product_price_change_id?: string | null
          reason: string
          requires_client_approval?: boolean | null
          scheduled_date?: string | null
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          application_type?: Database["public"]["Enums"]["application_type"]
          applied_at?: string | null
          approval_token?: string | null
          change_type?: Database["public"]["Enums"]["price_change_type"]
          changed_by?: string | null
          client_approval_date?: string | null
          client_approval_method?: string | null
          client_approval_status?:
            | Database["public"]["Enums"]["client_approval_status"]
            | null
          client_notified?: boolean | null
          client_notified_at?: string | null
          created_at?: string
          difference?: number | null
          id?: string
          internal_notes?: string | null
          new_amount?: number
          old_amount?: number
          percentage_change?: number | null
          product_price_change_id?: string | null
          reason?: string
          requires_client_approval?: boolean | null
          scheduled_date?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_price_changes_product_price_change_id_fkey"
            columns: ["product_price_change_id"]
            isOneToOne: false
            referencedRelation: "product_price_changes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_price_changes_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          allow_pause: boolean | null
          amount: number
          billing_day: number
          client_email: string
          client_name: string
          concept: string
          created_at: string
          created_from_product: boolean | null
          description: string | null
          duration_type: Database["public"]["Enums"]["duration_type"]
          first_charge_date: string | null
          first_charge_type: Database["public"]["Enums"]["first_charge_type"]
          first_payment_amount: number | null
          first_payment_reason: string | null
          frequency: Database["public"]["Enums"]["subscription_frequency"]
          id: string
          is_first_payment_completed: boolean | null
          last_charge_date: string | null
          last_price_change_date: string | null
          next_charge_date: string
          number_of_payments: number | null
          payments_completed: number | null
          pending_price_change_id: string | null
          phone_number: string
          price_change_history_count: number | null
          product_id: string | null
          reference: string
          send_reminder_before_charge: boolean | null
          status: Database["public"]["Enums"]["subscription_status"]
          trial_period_days: number | null
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_pause?: boolean | null
          amount: number
          billing_day: number
          client_email: string
          client_name: string
          concept: string
          created_at?: string
          created_from_product?: boolean | null
          description?: string | null
          duration_type: Database["public"]["Enums"]["duration_type"]
          first_charge_date?: string | null
          first_charge_type: Database["public"]["Enums"]["first_charge_type"]
          first_payment_amount?: number | null
          first_payment_reason?: string | null
          frequency: Database["public"]["Enums"]["subscription_frequency"]
          id?: string
          is_first_payment_completed?: boolean | null
          last_charge_date?: string | null
          last_price_change_date?: string | null
          next_charge_date: string
          number_of_payments?: number | null
          payments_completed?: number | null
          pending_price_change_id?: string | null
          phone_number: string
          price_change_history_count?: number | null
          product_id?: string | null
          reference: string
          send_reminder_before_charge?: boolean | null
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_pause?: boolean | null
          amount?: number
          billing_day?: number
          client_email?: string
          client_name?: string
          concept?: string
          created_at?: string
          created_from_product?: boolean | null
          description?: string | null
          duration_type?: Database["public"]["Enums"]["duration_type"]
          first_charge_date?: string | null
          first_charge_type?: Database["public"]["Enums"]["first_charge_type"]
          first_payment_amount?: number | null
          first_payment_reason?: string | null
          frequency?: Database["public"]["Enums"]["subscription_frequency"]
          id?: string
          is_first_payment_completed?: boolean | null
          last_charge_date?: string | null
          last_price_change_date?: string | null
          next_charge_date?: string
          number_of_payments?: number | null
          payments_completed?: number | null
          pending_price_change_id?: string | null
          phone_number?: string
          price_change_history_count?: number | null
          product_id?: string | null
          reference?: string
          send_reminder_before_charge?: boolean | null
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_approval_token: { Args: never; Returns: string }
    }
    Enums: {
      application_type: "immediate" | "next_cycle" | "scheduled"
      client_approval_status:
        | "pending"
        | "approved"
        | "rejected"
        | "not_required"
      duration_type: "unlimited" | "limited"
      first_charge_type: "immediate" | "scheduled"
      price_change_type: "upgrade" | "downgrade" | "inflation" | "custom"
      subscription_frequency:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "biweekly"
        | "bimonthly"
        | "semiannual"
        | "annual"
      subscription_status:
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
        | "trial"
      subscription_type: "fixed" | "variable" | "single"
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
    Enums: {
      application_type: ["immediate", "next_cycle", "scheduled"],
      client_approval_status: [
        "pending",
        "approved",
        "rejected",
        "not_required",
      ],
      duration_type: ["unlimited", "limited"],
      first_charge_type: ["immediate", "scheduled"],
      price_change_type: ["upgrade", "downgrade", "inflation", "custom"],
      subscription_frequency: [
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
        "biweekly",
        "bimonthly",
        "semiannual",
        "annual",
      ],
      subscription_status: [
        "active",
        "paused",
        "cancelled",
        "expired",
        "trial",
      ],
      subscription_type: ["fixed", "variable", "single"],
    },
  },
} as const
