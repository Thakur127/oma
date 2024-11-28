import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, useColorScheme } from "react-native";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={styles.button}
      className={`${className}`}
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={24} color="#14b8a6" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8, // Adjust padding as needed
    borderRadius: 16, // Half of a typical button height for full rounding
    alignSelf: "flex-start", // Ensure it wraps to content width
  },
});
