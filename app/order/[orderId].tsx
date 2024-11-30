import BackButton from "@/components/BackButton";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

import { Order, OrderItem } from "@/types/order";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Separator } from "@/components/ui/separator";
import { formatISTDateTime } from "@/lib/datetime";
import { useSetRecoilState } from "recoil";
import { ordersState } from "@/recoil-state/orders.state";
import { getSupabaseClient } from "@/lib/db/supabase";

export default function OrdersIdScreen() {
  const { orderId: order_id } = useLocalSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const setOrders = useSetRecoilState(ordersState);
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
        id,
        status,
        created_at,
        items:order_items(
          item_id,
          quantity,
          item:items(
            id,
            name,
            price
          )
        )
        `
        )
        .eq("id", order_id) // Filter by order ID
        .is("is_deleted", false)
        .returns<Order>()
        .single(); // Fetch only one order
      if (error) console.log(error);
      // console.log(data);
      data &&
        (data as Order).items &&
        setOrderTotal(
          (data as any)?.items.reduce(
            (total: any, item: OrderItem) =>
              total + item.quantity * item.item.price,
            0
          )
        );
      setOrder(data);
    };
    fetchOrders();
  }, [order_id]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: (
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color="#f59e0b"
            />
          ),
          color: "text-yellow-600 bg-yellow-100",
        };
      case "fulfilled":
        return {
          icon: (
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#10b981"
            />
          ),
          color: "text-green-600 bg-green-100",
        };
      default:
        return {
          icon: (
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color="#ef4444"
            />
          ),
          color: "text-red-600 bg-red-100",
        };
    }
  };

  const handleMarkAsFulfilled = async () => {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: "fulfilled" })
      .eq("id", order_id);

    if (error) {
      Alert.alert("Error", "Failed to update order status. Please try again.");
      console.error(error);
    } else {
      setOrder((prev) => (prev ? { ...prev, status: "fulfilled" } : null));
      Alert.alert("Success", "Order status updated to 'fulfilled'.");

      // update order state in global state
      setOrders((prev) => {
        return prev.map((order) => {
          if (order.id === Number(order_id)) {
            return { ...order, status: "fulfilled" };
          }
          return order;
        });
      });
    }
  };

  return (
    <Container>
      <Heading title={`Order #${order_id}`} icon={<BackButton />} />
      <View className="flex-1">
        {order ? (
          <ScrollView className="rounded-xl">
            <Card className="m-4 shadow-lg">
              <CardContent>
                <CardHeader className="flex-row items-center justify-between">
                  <View>
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                      Order - #{order_id}
                    </CardTitle>
                    <CardDescription>
                      {formatISTDateTime(order.created_at)}
                    </CardDescription>
                  </View>

                  <View
                    className={`flex-row items-center px-3 py-1 rounded-full ${
                      getStatusStyle(order.status).color
                    }`}
                  >
                    {getStatusStyle(order.status).icon}
                    <Text className="ml-2 font-medium capitalize">
                      {order.status}
                    </Text>
                  </View>
                </CardHeader>
                <Separator />
                <CardBody>
                  {order.items?.map((item: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <View
                        key={idx}
                        className="flex-row items-center justify-between py-2"
                      >
                        <Text className="text-lg text-gray-700 dark:text-gray-200">
                          {item.item.name} x {item.quantity}
                        </Text>
                        <Text className="text-lg  text-gray-700 dark:text-gray-200">
                          ₹ {item.item.price} x {item.quantity} ={" "}
                          <Text className="font-medium">
                            ₹ {(item.item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Text>
                      </View>
                    </React.Fragment>
                  ))}
                </CardBody>
                <Separator />
                <CardFooter>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold dark:text-gray-100">
                      Total
                    </Text>
                    <Text className="text-lg font-semibold dark:text-gray-100">
                      ₹ {orderTotal.toFixed(2)}
                    </Text>
                  </View>
                  {order.status === "pending" && (
                    <TouchableOpacity
                      onPress={handleMarkAsFulfilled}
                      style={styles.button}
                    >
                      <Ionicons
                        name="checkmark-done-outline"
                        size={20}
                        color="white"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.buttonText}>Mark as Fulfilled</Text>
                    </TouchableOpacity>
                  )}
                </CardFooter>
              </CardContent>
            </Card>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-gray-500 ">
              Order not found
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
