import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function DevotionalsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
          <View className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center mb-3">
            <Ionicons name="heart-outline" size={28} color="#a4a4a4" />
          </View>
          <Text className="font-semibold text-[#01003b] text-base mb-1">Devotionals Coming Soon</Text>
          <Text className="text-xs text-[#a4a4a4] text-center">
            Daily and weekly devos crafted for young athletes — launching in Phase 03.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
