import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" />
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="Discover" />
    </Stack>
  );
}
