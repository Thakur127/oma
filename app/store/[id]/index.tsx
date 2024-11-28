import BackButton from "@/components/BackButton";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { selectedStore, storesState } from "@/recoil-state/stores.state";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilValue } from "recoil";

const paths = [
  {
    name: "Orders",
    icon: "receipt",
    iconColor: "#4CAF50", // Green for orders
    href: "/orders",
  },
  {
    name: "Inventory",
    icon: "grid",
    iconColor: "#FFC107", // Amber for categories
    href: "/inventory",
  },
];

export default function StoreScreen() {
  const { id } = useLocalSearchParams();
  const store = useRecoilValue(selectedStore(Number(id)));

  return (
    <Container>
      <Heading
        title={`${store?.name || "Store #" + id}`}
        icon={<BackButton />}
      />
      <View className="flex-1">
        <ScrollView className="flex-1">
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-4">
              {paths.map((path, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <TouchableOpacity
                      onPress={() => {
                        router.push(`/store/${id}${path.href}`);
                      }}
                    >
                      <View className={`relative flex-row items-center gap-4`}>
                        <View
                          className="p-4 rounded-full"
                          style={{ backgroundColor: path.iconColor + "33" }} // Light background
                        >
                          <Ionicons
                            name={path.icon as any}
                            size={24}
                            color={path.iconColor}
                          />
                        </View>
                        <Text className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                          {path.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {idx < paths.length - 1 && <Separator className="my-4" />}
                  </React.Fragment>
                );
              })}
            </CardContent>
          </Card>
        </ScrollView>
      </View>
    </Container>
  );
}
