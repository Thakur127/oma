import React, { useEffect, useRef, useState } from "react";

import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import OrderCard from "@/components/OrderCard";

import { useRefreshState } from "@/hooks/useRefreshState";

import { Order } from "@/types/order";

import { IconButton } from "@/components/ui/icon-button";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import DateTimeFilter from "@/components/DateTImeFilter";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface OrderListProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  searchOrderId: string;
  setSearchOrderId: React.Dispatch<React.SetStateAction<string>>;
  filterDateRange: DateRange;
  setFilterDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  filterOrderStatusState: string;
  setFilterOrderStatusState: React.Dispatch<React.SetStateAction<string>>;

  fetchOrders: () => void;
  searchOrders: () => void;
}

function OrderList({
  orders,
  searchOrderId,
  setSearchOrderId,
  filterDateRange,
  setFilterDateRange,
  fetchOrders,
  filterOrderStatusState,
  setFilterOrderStatusState,
}: OrderListProps) {
  const [tempSearchOrderId, setTempSearchOrderId] = useState(searchOrderId);
  const filterbsref = useRef<BottomSheet>(null); // bottomsheet ref
  const [filterOrderStatus, setFilterOrderStatus] = useState([
    {
      label: "Pending",
      value: "pending",
      icon: "hourglass-outline",
      active: false,
    },
    {
      label: "Fullfilled",
      value: "fulfilled",
      icon: "checkmark-circle",
      active: false,
    },
  ]);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchOrderId(tempSearchOrderId.trim());
    }, 500); // 0.5 sec delay

    return () => {
      clearTimeout(handler);
    };
  }, [tempSearchOrderId]);

  const { refresh, handleRefresh } = useRefreshState(fetchOrders);

  const handleOrderStatusSelection = (statusValue: string) => {
    setFilterOrderStatus((prev) =>
      prev.map((status) => ({
        ...status,
        active: status.value === statusValue ? !status.active : false,
      }))
    );

    // Update the active filter state
    setFilterOrderStatusState((prev) =>
      prev === statusValue ? "" : statusValue
    );
  };

  // close bottomsheet on changing tab
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      filterbsref.current?.close();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Order }) => (
    <OrderCard key={item.id} item={item} />
  );

  return (
    <>
      {/* Search Bar */}
      <View className="mb-4 flex-row items-center justify-between gap-1">
        <TextInput
          value={tempSearchOrderId}
          onChangeText={(text) => setTempSearchOrderId(text)}
          placeholder="Search orders..."
          placeholderTextColor="#9CA3AF"
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full p-4 shadow-md flex-grow"
        />
        <IconButton
          name={"filter-outline"}
          size={24}
          color={"black"}
          onPress={() => filterbsref.current?.snapToIndex(2)}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Orders List */}
      <FlatList
        className="mb-2"
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={15} // Render only 15 items initially
        maxToRenderPerBatch={10} // Render 10 items per batch
        windowSize={5} // Adjust the size of the rendering window
        ListEmptyComponent={() => (
          <View className="items-center justify-center h-80">
            <Text className="text-gray-600 dark:text-gray-300 text-2xl font-semibold">
              No order found
            </Text>
            <Text className="mt-4 text-gray-400">Pull down to refresh</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet
        ref={filterbsref}
        index={-1}
        snapPoints={["25%", "50%", "90%"]}
        enablePanDownToClose={true}
      >
        <BottomSheetView className="p-4 bg-gray-50 dark:bg-gray-800 h-full">
          <Text className="text-gray-800 dark:text-gray-200 font-semibold text-xl mb-4">
            Filters
          </Text>
          <View className="mb-4">
            <Text className="font-normal text-lg text-gray-700 dark:text-gray-300 mb-3">
              Date
            </Text>
            <View>
              <DateTimeFilter
                state={filterDateRange}
                setState={setFilterDateRange}
              />
            </View>
          </View>
          <View>
            <Text className="font-normal text-lg text-gray-700 dark:text-gray-300 mb-3">
              Order Status
            </Text>
            <View className="flex-row items-center flex-wrap">
              {filterOrderStatus.map((status, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleOrderStatusSelection(status.value)}
                  className={`p-2 flex-row gap-1 items-center rounded-lg border ${
                    status.active
                      ? "bg-teal-500 text-white border-teal-500"
                      : "border-gray-700 dark:border-gray-200"
                  } mr-2 mb-2`}
                >
                  <Ionicons
                    name={status.icon as any}
                    size={24}
                    color={
                      status.active
                        ? "#fff"
                        : colorScheme === "dark"
                        ? "#e5e7eb"
                        : "#374151"
                    }
                  />
                  <Text
                    className={`${
                      status.active
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

export default React.memo(OrderList);
