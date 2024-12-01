import "abortcontroller-polyfill";
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

export default function OrdersHistoryTab() {
  const [orders, setOrders] = useRecoilState(ordersState);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchOrderId, setSearchOrderId] = useState<string>("");

  const controller = new AbortController();

  // Date Filter State
  const [filterDateRange, setFilterDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null, // greater date
    endDate: null, // smaller date
  });
  const [filterOrderStatusState, setFilterOrderStatusState] = useState("");

  const fetchOrders = React.useCallback(
    async (signal: AbortSignal | null = null) => {
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

      if (signal) query = query.abortSignal(signal);
      // Execute query
      const { data, error } = await query.returns<Order[]>();

      if (error) {
        console.error(error);
        if (error.message !== "AbortError: Aborted") Alert.alert(error.message);
      }

      setFilteredOrders(data || []);
      setOrders(data || []);
    },
    [filterDateRange, filterOrderStatusState]
  );

  const searchOrders = React.useCallback(
    async (signal: AbortSignal | null = null) => {
      const supabase = await getSupabaseClient();

      // if searchOrderId is not numeric don't send request
      if (!/^\d+$/.test(searchOrderId)) {
        setFilteredOrders([]);
        return;
      }

      let query = supabase
        .from("orders")
        .select("id, total, status, created_at, store_id")
        .eq("id", searchOrderId)
        .is("is_deleted", false);

      if (signal) query = query.abortSignal(signal);

      const { data, error } = await query.returns<Order[]>();

      if (error) {
        if (error.message !== "AbortError: Aborted") Alert.alert(error.message);
      }
      setFilteredOrders(data || []);
    },
    [searchOrderId]
  );

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
    fetchOrders(controller.signal);

    return () => {
      controller.abort();
    };
  }, [filterOrderStatusState, filterDateRange]);

  useEffect(() => {
    // console.log("orders for store", store?.name, orders);

    if (
      filterDateRange.startDate &&
      filterDateRange.endDate &&
      searchOrderId === ""
    ) {
      fetchOrders(controller.signal);
      return;
    }

    if (orders.length === 0) {
      fetchOrders(controller.signal);
      return;
    }
    if (searchOrderId === "") setFilteredOrders(orders);
    else searchOrders(controller.signal);

    return () => {
      controller.abort();
    };
  }, [searchOrderId, filterDateRange]);

  return (
    <Container>
      <Heading title="Orders History" />
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
