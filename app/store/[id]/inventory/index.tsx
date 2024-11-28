import BackButton from "@/components/BackButton";
import CategoryCard from "@/components/CategoryCard";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { useRefreshState } from "@/hooks/useRefreshState";

import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, RefreshControl, Text, View, Alert } from "react-native";

import { Category } from "@/types/inventory";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  inventoryState,
  selectedStoreInventory,
} from "@/recoil-state/inventory.state";
import { selectedStore } from "@/recoil-state/stores.state";
import { getSupabaseClient } from "@/lib/db/supabase";

export default function Categories() {
  const { id: store_id } = useLocalSearchParams();
  const categories = useRecoilValue(selectedStoreInventory(Number(store_id)));
  const setCategories = useSetRecoilState(inventoryState);
  const store = useRecoilValue(selectedStore(Number(store_id)));

  // Fetch categories function
  const fetchCategories = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
      id, 
      name, 
      image_url, 
      store_id,
      items:items(
        id, 
        name, 
        price, 
        stock_count
      )
        `
      )
      .eq("store_id", store_id)
      .returns<Category[]>();
    if (error) {
      console.log(error);
      Alert.alert(error.message);
    }
    setCategories((data as any) || []);
  };

  useEffect(() => {
    // console.log("Inventory for store_id", store_id, categories);

    if (store_id && categories && categories.length === 0) fetchCategories();
  }, []);

  const { refresh, handleRefresh } = useRefreshState(fetchCategories);

  return (
    <Container>
      <Heading
        title={`${store?.name || "Store #" + store_id} Inventory`}
        icon={<BackButton />}
      />
      <View className="rounded-xl">
        <FlatList
          className="mb-24"
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: category }) => {
            return (
              <CategoryCard
                category={category}
                CategoryItemComponent={({ item }) => {
                  return (
                    <View
                      key={item.id}
                      className="flex-row items-center justify-between my-1 px-4"
                    >
                      <Text className="font-normal text-lg text-gray-800 dark:text-gray-200">
                        {item.name}{" "}
                        {item.stock_count && `x ${item.stock_count}`}
                      </Text>
                      <Text className="font-normal text-lg text-gray-800 dark:text-gray-200">
                        ₹ {item.price}
                      </Text>
                    </View>
                  );
                }}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={() => {
            return (
              <View className="flex-1 justify-center items-center h-80">
                <Text className="text-gray-600 dark:text-gray-300 text-2xl font-semibold">
                  No Categories Available
                </Text>

                <Text className="text-lg mt-4">Pull down to refresh</Text>
              </View>
            );
          }} // Show this when the list is empty
        />
      </View>
    </Container>
  );
}
