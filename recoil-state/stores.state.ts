import { Store } from "@/types/store";
import { atom, selectorFamily } from "recoil";

export const storesState = atom<Store[]>({
  key: "stores",
  default: [],
});

export const selectedStore = selectorFamily({
  key: "selectedStore",
  get:
    (storeId) =>
    ({ get }) => {
      return get(storesState).find((store) => store.id === storeId);
    },
});
