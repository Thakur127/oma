export interface Item {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  item_id: number;
  quantity: number;
  item: Item;
}

export enum OrderStatus {
  PENDING,
  FULLFILLED,
}
export interface Order {
  id: number;
  items?: OrderItem[];
  total: number;
  status: "pending" | "fulfilled";
  created_at: Date;
  updated_at?: Date;
  store_id?: number;
}
