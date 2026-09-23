import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitle: 'Setup Profile' }}>
      <Stack.Screen name="step1-profile" options={{ title: 'Basics' }} />
      <Stack.Screen name="step2-photos" options={{ title: 'Photos' }} />
      <Stack.Screen name="step3-college" options={{ title: 'College' }} />
      <Stack.Screen name="step4-places" options={{ title: 'Hometown' }} />
      <Stack.Screen name="step5-attributes" options={{ title: 'More about you' }} />
    </Stack>
  );
}
