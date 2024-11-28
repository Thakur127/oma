import { Category } from "@/types/inventory";
import { atom, selectorFamily } from "recoil";

export const inventoryState = atom<Category[]>({
  key: "categories",
  default: [],
});

export const selectedStoreInventory = selectorFamily({
  key: "selectedOrderInventory",
  get:
    (storeId) =>
    ({ get }) => {
      const inventory = get(inventoryState);
      return inventory.filter((items) => items.store_id === storeId);
    },
});
