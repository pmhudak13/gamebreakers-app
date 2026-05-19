import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/auth'

const ROLES = ['student', 'tutor', 'coach'] as const
type Role = (typeof ROLES)[number]

export default function ProfileSetupScreen() {
  const { user, refreshProfile } = useAuth()
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [sport, setSport] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) {
      setError('Your name is required.')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.from('profiles').insert({
      id: user!.id,
      name: name.trim(),
      school: school.trim() || null,
      sport: sport.trim() || null,
      role,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    await refreshProfile()
    setLoading(false)
  }

  return (
    <ScrollView
      className="flex-1 bg-[#01003b]"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-8 py-12">
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold">Almost there!</Text>
          <Text className="text-[#a4a4a4] text-base mt-1 text-center">
            Tell us a little about yourself.
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <Text className="text-[#01003b] text-2xl font-bold mb-6">Your Profile</Text>

          <Text className="text-[#01003b] text-sm font-semibold mb-1">Full Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Marcus Williams"
            className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-4 text-base"
            placeholderTextColor="#a4a4a4"
          />

          <Text className="text-[#01003b] text-sm font-semibold mb-1">School</Text>
          <TextInput
            value={school}
            onChangeText={setSchool}
            placeholder="e.g. Warren High School"
            className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-4 text-base"
            placeholderTextColor="#a4a4a4"
          />

          <Text className="text-[#01003b] text-sm font-semibold mb-1">Sport</Text>
          <TextInput
            value={sport}
            onChangeText={setSport}
            placeholder="e.g. Football"
            className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-4 text-base"
            placeholderTextColor="#a4a4a4"
          />

          <Text className="text-[#01003b] text-sm font-semibold mb-2">I am a...</Text>
          <View className="flex-row mb-5" style={{ gap: 8 }}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                style={{ flex: 1 }}
                className={`py-3 rounded-xl items-center ${
                  role === r ? 'bg-[#01003b]' : 'bg-gray-100'
                }`}
                activeOpacity={0.85}
              >
                <Text
                  className={`text-sm font-semibold capitalize ${
                    role === r ? 'text-white' : 'text-[#a4a4a4]'
                  }`}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text className="text-red-500 text-sm mb-3">{error}</Text> : null}

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-[#01003b] rounded-xl py-4 items-center"
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">{"Let's Go!"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
