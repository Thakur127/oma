import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getSupabaseClient } from "@/lib/db/supabase";
import { Order } from "@/types/order";
import { Heading } from "@/components/ui/heading";
import BackButton from "@/components/BackButton";

import { useRefreshState } from "@/hooks/useRefreshState";
import { Container } from "@/components/ui/container";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { ordersState, selectedStoreOrder } from "@/recoil-state/orders.state";
import { selectedStore } from "@/recoil-state/stores.state";
import OrderCard from "@/components/OrderCard";

export default function Orders() {
  const { id: store_id } = useLocalSearchParams();
  const store = useRecoilValue(selectedStore(Number(store_id)));

  const orders = useRecoilValue(selectedStoreOrder(Number(store_id)));
  const setOrders = useSetRecoilState(ordersState);

  const [filteredOrders, setFilteredOrders] = useState(orders);

  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [debouncedSearchOrderId, setDebouncedSearchOrderId] =
    useState<string>("");

  // Fetch all orders for the store
  const fetchOrders = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .eq("store_id", store_id)
      .order("created_at", { ascending: false })
      .returns<Order[]>();
    if (error) {
      // console.log("Error fetching orders:", error);
      Alert.alert(error.message);
    }

    setFilteredOrders(data || []);
    setOrders((prev) => {
      // Merge new data, ensuring unique orders based on `id`
      const mergedOrders = [...prev, ...(data || [])];
      const uniqueOrders = mergedOrders.reduce((acc, order) => {
        if (!acc.find((o) => o.id === order.id)) {
          acc.push(order);
        }
        return acc;
      }, [] as Order[]);
      return uniqueOrders;
    });
  };

  const searchedOrders = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .eq("store_id", store_id)
      .eq("id", debouncedSearchOrderId)
      .order("created_at", { ascending: false })
      .returns<Order[]>();

    if (error) {
      Alert.alert(error.message);
    }
    setFilteredOrders(data || []);
  };

  // whenever screen focuses
  useFocusEffect(() => {
    if (debouncedSearchOrderId === "") setFilteredOrders(orders);
  });

  // Initial fetch and refresh logic
  useEffect(() => {
    // console.log("orders for store", store?.name, orders);
    if (orders.length === 0) fetchOrders();
    if (debouncedSearchOrderId === "") setFilteredOrders(orders);
    else searchedOrders();
  }, [store_id, debouncedSearchOrderId]);

  const { refresh, handleRefresh } = useRefreshState(fetchOrders);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchOrderId(searchOrderId.trim());
    }, 500); // 0.5 sec delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchOrderId]);

  return (
    <Container>
      <Heading title={`${store?.name} Orders`} icon={<BackButton />} />
      <View className="mb-4">
        {/* Search Bar */}
        <TextInput
          value={searchOrderId}
          onChangeText={(text) => setSearchOrderId(text)}
          placeholder="Search orders..."
          placeholderTextColor="#9CA3AF"
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full px-4 py-4 mb-4 shadow-md"
        />
      </View>

      <FlatList
        className=" mb-4"
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return <OrderCard key={item.id} item={item} />;
        }}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
            refreshing={refresh}
            colors={["#9CA3AF"]}
            progressBackgroundColor={"black"}
          />
        }
        ListEmptyComponent={() => {
          return (
            <View className="items-center justify-center h-80">
              <Text className="text-gray-600 dark:text-gray-300 text-2xl font-semibold">
                No orders found
              </Text>

              <Text className="mt-4">Pull down to refresh</Text>
            </View>
          );
        }}
      />
      <View>
        <Link asChild href={`/store/${store_id}/orders/new`}>
          <TouchableOpacity className="bg-teal-500 p-4 items-center rounded-lg">
            <Text className="text-gray-200 dark:text-gray-800 text-2xl font-semibold">
              New Order
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Container>
  );
}
