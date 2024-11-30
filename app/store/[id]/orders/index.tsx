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
import OrderList from "@/components/OrderList";

export default function Orders() {
  const { id: store_id } = useLocalSearchParams();
  const store = useRecoilValue(selectedStore(Number(store_id)));

  const orders = useRecoilValue(selectedStoreOrder(Number(store_id)));
  const setOrders = useSetRecoilState(ordersState);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchOrderId, setSearchOrderId] = useState<string>("");

  // Date Filter State
  const [filterDateRange, setFilterDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null, // greater date
    endDate: null, // smaller date
  });
  const [filterOrderStatusState, setFilterOrderStatusState] = useState("");

  // Fetch all orders for the store
  const fetchOrders = async () => {
    const supabase = await getSupabaseClient();

    // Convert date range to UTC strings if provided
    const startDate = filterDateRange.startDate
      ? new Date(
          filterDateRange.startDate.getTime() -
            filterDateRange.startDate.getTimezoneOffset() * 60 * 1000
        ).toISOString()
      : null;

    const endDate = filterDateRange.endDate
      ? new Date(
          filterDateRange.endDate.getTime() -
            filterDateRange.endDate.getTimezoneOffset() * 60 * 1000
        ).toISOString()
      : null;

    let query = supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .eq("store_id", store_id)
      .is("is_deleted", false)
      .order("created_at", { ascending: false });

    // Apply date range filters if available
    if (startDate && endDate) {
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }

    // Apply status filter if set
    if (filterOrderStatusState) {
      query = query.eq("status", filterOrderStatusState);
    }

    // Execute query
    const { data, error } = await query.returns<Order[]>();

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

  const searchOrders = async () => {
    const supabase = await getSupabaseClient();

    let orderId = searchOrderId;
    if (!/^\d+$/.test(orderId)) orderId = "0";
    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .eq("store_id", store_id)
      .eq("id", orderId)
      .is("is_deleted", false)
      .order("created_at", { ascending: false })
      .returns<Order[]>();

    if (error) {
      Alert.alert(error.message);
    }
    setFilteredOrders(data || []);
  };

  // whenever screen focuses
  useFocusEffect(() => {
    if (
      searchOrderId === "" &&
      filterDateRange.startDate === null &&
      filterDateRange.endDate === null &&
      filterOrderStatusState === ""
    )
      setFilteredOrders(orders);
  });

  useEffect(() => {
    fetchOrders();
  }, [filterOrderStatusState, filterDateRange]);

  // Initial fetch and refresh logic
  useEffect(() => {
    // console.log("orders for store", store?.name, orders);
    if (
      filterDateRange.startDate &&
      filterDateRange.endDate &&
      searchOrderId === ""
    ) {
      fetchOrders();

      return;
    }
    if (orders.length === 0) {
      fetchOrders();
      return;
    }
    if (searchOrderId === "") setFilteredOrders(orders);
    else searchOrders();
  }, [store_id, searchOrderId, filterDateRange]);

  return (
    <Container>
      <Heading
        title={`${store?.name || "Store #" + store_id} Orders`}
        icon={<BackButton />}
      />
      <OrderList
        orders={filteredOrders}
        setOrders={setFilteredOrders}
        searchOrderId={searchOrderId}
        setSearchOrderId={setSearchOrderId}
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
        fetchOrders={fetchOrders}
        searchOrders={searchOrders}
        filterOrderStatusState={filterOrderStatusState}
        setFilterOrderStatusState={setFilterOrderStatusState}
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
