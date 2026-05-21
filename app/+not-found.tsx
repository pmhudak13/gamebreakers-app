import { View, Text, TouchableOpacity } from 'react-native'
import { Link, Stack } from 'expo-router'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found', headerStyle: { backgroundColor: '#01003b' }, headerTintColor: '#ffffff' }} />
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-6xl font-bold text-[#01003b] mb-2">404</Text>
        <Text className="text-base text-[#a4a4a4] text-center mb-8">
          This screen doesn't exist.
        </Text>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity
            className="bg-[#01003b] px-8 py-3 rounded-xl"
            activeOpacity={0.85}
          >
            <Text className="text-white font-semibold text-base">Go Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  )
}
