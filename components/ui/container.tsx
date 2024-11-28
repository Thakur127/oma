import * as React from "react";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

export const Container = React.forwardRef<SafeAreaView, SafeAreaViewProps>(
  ({ children, className }, ref) => {
    return (
      <SafeAreaView
        className={`${className} flex-1 p-4 bg-gray-50 dark:bg-black`}
        ref={ref}
      >
        {children}
      </SafeAreaView>
    );
  }
);

Container.displayName = "Container";
