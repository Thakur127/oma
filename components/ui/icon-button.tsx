import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IconButtonProps extends TouchableOpacityProps {
  className?: string;
  name: any;
  size?: number; // Allow optional size customization
  color?: string; // Allow optional color customization
}

export const IconButton = React.forwardRef<TouchableOpacity, IconButtonProps>(
  ({ className, name, size = 24, color = "black", ...rest }, ref) => {
    const colorScheme = useColorScheme();

    return (
      <TouchableOpacity
        className={`${className} p-1 rounded-md`}
        ref={ref}
        {...rest}
      >
        <Ionicons
          name={name}
          size={size}
          color={colorScheme === "dark" && color === "black" ? "white" : color}
        />
      </TouchableOpacity>
    );
  }
);
