import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/auth'
import {
  getAllTutorRequests,
  updateRequestStatus,
  getAllUsers,
  type AdminTutorRequest,
  type AdminUser,
} from '../lib/admin'
import type { RequestStatus } from '../lib/tutors'

type Section = 'requests' | 'users'
type RequestFilter = 'all' | RequestStatus

const STATUS_META: Record<RequestStatus, { label: string; bg: string; text: string }> = {
  pending:  { label: 'Pending',  bg: '#fef3c7', text: '#92400e' },
  accepted: { label: 'Accepted', bg: '#dcfce7', text: '#15803d' },
  declined: { label: 'Declined', bg: '#f3f4f6', text: '#6b7280' },
}

const ROLE_META: Record<string, { label: string; bg: string; text: string }> = {
  student: { label: 'Student', bg: '#e0f2fe', text: '#0369a1' },
  tutor:   { label: 'Tutor',   bg: '#ede9fe', text: '#6d28d9' },
  coach:   { label: 'Coach',   bg: '#fef3c7', text: '#92400e' },
  admin:   { label: 'Admin',   bg: '#fee2e2', text: '#b91c1c' },
}

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function sortDays(days: string[]): string[] {
  return [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
}

function RequestCard({
  req,
  onAccept,
  onDecline,
}: {
  req: AdminTutorRequest
  onAccept: () => void
  onDecline: () => void
}) {
  const s = STATUS_META[req.status]
  const isPending = req.status === 'pending'

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Student → Tutor row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', flex: 1 }} numberOfLines={1}>
          {req.student?.name ?? 'Unknown'}
        </Text>
        <Ionicons name="arrow-forward" size={14} color="#9ca3af" />
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#01003b', flex: 1, textAlign: 'right' }} numberOfLines={1}>
          {req.tutor?.name ?? 'Unknown'}
        </Text>
      </View>

      {/* Subject + Status badges */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, backgroundColor: '#e0f2fe' }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#0369a1' }}>{req.subject}</Text>
        </View>
        <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, backgroundColor: s.bg }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: s.text }}>{s.label}</Text>
        </View>
      </View>

      {/* Days */}
      {req.preferred_days.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            {sortDays(req.preferred_days).join(' · ')}
          </Text>
        </View>
      )}

      {/* Message */}
      {req.message ? (
        <Text
          style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic', marginBottom: 10, lineHeight: 19 }}
          numberOfLines={2}
        >
          "{req.message}"
        </Text>
      ) : null}

      {/* Accept / Decline buttons (pending only) */}
      {isPending && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <TouchableOpacity
            onPress={onDecline}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 10,
              backgroundColor: '#fee2e2',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <Ionicons name="close-outline" size={15} color="#b91c1c" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#b91c1c' }}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAccept}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 10,
              backgroundColor: '#dcfce7',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <Ionicons name="checkmark-outline" size={15} color="#15803d" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#15803d' }}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

function UserRow({ user }: { user: AdminUser }) {
  const role = ROLE_META[user.role] ?? ROLE_META.student

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#01003b',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>
          {user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{user.name}</Text>
        {user.school ? (
          <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{user.school}</Text>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8, backgroundColor: role.bg }}>
        <Text style={{ fontSize: 11, fontWeight: '600', color: role.text }}>{role.label}</Text>
      </View>
    </View>
  )
}

export default function AdminScreen() {
  const { profile } = useAuth()
  const router = useRouter()

  const [section, setSection] = useState<Section>('requests')
  const [filter, setFilter] = useState<RequestFilter>('pending')
  const [requests, setRequests] = useState<AdminTutorRequest[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [reqs, usr] = await Promise.all([getAllTutorRequests(), getAllUsers()])
      setRequests(reqs)
      setUsers(usr)
    } catch {
      setError('Could not load data.\nCheck your connection and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (profile?.role === 'admin') load()
  }, [load, profile])

  async function handleUpdateStatus(id: string, status: RequestStatus) {
    const label = status === 'accepted' ? 'accept' : 'decline'
    Alert.alert(
      `${status === 'accepted' ? 'Accept' : 'Decline'} Request`,
      `Are you sure you want to ${label} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: status === 'accepted' ? 'Accept' : 'Decline',
          style: status === 'accepted' ? 'default' : 'destructive',
          onPress: async () => {
            setUpdating(id)
            try {
              await updateRequestStatus(id, status)
              setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status } : r)),
              )
            } catch {
              Alert.alert('Error', 'Could not update the request. Try again.')
            } finally {
              setUpdating(null)
            }
          },
        },
      ],
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <View style={{ backgroundColor: '#01003b', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>Admin Panel</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Ionicons name="lock-closed-outline" size={48} color="#a4a4a4" />
          <Text style={{ color: '#6b7280', fontSize: 16, fontWeight: '600', marginTop: 16 }}>
            Access Denied
          </Text>
          <Text style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 6 }}>
            This area is only accessible to administrators.
          </Text>
        </View>
      </View>
    )
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  const studentCount = users.filter((u) => u.role === 'student').length
  const tutorCount = users.filter((u) => u.role === 'tutor').length

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#01003b',
          paddingTop: 56,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>Admin Panel</Text>
          {pendingCount > 0 && (
            <View
              style={{
                backgroundColor: '#ef4444',
                borderRadius: 12,
                paddingHorizontal: 9,
                paddingVertical: 3,
                minWidth: 26,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
                {pendingCount}
              </Text>
            </View>
          )}
        </View>

        {/* Section toggle */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 3,
            marginTop: 14,
          }}
        >
          {(['requests', 'users'] as Section[]).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSection(s)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: section === s ? '#ffffff' : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: section === s ? '#01003b' : 'rgba(255,255,255,0.7)',
                  textTransform: 'capitalize',
                }}
              >
                {s === 'requests' ? `Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` : 'Users'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Body */}
      {error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Ionicons name="alert-circle-outline" size={44} color="#a4a4a4" />
          <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12, lineHeight: 22 }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => load()}
            style={{
              marginTop: 16,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#01003b',
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#01003b" size="large" />
        </View>
      ) : section === 'requests' ? (
        <FlatList
          data={filteredRequests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#01003b" />
          }
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, marginBottom: 14 }}
            >
              {(['pending', 'all', 'accepted', 'declined'] as RequestFilter[]).map((f) => {
                const active = filter === f
                const label =
                  f === 'all'
                    ? `All (${requests.length})`
                    : f === 'pending'
                    ? `Pending (${requests.filter((r) => r.status === 'pending').length})`
                    : f === 'accepted'
                    ? `Accepted (${requests.filter((r) => r.status === 'accepted').length})`
                    : `Declined (${requests.filter((r) => r.status === 'declined').length})`
                return (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFilter(f)}
                    activeOpacity={0.75}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: active ? '#01003b' : '#ffffff',
                      borderWidth: 1,
                      borderColor: active ? '#01003b' : '#e5e7eb',
                    }}
                  >
                    <Text
                      style={{ fontSize: 13, fontWeight: '600', color: active ? '#ffffff' : '#6b7280' }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 48 }}>
              <Ionicons name="checkmark-circle-outline" size={44} color="#a4a4a4" />
              <Text style={{ color: '#6b7280', marginTop: 12 }}>No requests here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ opacity: updating === item.id ? 0.5 : 1 }}>
              <RequestCard
                req={item}
                onAccept={() => handleUpdateStatus(item.id, 'accepted')}
                onDecline={() => handleUpdateStatus(item.id, 'declined')}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#01003b" />
          }
          ListHeaderComponent={
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#01003b' }}>{studentCount}</Text>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Students</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#01003b' }}>{tutorCount}</Text>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Tutors</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#01003b' }}>{users.length}</Text>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Total</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 48 }}>
              <Ionicons name="people-outline" size={44} color="#a4a4a4" />
              <Text style={{ color: '#6b7280', marginTop: 12 }}>No users yet.</Text>
            </View>
          }
          renderItem={({ item }) => <UserRow user={item} />}
        />
      )}
    </View>
  )
}
