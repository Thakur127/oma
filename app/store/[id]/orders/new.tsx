import BackButton from "@/components/BackButton";
import CategoryCard from "@/components/CategoryCard";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { getSupabaseClient } from "@/lib/db/supabase";

import {
  inventoryState,
  selectedStoreInventory,
} from "@/recoil-state/inventory.state";
import { ordersState } from "@/recoil-state/orders.state";
import { selectedStore } from "@/recoil-state/stores.state";
import { Category } from "@/types/inventory";
import { Order } from "@/types/order";

import { Redirect, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
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
      console.log(error);
      Alert.alert(error.message);
    }
    console.log("NEW ORDER MENU", data);
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
        o_store_id: store_id,
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
                        className="flex-row items-center justify-between my-2 px-4"
                      >
                        <Text className="font-normal text-lg dark:text-gray-200">
                          {item.name}
                          (₹ {item.price})
                        </Text>

                        <View className="flex-row items-center gap-2   shrink-1">
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
      <View
        className="flex-row items-center justify-between bg-white  dark:bg-gray-800 p-4  mx-0 absolute bottom-0"
        style={{
          width: "100%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <TouchableOpacity
              className={`p-4 bg-teal-500 rounded-lg max-w-32 disabled:opacity-50 disabled:cursor-not-allowed`}
              onPress={placeOrder}
              disabled={Number(orderTotal) === 0 || isPlacingOrder}
            >
              <Text className="text-gray-100 dark:text-gray-800 font-semibold text-lg">
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold text-xl text-gray-800 dark:text-gray-100">
              ₹ {orderTotal}
            </Text>
            <IconButton name="chevron-up" size={24} />
          </View>
        </View>
      </View>
    </>
  );
}
