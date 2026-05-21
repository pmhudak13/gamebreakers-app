import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  getTutors,
  getUniqueSubjects,
  getMyTutorRequests,
  type Tutor,
  type TutorRequest,
  type RateType,
} from '../../lib/tutors'
import { TutorRequestModal } from '../../components/TutorRequestModal'

const RATE_META: Record<RateType, { label: string; bg: string; text: string }> = {
  free: { label: 'Free', bg: '#dcfce7', text: '#15803d' },
  paid: { label: 'Paid', bg: '#fef3c7', text: '#92400e' },
}

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  pending:  { label: 'Pending',  bg: '#fef3c7', text: '#92400e' },
  accepted: { label: 'Accepted', bg: '#dcfce7', text: '#15803d' },
  declined: { label: 'Declined', bg: '#f3f4f6', text: '#6b7280' },
}

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function sortDays(days: string[]): string[] {
  return [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = ['#6d28d9', '#0369a1', '#15803d', '#92400e', '#be185d', '#01003b']
function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function MyRequestsSection({ requests }: { requests: TutorRequest[] }) {
  const visible = requests.filter((r) => r.status !== 'declined')
  if (visible.length === 0) return null

  return (
    <View style={{ marginBottom: 4 }}>
      <Text
        style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.8, marginBottom: 8 }}
      >
        MY REQUESTS
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
      >
        {visible.map((req) => {
          const s = STATUS_META[req.status] ?? STATUS_META.pending
          return (
            <View
              key={req.id}
              style={{
                width: 130,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }} numberOfLines={1}>
                {req.tutor?.name ?? 'Tutor'}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }} numberOfLines={1}>
                {req.subject}
              </Text>
              <View
                style={{
                  marginTop: 8,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: s.bg,
                  alignSelf: 'flex-start',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: s.text }}>{s.label}</Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default function TutorsScreen() {
  const [allTutors, setAllTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [myRequests, setMyRequests] = useState<TutorRequest[]>([])
  const [modalTutor, setModalTutor] = useState<Tutor | null>(null)

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [tutors, requests] = await Promise.all([getTutors(), getMyTutorRequests()])
      setAllTutors(tutors)
      setSubjects(getUniqueSubjects(tutors))
      setMyRequests(requests)
    } catch {
      setError('Could not load tutors.\nCheck your connection and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const visible =
    filter === 'All' ? allTutors : allTutors.filter((t) => t.subjects.includes(filter))

  const pendingTutorIds = new Set(
    myRequests.filter((r) => r.status === 'pending').map((r) => r.tutor_id),
  )

  function handleRequest(tutor: Tutor) {
    if (pendingTutorIds.has(tutor.id)) {
      Alert.alert('Request Pending', 'You already have a pending request with this tutor.')
      return
    }
    setModalTutor(tutor)
  }

  const filterPills = ['All', ...subjects]
  const hasRequests = myRequests.filter((r) => r.status !== 'declined').length > 0

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
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '700' }}>Tutors</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
          Find a teammate to help you succeed
        </Text>

        {!loading && subjects.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 16 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {filterPills.map((s) => {
              const active = filter === s
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setFilter(s)}
                  activeOpacity={0.75}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.12)',
                  }}
                >
                  <Text
                    style={{
                      color: active ? '#01003b' : '#ffffff',
                      fontWeight: '600',
                      fontSize: 13,
                    }}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* Content */}
      {error ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
        >
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
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListHeaderComponent={
            hasRequests ? <MyRequestsSection requests={myRequests} /> : null
          }
          ListEmptyComponent={
            <View
              style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 24 }}
            >
              <Ionicons name="people-outline" size={44} color="#a4a4a4" />
              <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12 }}>
                No tutors available for this subject yet.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#01003b"
            />
          }
          renderItem={({ item }) => (
            <TutorCard
              tutor={item}
              isPending={pendingTutorIds.has(item.id)}
              onRequest={() => handleRequest(item)}
            />
          )}
        />
      )}

      <TutorRequestModal
        tutor={modalTutor}
        onClose={() => setModalTutor(null)}
        onSuccess={() => {
          setModalTutor(null)
          load(true)
        }}
      />
    </View>
  )
}

function TutorCard({
  tutor,
  isPending,
  onRequest,
}: {
  tutor: Tutor
  isPending: boolean
  onRequest: () => void
}) {
  const rate = RATE_META[tutor.rate_type]
  const color = avatarColor(tutor.name)

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Top row: avatar + name + rate */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>
            {initials(tutor.name)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#111827', fontSize: 16, fontWeight: '700' }}>{tutor.name}</Text>
          {tutor.rate_note && (
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 1 }}>{tutor.rate_note}</Text>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: rate.bg,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: rate.text }}>{rate.label}</Text>
        </View>
      </View>

      {/* Bio */}
      <Text
        style={{ color: '#6b7280', fontSize: 14, lineHeight: 21, marginBottom: 12 }}
        numberOfLines={2}
      >
        {tutor.bio}
      </Text>

      {/* Subject pills */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {tutor.subjects.map((s) => (
          <View
            key={s}
            style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, backgroundColor: '#e0f2fe' }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#0369a1' }}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Availability + request row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' }}
        >
          <Ionicons name="calendar-outline" size={13} color="#9ca3af" />
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            {sortDays(tutor.availability).join(' · ')}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onRequest}
          activeOpacity={0.8}
          disabled={isPending}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: isPending ? '#f3f4f6' : '#01003b',
            gap: 5,
          }}
        >
          <Text
            style={{
              color: isPending ? '#9ca3af' : '#ffffff',
              fontWeight: '600',
              fontSize: 13,
            }}
          >
            {isPending ? 'Pending' : 'Request'}
          </Text>
          <Ionicons
            name={isPending ? 'time-outline' : 'paper-plane-outline'}
            size={13}
            color={isPending ? '#9ca3af' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
