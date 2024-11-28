import * as React from "react";
import { Text, View, ViewProps } from "react-native";

interface HeadingProps extends ViewProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Heading = React.forwardRef<View, HeadingProps>(
  ({ title, icon, className, titleClassName, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={`${className} flex-row items-center gap-2 mb-4 flex-wrap`}
        {...props}
      >
        {icon}
        <Text
          className={`${titleClassName} text-teal-500 text-3xl font-bold capitalize text-wrap`}
        >
          {title}
        </Text>
      </View>
    );
  }
);
