import React, { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";

import { Alert } from "react-native";

import { Container } from "@/components/ui/container";

import { getSupabaseClient } from "@/lib/db/supabase";

import { ordersState } from "@/recoil-state/orders.state";
import { Order } from "@/types/order";
import { useRecoilState } from "recoil";

import OrderList from "@/components/OrderList";
import { Heading } from "@/components/ui/heading";

export default function RecentOrdersTab() {
  const [orders, setOrders] = useRecoilState(ordersState);
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

  const fetchOrders = React.useCallback(async () => {
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
      console.error(error);
      Alert.alert(error.message);
    }

    setFilteredOrders(data || []);
    setOrders(data || []);
  }, [filterDateRange, filterOrderStatusState]);

  const searchOrders = React.useCallback(async () => {
    const supabase = await getSupabaseClient();

    // if searchOrderId is not numeric set it 0
    let orderId = searchOrderId;
    if (!/^\d+$/.test(orderId)) orderId = "0";

    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at, store_id")
      .eq("id", orderId)
      .is("is_deleted", false)
      .returns<Order[]>();

    if (error) {
      Alert.alert(error.message);
    }
    setFilteredOrders(data || []);
  }, [searchOrderId]);

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
  }, [searchOrderId, filterDateRange]);

  return (
    <Container>
      <Heading title="Recent Orders" />
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
    </Container>
  );
}
