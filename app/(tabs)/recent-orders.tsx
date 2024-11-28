import OrderCard from "@/components/OrderCard";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { useRefreshState } from "@/hooks/useRefreshState";
import { getSupabaseClient } from "@/lib/db/supabase";
import { ordersState } from "@/recoil-state/orders.state";
import { Order } from "@/types/order";
import { useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRecoilState } from "recoil";

export default function RecentOrdersTab() {
  const [orders, setOrders] = useRecoilState(ordersState);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [debouncedSearchOrderId, setDebouncedSearchOrderId] =
    useState<string>("");

  const fetchOrders = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .order("created_at", { ascending: false })
      .returns<Order[]>();
    if (error) {
      // console.log("Error fetching orders:", error);
      Alert.alert(error.message);
    }
    setOrders(data || []);
  };

  const searchedOrders = async () => {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .eq("id", debouncedSearchOrderId)
      .order("created_at", { ascending: false })
      .returns<Order[]>();

    if (error) {
      Alert.alert(error.message);
    }
    setFilteredOrders(data || []);
  };

  useFocusEffect(() => {
    if (debouncedSearchOrderId === "") setFilteredOrders(orders);
  });

  // Initial fetch and refresh logic
  useEffect(() => {
    // console.log("orders for store", store?.name, orders);
    if (orders.length === 0) fetchOrders();
    if (debouncedSearchOrderId === "") setFilteredOrders(orders);
    else searchedOrders();
  }, [debouncedSearchOrderId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchOrderId(searchOrderId.trim());
    }, 500); // 0.5 sec delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchOrderId]);

  const { refresh, handleRefresh } = useRefreshState(fetchOrders);

  return (
    <Container className="flex-1 p-4">
      <Heading title="Recent Orders" />
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
                No order found
              </Text>

              <Text className="mt-4 text-gray-400">Pull down to refresh</Text>
            </View>
          );
        }}
      />
    </Container>
  );
}
