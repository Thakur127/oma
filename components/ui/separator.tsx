import * as React from "react";
import { View, ViewProps } from "react-native";

export const Separator = React.forwardRef<View, ViewProps>(
  ({ className }, ref) => {
    return (
      <View
        ref={ref}
        className={`${className} h-px bg-gray-200 dark:bg-gray-700`}
      />
    );
  }
);

Separator.displayName = "Separator";
