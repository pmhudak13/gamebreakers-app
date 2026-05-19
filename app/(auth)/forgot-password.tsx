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

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset() {
    if (!email) {
      setError('Please enter your email.')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#01003b]"
    >
      <View className="flex-1 justify-center px-8">
        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-[#a4a4a4] text-sm">← Back to Sign In</Text>
          </TouchableOpacity>

          <Text className="text-[#01003b] text-2xl font-bold mb-2">Reset Password</Text>
          <Text className="text-[#a4a4a4] text-sm mb-6">
            {"Enter your email and we'll send you a reset link."}
          </Text>

          {sent ? (
            <View className="items-center py-6">
              <Text className="text-[#01003b] font-semibold text-base text-center">
                {"Check your inbox!\nA reset link is on its way."}
              </Text>
            </View>
          ) : (
            <>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-gray-100 rounded-xl px-4 py-3 text-[#01003b] mb-4 text-base"
                placeholderTextColor="#a4a4a4"
              />

              {error ? <Text className="text-red-500 text-sm mb-3">{error}</Text> : null}

              <TouchableOpacity
                onPress={handleReset}
                disabled={loading}
                className="bg-[#01003b] rounded-xl py-4 items-center"
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-bold text-base">Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
