import { Category, Product } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Image, Text, View, Animated } from "react-native";

import { useState, useRef } from "react";
import { IconButton } from "./ui/icon-button";

export default function CategoryCard({
  category,
  CategoryItemComponent,
  categoryItemComponentHeight = 50,
}: {
  category: Category;
  CategoryItemComponent: React.FC<{ item: Product }>;
  categoryItemComponentHeight?: number;
}) {
  // Maintain a separate animated value for each category
  const [showItems, setShowItems] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current; // Initial height is 0

  const toggleDropdown = () => {
    if (showItems) {
      // Collapse the category
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // `height` requires `useNativeDriver: false`
      }).start();
    } else {
      // Expand the category
      Animated.timing(animatedHeight, {
        toValue:
          category.items.length === 1
            ? categoryItemComponentHeight + 20
            : category.items.length * categoryItemComponentHeight, // Adjust the multiplier based on item height
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setShowItems(!showItems);
  };

  return (
    <Card key={category.id} className="mb-4">
      <CardContent>
        <View className="flex-row items-center justify-between pr-4">
          <View className="flex-row items-start gap-2">
            <Image
              source={{
                uri: category?.image_url || "https://example.com/image1.jpg",
              }}
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
          </View>
          <IconButton
            name={showItems ? "chevron-up" : "chevron-down"}
            onPress={toggleDropdown}
            className="p-4"
          />
        </View>

        {/* Animated Dropdown */}
        <Animated.View
          className={""}
          style={{
            height: animatedHeight, // Animate the height of each card independently
            overflow: "hidden",
          }}
        >
          {category.items.length > 0 ? (
            <View className="bg-gray-50 dark:bg-gray-900   p-4 flex-1">
              {category.items.map((item, idx) => (
                <CategoryItemComponent key={idx} item={item} />
              ))}
            </View>
          ) : (
            <View className="bg-gray-50 p-4 ">
              <Text className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {" "}
                No Item found
              </Text>
            </View>
          )}
        </Animated.View>
      </CardContent>
    </Card>
  );
}
