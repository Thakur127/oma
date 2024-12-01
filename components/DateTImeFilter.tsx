import { formatDateTime } from "@/lib/datetime";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { View } from "react-native";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateTimeFilterProps = {
  state: DateRange;
  setState: React.Dispatch<React.SetStateAction<DateRange>>;
};

export default function DateTimeFilter({
  state,
  setState,
}: DateTimeFilterProps) {
  const [dateRanges, setDateRanges] = useState([
    { label: "Today", value: "today", icon: "calendar-today", active: false },
    {
      label: "Yesterday",
      value: "yesterday",
      icon: "calendar-clock",
      active: false,
    },
    {
      label: "Last 7 Days",
      value: "last7days",
      icon: "calendar-week",
      active: false,
    },
    {
      label: "Last 30 Days",
      value: "last30days",
      icon: "calendar-month",
      active: false,
    },
    {
      label: "Custom Range",
      value: "custom",
      icon: "calendar-range",
      active: false,
    },
  ]);
  // DateTime Picker State
  const [showDateTimePicker, setShowDateTimePicker] = useState<{
    isStart: boolean;
    isVisible: boolean;
  }>({ isStart: true, isVisible: false });

  const colorScheme = useColorScheme();

  const onDateTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") {
      setShowDateTimePicker({ isStart: true, isVisible: false });
      return;
    }

    if (showDateTimePicker.isStart) {
      setState((prev) => ({
        ...prev,
        startDate: selectedDate || prev.startDate,
      }));
      setShowDateTimePicker({ isStart: false, isVisible: true });
    } else {
      setState((prev) => ({
        ...prev,
        endDate: selectedDate || prev.endDate,
      }));
      setShowDateTimePicker({ isStart: true, isVisible: false });
    }
  };

  const handleDateRangeSelection = (range: string) => {
    const now = new Date();

    // Check if the selected range is already active
    const isAlreadyActive = dateRanges.some(
      (item) => item.value === range && item.active
    );

    if (isAlreadyActive) {
      // Reset the state and deactivate all buttons
      setDateRanges((prev) =>
        prev.map((item) => ({
          ...item,
          active: false,
        }))
      );
      setState({ startDate: null, endDate: null }); // Reset the selected dates
      return;
    }

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Update the active state of the selected range
    setDateRanges((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.value === range,
      }))
    );

    switch (range) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "yesterday":
        startDate = new Date(now.setDate(now.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "last7days":
        startDate = new Date(now.setDate(now.getDate() - 7));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case "last30days":
        startDate = new Date(now.setDate(now.getDate() - 30));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case "custom":
        setShowDateTimePicker({ isStart: true, isVisible: true });
        return; // Do not update state directly for custom range
      default:
        break;
    }

    setState({ startDate, endDate });
  };

  return (
    <View>
      <Text className="mb-2 font-medium text-gray-800 dark:text-gray-200">
        {state.startDate && formatDateTime(state.startDate)} -{" "}
        {state.endDate && formatDateTime(state.endDate)}
      </Text>
      <View className="gap-2 flex-row flex-wrap">
        {dateRanges.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => handleDateRangeSelection(item.value)}
            className={`p-2 flex-row gap-1 items-center rounded-lg border ${
              item.active
                ? "bg-teal-500 text-white border-teal-500"
                : "border-gray-700 dark:border-gray-200"
            } mr-2 mb-2`}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={24}
              color={
                item.active
                  ? "#fff"
                  : colorScheme === "dark"
                  ? "#e5e7eb"
                  : "#374151"
              }
              className=""
            />
            <Text
              className={`${
                item.active ? "text-white" : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* DateTime Picker */}
      {showDateTimePicker.isVisible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateTimeChange}
        />
      )}
    </View>
  );
}
