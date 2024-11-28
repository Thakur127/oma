import * as React from "react";
import { View, Text, ViewProps, TextProps } from "react-native";

// Define the props for the Card component
interface CardProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
}

// Use React.forwardRef with proper typing
export const Card = React.forwardRef<View, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={`${className} rounded-xl shadown-md bg-white dark:bg-gray-800 max-w-fit overflow-hidden`}
        style={{ elevation: 4, shadowOffset: { width: 0, height: 2 } }}
        {...props}
      >
        {children}
      </View>
    );
  }
);

export const CardContent = React.forwardRef<View, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View className={`${className} max-w-fit `} ref={ref} {...props}>
        {children}
      </View>
    );
  }
);

export const CardHeader = React.forwardRef<View, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View className={`${className} p-6`} ref={ref} {...props}>
        {children}
      </View>
    );
  }
);

export const CardBody = React.forwardRef<View, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View className={`${className} p-6 `} ref={ref} {...props}>
        {children}
      </View>
    );
  }
);

export const CardFooter = React.forwardRef<View, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View className={`${className} p-6 `} ref={ref} {...props}>
        {children}
      </View>
    );
  }
);

interface CardTitleProps extends TextProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardTitle = React.forwardRef<Text, CardTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Text
        className={`${className} dark:text-gray-100 text-2xl font-semibold`}
        ref={ref}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

export const CardDescription = React.forwardRef<Text, CardTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Text
        className={`${className} text-sm text-neutral-600 dark:text-neutral-400`}
        ref={ref}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
