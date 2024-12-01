import * as React from "react";
import { View, ViewProps } from "react-native";

export const Skeleton = React.forwardRef<View, ViewProps>(
  ({ children, className }, ref) => {
    return (
      <View ref={ref} className={`animate-pulse ${className}`}>
        {children}
      </View>
    );
  }
);
