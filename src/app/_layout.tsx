import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';
import { useColorScheme } from 'react-native';

import { CurriculoProvider } from '@/context/CurriculoContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CurriculoProvider>
      <ThemeProvider
        value={
          colorScheme === 'dark'
            ? DarkTheme
            : DefaultTheme
        }
      >
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="criar-curriculo"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="experiencia"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="formacao"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="habilidades"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="revisar"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modelo"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="resultado"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="explore"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </CurriculoProvider>
  );
}