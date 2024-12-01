export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          is_deleted: boolean | null;
          name: string;
          store_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          name: string;
          store_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          name?: string;
          store_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "categories_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          }
        ];
      };
      items: {
        Row: {
          category_id: number;
          created_at: string | null;
          id: number;
          is_active: boolean | null;
          is_deleted: boolean | null;
          name: string;
          price: number;
          stock_count: number | null;
          store_id: number;
          updated_at: string | null;
        };
        Insert: {
          category_id: number;
          created_at?: string | null;
          id?: number;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          name: string;
          price: number;
          stock_count?: number | null;
          store_id: number;
          updated_at?: string | null;
        };
        Update: {
          category_id?: number;
          created_at?: string | null;
          id?: number;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          name?: string;
          price?: number;
          stock_count?: number | null;
          store_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "items_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          item_id: number;
          order_id: number;
          quantity: number | null;
        };
        Insert: {
          item_id: number;
          order_id: number;
          quantity?: number | null;
        };
        Update: {
          item_id?: number;
          order_id?: number;
          quantity?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          created_at: string | null;
          id: number;
          is_deleted: boolean | null;
          status: Database["public"]["Enums"]["order_status"];
          store_id: number;
          total: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_deleted?: boolean | null;
          status: Database["public"]["Enums"]["order_status"];
          store_id: number;
          total: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_deleted?: boolean | null;
          status?: Database["public"]["Enums"]["order_status"];
          store_id?: number;
          total?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          }
        ];
      };
      stores: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          is_deleted: boolean | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          is_deleted?: boolean | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_order: {
        Args: {
          o_store_id: number;
          o_items: Database["public"]["CompositeTypes"]["order_item_type"][];
          o_status?: Database["public"]["Enums"]["order_status"];
        };
        Returns: {
          id: number;
          total: number;
          status: Database["public"]["Enums"]["order_status"];
          created_at: string;
          store_id: number;
        }[];
      };
    };
    Enums: {
      order_status: "pending" | "fulfilled";
    };
    CompositeTypes: {
      order_item_type: {
        item_id: number | null;
        quantity: number | null;
      };
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
