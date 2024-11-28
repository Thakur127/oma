export interface Product {
  id: number;
  name: string;
  price: number;
  stock_count?: number;
  store_id?: number;
}

export interface Category {
  id: number;
  name: string;
  image_url: string;
  items: Product[];
  store_id?: number;
}
