import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text, View, TouchableOpacity, TextInput } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

export default function SettingsTab() {
  const dbbsref = useRef<BottomSheet>(null); // db bottom sheet ref

  // State for inputs
  const [dbUrl, setDbUrl] = useState("");
  const [anonKey, setAnonKey] = useState("");

  // Function to open the BottomSheet
  const openBottomSheet = () => {
    dbbsref.current?.snapToIndex(0); // Opens the sheet to the first snap point
  };

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dbbsref.current?.close();
    });
    return unsubscribe;
  }, [navigation]);

  // Function to handle submission
  const handleSubmit = async () => {
    // Example submission logic
    console.log("Database URL:", dbUrl);
    console.log("Anon Key:", anonKey);

    await AsyncStorage.setItem("dbUrl", dbUrl);
    await AsyncStorage.setItem("anonKey", anonKey);

    setAnonKey("");
    setDbUrl("");

    // Close the BottomSheet after submission
    dbbsref.current?.close();
  };

  return (
    <Container>
      <Heading title="Settings" />
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
          Database
        </Text>
        <Card>
          <CardContent className="p-4">
            <TouchableOpacity onPress={openBottomSheet}>
              <View className="flex-row items-center gap-4">
                <View
                  className="p-4 rounded-full"
                  style={{ backgroundColor: "#4CAF50" + "33" }}
                >
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color={"#4CAF50"}
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  Manage Database Keys
                </Text>
              </View>
            </TouchableOpacity>
          </CardContent>
        </Card>
      </View>
      <BottomSheet
        ref={dbbsref}
        snapPoints={["50%", "75%"]}
        index={-1} // Initially closed
        enablePanDownToClose={true} // Allows closing by swiping down
      >
        <BottomSheetView className="p-4 bg-white dark:bg-gray-800">
          <Text className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            Manage Database Keys
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Update the database URL and anon key below.
          </Text>
          <View className="mb-4">
            <TextInput
              value={dbUrl}
              onChangeText={setDbUrl}
              placeholder="Database URL"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-md px-4 py-3 mb-4"
            />
            <TextInput
              value={anonKey}
              onChangeText={setAnonKey}
              placeholder="Anon Key"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-md px-4 py-3"
            />
          </View>
          <View className="flex-row gap-4 mt-4">
            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-green-500 px-6 py-3 rounded-md"
            >
              <Text className="text-white text-lg font-semibold">Submit</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                setDbUrl("");
                setAnonKey("");
                dbbsref.current?.close();
              }}
              className="bg-gray-500 px-6 py-3 rounded-md"
            >
              <Text className="text-white text-lg font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Container>
  );
}
