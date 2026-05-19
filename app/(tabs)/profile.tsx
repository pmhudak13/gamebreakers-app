import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/auth'

type IconName = React.ComponentProps<typeof Ionicons>['name']

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
      }}
    >
      <Ionicons name={icon} size={18} color="#a4a4a4" />
      <Text style={{ color: '#a4a4a4', fontSize: 13, marginLeft: 10, width: 60 }}>{label}</Text>
      <Text style={{ color: '#01003b', fontSize: 13, fontWeight: '500', flex: 1 }}>{value}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth()

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-[#01003b] px-6 pt-10 pb-12 items-center">
        <View
          className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
          }}
        >
          <Text className="text-[#01003b] text-2xl font-bold">{initials}</Text>
        </View>
        <Text className="text-white text-xl font-bold">
          {profile?.name ?? 'Student Athlete'}
        </Text>
        <Text className="text-[#a4a4a4] text-sm mt-0.5">{user?.email}</Text>
        {profile?.role ? (
          <View className="mt-2 bg-white/10 px-3 py-1 rounded-full">
            <Text className="text-white text-xs capitalize">{profile.role}</Text>
          </View>
        ) : null}
      </View>

      <View className="px-4 -mt-5">
        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
        >
          {profile?.school ? (
            <InfoRow icon="school-outline" label="School" value={profile.school} />
          ) : null}
          {profile?.sport ? (
            <InfoRow icon="football-outline" label="Sport" value={profile.sport} />
          ) : null}
          {user?.email ? (
            <InfoRow icon="mail-outline" label="Email" value={user.email} />
          ) : null}
        </View>

        <TouchableOpacity
          onPress={signOut}
          className="bg-white rounded-2xl p-4 flex-row items-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-red-500 font-semibold ml-3">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
