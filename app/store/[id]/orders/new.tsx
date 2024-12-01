import BackButton from "@/components/BackButton";
import CategoryCard from "@/components/CategoryCard";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { Separator } from "@/components/ui/separator";
import { getSupabaseClient } from "@/lib/db/supabase";

import {
  inventoryState,
  selectedStoreInventory,
} from "@/recoil-state/inventory.state";
import { ordersState } from "@/recoil-state/orders.state";
import { selectedStore } from "@/recoil-state/stores.state";
import { Category } from "@/types/inventory";
import { Order } from "@/types/order";

import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Animated, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { FlatList } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface OrderItem {
  item_id: number;
  quantity: number;
}

export default function NewOrder() {
  const { id: store_id } = useLocalSearchParams();
  const store = useRecoilValue(selectedStore(Number(store_id)));

  const categories = useRecoilValue(selectedStoreInventory(Number(store_id)));
  const setCategories = useSetRecoilState(inventoryState);
  const setOrders = useSetRecoilState(ordersState);

  const [order, setOrder] = useState<OrderItem[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const [isOrderSummaryVisible, setIsOrderSummaryVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current; // Animation value for the slide

  const fetchCategories = React.useCallback(async () => {
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
      // console.log(error);
      Alert.alert(error.message);
    }
    // console.log("NEW ORDER MENU", data);
    setCategories(data || []);
  }, [store_id]);

  useEffect(() => {
    if (store_id && categories && categories.length === 0) fetchCategories();
  }, [store_id, fetchCategories]);

  const handleOrder = (item: any, action: "add" | "remove") => {
    setOrder((prevOrder) => {
      const _item = prevOrder.find((o) => o.item_id === item.id);
      switch (action) {
        case "add":
          setOrderTotal((orderTotal) =>
            Number((orderTotal + item.price).toFixed(2))
          );

          // it item exists in order, increment quantity
          if (_item) {
            return prevOrder.map((o) => {
              if (o.item_id === item.id)
                return { item_id: item.id, quantity: o.quantity + 1 };
              return o;
            });
          }

          return [...prevOrder, { item_id: item.id, quantity: 1 }];

        case "remove":
          // if item exists in order and gt(>) 0, decrement quantity
          if (_item && _item.quantity > 0) {
            setOrderTotal((orderTotal) =>
              Number((orderTotal - item.price).toFixed(2))
            );
            return prevOrder.map((o) => {
              if (o.item_id === item.id)
                return { item_id: item.id, quantity: o.quantity - 1 };
              return o;
            });
          }

          return prevOrder.filter((o) => o.item_id !== item.id);

        default:
          return prevOrder;
      }
    });
  };

  const placeOrder = async () => {
    setIsPlacingOrder(true);
    const supabase = await getSupabaseClient();

    // filter out orders with quantity 0
    const filteredOrder = order.filter((o) => o.quantity > 0);

    // this call the postgres function which creates the order
    // and items for the order atomically
    let { data: newOrder, error } = await supabase
      .rpc("create_order", {
        o_items: filteredOrder,
        o_status: "pending",
        o_store_id: Number(store_id),
      })
      .returns<Order>()
      .single();
    if (error) {
      console.error(error);
      Alert.alert(error.message);
      setIsPlacingOrder(false);
      return;
    }

    // add order to global state
    setOrders((prev) => {
      return [
        {
          id: (newOrder as any)?.id,
          status: (newOrder as any)?.status,
          created_at: (newOrder as any)?.created_at,
          store_id: Number(store_id),
          total: (newOrder as any)?.total,
        },
        ...prev,
      ];
    });

    setIsPlacingOrder(false);
    // redirect to orders page
    // router.push(`/store/${store_id}/orders`);
    router.back();
  };

  const toggleOrderSummary = () => {
    if (isOrderSummaryVisible) {
      // Slide Down Animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOrderSummaryVisible(false));
    } else {
      setIsOrderSummaryVisible(true);
      // Slide Up Animation
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => {
    const orderItem = categories
      .flatMap((category) => category.items)
      .find((i) => i.id === item.item_id);

    return (
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-lg text-gray-800 dark:text-gray-200">
          {orderItem?.name}
        </Text>
        <Text className="text-lg text-gray-600 dark:text-gray-400">
          {item.quantity} x ₹ {orderItem?.price}
        </Text>
        <Text className="text-lg text-gray-800 dark:text-gray-200">
          ₹ {(item.quantity * (orderItem?.price || 0)).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Container>
        <Heading title={`${store?.name} New Order`} icon={<BackButton />} />
        <View>
          <FlatList
            className="mb-32"
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: category }) => {
              return (
                <CategoryCard
                  category={category}
                  categoryItemComponentHeight={60}
                  CategoryItemComponent={({ item }) => {
                    return (
                      <View
                        key={item.id}
                        className="flex-row items-center justify-between my-2 px-2"
                      >
                        <Text className="font-normal text-lg dark:text-gray-200 truncate max-w-[75%]">
                          {item.name}
                          (₹ {item.price})
                        </Text>

                        <View className="flex-row items-center gap-2">
                          <IconButton
                            name="remove"
                            className="bg-teal-500 disabled:opacity-50"
                            onPress={() => {
                              handleOrder(item, "remove");
                            }}
                            disabled={isPlacingOrder}
                          />
                          <Text className="text-xl font-medium text-gray-800 dark:text-gray-200">
                            {order.find((o) => o.item_id === item.id)
                              ?.quantity || 0}
                          </Text>
                          <IconButton
                            name={"add"}
                            className="bg-teal-500 disabled:opacity-50"
                            onPress={() => {
                              handleOrder(item, "add");
                            }}
                            disabled={isPlacingOrder}
                          />
                        </View>
                      </View>
                    );
                  }}
                />
              );
            }}
          />
        </View>
      </Container>
      {/* Slide-Up Order Summary */}
      {isOrderSummaryVisible && (
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0], // Adjust slide height
                }),
              },
            ],
            position: "absolute",
            bottom: 75,
            width: "100%",
            // backgroundColor: "#1f2937", // Dark background
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
          className={"bg-white dark:bg-gray-800"}
        >
          <View className="mb-4">
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Order Summary
            </Text>
          </View>
          <Separator />
          <FlatList
            data={order}
            keyExtractor={(item) => item.item_id.toString()}
            renderItem={renderOrderItem}
          />
          <Separator />
          <View className="mt-4 px-4 flex-row justify-between">
            <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Total
            </Text>
            <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              ₹ {orderTotal}
            </Text>
          </View>
        </Animated.View>
      )}
      {/* Bottom Action Bar */}
      <View
        className="flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 mx-0 absolute bottom-0"
        style={{
          width: "100%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={toggleOrderSummary}
        >
          <Text className="font-semibold text-xl text-gray-800 dark:text-gray-100">
            ₹ {orderTotal}
          </Text>
          <IconButton
            name={isOrderSummaryVisible ? "chevron-down" : "chevron-up"}
            size={24}
            onPress={toggleOrderSummary}
            // Toggle the slide-up panel
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={`p-4 text-center bg-teal-500 rounded-lg ${
            Number(orderTotal) === 0 || isPlacingOrder ? "opacity-50" : ""
          }`}
          onPress={placeOrder}
          disabled={Number(orderTotal) === 0 || isPlacingOrder}
        >
          <Text className="text-gray-100 font-semibold text-lg">
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
