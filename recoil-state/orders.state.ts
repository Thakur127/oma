import { Order } from "@/types/order";
import { atom, selectorFamily } from "recoil";

export const ordersState = atom<Order[]>({
  key: "orders",
  default: [],
});

export const selectedStoreOrder = selectorFamily({
  key: "selectedStoreOrder",
  get:
    (storeId) =>
    ({ get }) => {
      const orders = get(ordersState);
      return orders.filter((order) => order.store_id === storeId);
    },
});

export const selectedOrder = selectorFamily({
  key: "selectedOrder",
  get:
    (orderId) =>
    ({ get }) => {
      const orders = get(ordersState);
      return orders.find((order) => order.id === orderId);
    },
});
