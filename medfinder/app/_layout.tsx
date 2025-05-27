import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} /> {}
        <Stack.Screen name="auth/register" options={{ headerShown: false }} /> {}
        <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} /> {}
        <Stack.Screen name="home" options={{ headerShown: false }} /> {}
        <Stack.Screen name="search" options={{ headerShown: false }} /> {}
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} /> {}
        <Stack.Screen name="help" options={{ headerShown: false }} /> {}
        <Stack.Screen name="pending" options={{ headerShown: false }} /> {}
        <Stack.Screen name="results" options={{ headerShown: false }} /> {}
        <Stack.Screen name="scheduleUser" options={{ headerShown: false }} /> {}
        <Stack.Screen name="selectTime" options={{ headerShown: false }} /> {}
        <Stack.Screen name="pending-profissional" options={{ headerShown: false }} /> {}
        <Stack.Screen name="home-profissional" options={{ headerShown: false }} /> {}
        <Stack.Screen name="history" options={{ headerShown: false }} /> {}
        <Stack.Screen name="setAvailability" options={{ headerShown: false }} /> {}
        <Stack.Screen name="auth/admin-dashboard" options={{ headerShown: false }} /> {}
        <Stack.Screen name="admin/register-professional" options={{ headerShown: false }} /> {}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
