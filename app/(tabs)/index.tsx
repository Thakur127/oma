import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { useRefreshState } from "@/hooks/useRefreshState";
import { getSupabaseClient } from "@/lib/db/supabase";

import { greet } from "@/lib/utils";
import { storesState } from "@/recoil-state/stores.state";
import { Store } from "@/types/store";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRecoilState } from "recoil";

export default function IndexTab() {
  // const [stores, setStores] = useState<Store[]>([]);
  const [stores, setStores] = useRecoilState<Store[]>(storesState);

  const fetchStores = async (signal: AbortSignal | null = null) => {
    const supabase = await getSupabaseClient();
    const query = supabase
      .from("stores")
      .select()
      .is("is_active", true)
      .is("is_deleted", false);
    if (signal) query.abortSignal(signal);

    const { data, error } = await query.returns<Store[]>();
    if (error) {
      if (error.message !== "AbortError: Aborted") Alert.alert(error.message);
    }
    setStores(data || []);
  };

  useEffect(() => {
    const controller = new AbortController();

    if (stores.length === 0) fetchStores(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const { refresh, handleRefresh } = useRefreshState(fetchStores);

  return (
    <Container>
      <Heading title={greet()} className="mb-8" />
      {/* <Heading title="Stores" icon={<Text className="text-3xl">🛒</Text>} /> */}
      <View className="">
        <FlatList
          className="h-full"
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <Card
                key={item.id}
                className={`relative mb-4 ${refresh && "opacity-50"}`}
              >
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/store/${item.id}`);
                  }}
                >
                  <CardContent className="flex-row ">
                    <Image
                      source={{ uri: item.image_url }}
                      style={{ width: 80, height: 80 }}
                      alt={item.name}
                      className="bg-neutral-300 dark:bg-gray-400"
                    />

                    <CardHeader className="max-w-fit pt-3">
                      <CardTitle className="mb-1">{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </CardContent>
                </TouchableOpacity>
              </Card>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={handleRefresh}
              colors={["grey"]}
              progressBackgroundColor={"black"}
            />
          }
          ListEmptyComponent={() => {
            return (
              <View className="items-center justify-center h-80">
                <Text className="text-gray-600 dark:text-gray-300 text-2xl font-semibold">
                  No store found
                </Text>

                <Text className="mt-4 text-gray-400">Pull down to refresh</Text>
              </View>
            );
          }}
        />
      </View>
    </Container>
  );
}
