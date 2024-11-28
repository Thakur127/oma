export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: number;
          name: string;
          description?: string;
          image_url?: string;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string;
          image_url?: string;
          is_active?: boolean;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          image_url?: string;
          is_active?: boolean;
        };
      };

      items: {
        Row: {
          id: number;
          name: string;
          price: number;
          quantity?: number;
          store_id: number;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          name: string;
          price: number;
          quantity?: number;
          store_id: number;
          is_active?: boolean;
        };
        Update: {
          id?: number;
          name?: string;
          price?: number;
          quantity?: number;
          store_id?: number;
          is_active?: boolean;
        };
      };
    };
  };
}
