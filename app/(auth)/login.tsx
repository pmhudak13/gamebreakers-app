import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#01003b]"
    >
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-10">
          <Text className="text-white text-4xl font-bold">GBA</Text>
          <Text className="text-[#a4a4a4] text-base mt-1">Faith. Fitness. Future.</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <Text className="text-[#01003b] text-2xl font-bold mb-6">Sign In</Text>

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
            placeholder="Password"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-2 text-base"
            placeholderTextColor="#a4a4a4"
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            className="mb-5 self-end"
          >
            <Text className="text-[#a4a4a4] text-sm">Forgot password?</Text>
          </TouchableOpacity>

          {error ? <Text className="text-red-500 text-sm mb-3">{error}</Text> : null}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-[#01003b] rounded-xl py-4 items-center"
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="mt-4 items-center"
          >
            <Text className="text-[#a4a4a4] text-sm">
              {"Don't have an account? "}
              <Text className="text-[#01003b] font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
