import '../global.css'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../context/auth'

function RootRedirect() {
  const { session, profile, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (loading) return

    const inAuth = segments[0] === '(auth)'
    const inSetup = segments[0] === 'profile-setup'

    if (!session) {
      if (!inAuth) router.replace('/(auth)/login')
    } else if (!profile) {
      if (!inSetup) router.replace('/profile-setup')
    } else {
      if (inAuth || inSetup) router.replace('/(tabs)')
    }
  }, [session, profile, loading, segments])

  return null
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#01003b" />
      <RootRedirect />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  )
}
