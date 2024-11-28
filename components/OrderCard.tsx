import { Link, router } from "expo-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatISTDateTime } from "@/lib/datetime";
import { Order } from "@/types/order";

export default function OrderCard({ item }: { item: Order }) {
  return (
    <Card className="mb-4 shadow-lg rounded-xl relative">
      <TouchableOpacity
        onPress={() => {
          router.push(`/order/${item.id}`);
        }}
      >
        <CardContent>
          <CardHeader className="flex-row items-center gap-4 justify-between">
            <View className="flex-row items-center gap-4">
              <View
                className={`p-4 rounded-full ${
                  item.status === "pending"
                    ? "bg-yellow-100 dark:bg-yellow-800"
                    : "bg-green-100 dark:bg-green-800"
                }`}
              >
                <Ionicons
                  name={
                    item.status === "pending"
                      ? "hourglass-outline"
                      : "checkmark-circle-outline"
                  }
                  size={24}
                  color={item.status === "pending" ? "#FBBF24" : "#10B981"}
                />
              </View>
              <View>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                  Order #{item.id}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Status:{" "}
                  <Text
                    className={`font-semibold ${
                      item.status === "pending"
                        ? "text-yellow-600 dark:text-yellow-300"
                        : "text-green-600 dark:text-green-300"
                    }`}
                  >
                    {item.status}
                  </Text>
                </CardDescription>
                <CardDescription>
                  {formatISTDateTime(item.created_at)}
                </CardDescription>
              </View>
            </View>
            <View>
              <Text className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                ₹{item.total.toFixed(2)}
              </Text>
            </View>
          </CardHeader>
        </CardContent>
      </TouchableOpacity>
    </Card>
  );
}
