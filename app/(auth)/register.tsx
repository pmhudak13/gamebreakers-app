import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function RegisterScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister() {
    if (!email || !password || !confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#01003b]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-8 py-12">
          <View className="items-center mb-10">
            <Text className="text-white text-4xl font-bold">GBA</Text>
            <Text className="text-[#a4a4a4] text-base mt-1">Join the Academy</Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-[#01003b] text-2xl font-bold mb-6">Create Account</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-3 text-base"
              placeholderTextColor="#a4a4a4"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password (min 6 characters)"
              secureTextEntry
              className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-3 text-base"
              placeholderTextColor="#a4a4a4"
            />
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm Password"
              secureTextEntry
              className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-5 text-base"
              placeholderTextColor="#a4a4a4"
            />

            {error ? <Text className="text-red-500 text-sm mb-3">{error}</Text> : null}

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-[#01003b] rounded-xl py-4 items-center"
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base">Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} className="mt-4 items-center">
              <Text className="text-[#a4a4a4] text-sm">
                {'Already have an account? '}
                <Text className="text-[#01003b] font-semibold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
