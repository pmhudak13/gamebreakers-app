import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const features: { href: string; icon: IconName; label: string; desc: string }[] = [
  { href: '/bible', icon: 'book-outline', label: 'Bible', desc: 'Read scripture daily' },
  { href: '/devotionals', icon: 'heart-outline', label: 'Devotionals', desc: 'Daily & weekly faith' },
  { href: '/workouts', icon: 'barbell-outline', label: 'Workouts', desc: 'Train like a champion' },
  { href: '/prayer', icon: 'hand-left-outline', label: 'Prayer', desc: 'Submit & support prayers' },
  { href: '/resources', icon: 'grid-outline', label: 'Resources', desc: 'Tools for your future' },
  { href: '/connect', icon: 'people-outline', label: 'Connect', desc: 'Find a tutor today' },
]

export default function HomeScreen() {
  const router = useRouter()

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero */}
      <View className="px-4 pt-6 pb-4">
        <Text className="text-3xl font-bold text-[#01003b]">Welcome to{'\n'}Gamebreakers</Text>
        <Text className="text-base text-[#a4a4a4] mt-1 font-medium">Faith. Fitness. Future.</Text>
      </View>

      {/* Feature Grid */}
      <View className="px-4 pb-6 flex-row flex-wrap gap-3">
        {features.map(({ href, icon, label, desc }) => (
          <TouchableOpacity
            key={href}
            onPress={() => router.push(href as any)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            style={{ width: '47%' }}
            activeOpacity={0.85}
          >
            <View className="w-10 h-10 rounded-xl bg-[#01003b] items-center justify-center mb-3">
              <Ionicons name={icon} size={20} color="#ffffff" />
            </View>
            <Text className="font-semibold text-[#01003b] text-sm">{label}</Text>
            <Text className="text-xs text-[#a4a4a4] mt-0.5">{desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}
