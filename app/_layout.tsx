import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
// import { Poppins, Sf_Pro_Text } from "next/font/google";
// import "./globals.css";


import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "600"],
//   variable: "--font-poppins",
// });
// const sFProText = Sf_Pro_Text({
//   subsets: ["latin"],
//   weight: ["600"],
//   variable: "--font-sf-pro-text",
// });
