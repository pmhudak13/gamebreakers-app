import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function BibleScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        {/* Verse of the Day */}
        <View className="bg-[#01003b] rounded-2xl p-6 mb-6">
          <Text className="text-xs uppercase tracking-widest text-[#a4a4a4] mb-2">Verse of the Day</Text>
          <Text className="text-white text-base font-medium leading-relaxed">
            &ldquo;I can do all things through Christ who strengthens me.&rdquo;
          </Text>
          <Text className="text-[#a4a4a4] text-xs mt-2">Philippians 4:13</Text>
        </View>

        {/* Coming Soon */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
          <View className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center mb-3">
            <Ionicons name="book-outline" size={28} color="#a4a4a4" />
          </View>
          <Text className="font-semibold text-[#01003b] text-base mb-1">Bible Reader Coming Soon</Text>
          <Text className="text-xs text-[#a4a4a4] text-center">
            Full scripture search and reading experience launching in Phase 03.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
