import * as React from "react";
import { View, ViewProps } from "react-native";

export const Sheet = React.forwardRef<View, ViewProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={`${className} rounded-xl shadown-md bg-white dark:bg-gray-800 max-w-fit overflow-hidden`}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Sheet.displayName = "Sheet";

export const SheetContent = React.forwardRef<View, ViewProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View className={`${className} max-w-fit `} ref={ref} {...props}>
        {children}
      </View>
    );
  }
);

SheetContent.displayName = "SheetContent";

export const SheetTrigger = React.forwardRef<View, ViewProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View className={`${className} max-w-fit `} ref={ref} {...props}>
        {children}
      </View>
    );
  }
);
