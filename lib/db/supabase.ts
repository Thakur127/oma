import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Alert } from "react-native";

let supabase: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = async () => {
  // Fetch stored keys from AsyncStorage
  const supabaseUrl = (await AsyncStorage.getItem("dbUrl")) || "";
  const supabaseAnonKey = (await AsyncStorage.getItem("anonKey")) || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials not found in AsyncStorage");
    Alert.alert("Error", "Supabase credentials not found in AsyncStorage");
  }

  // Ensure the Supabase client is initialized only once
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {},
    });
  }

  return supabase;
};
