import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/auth'
import {
  getPrayerRequests,
  submitPrayerRequest,
  togglePrayer,
  type PrayerRequest,
  type PrayerCategory,
} from '../../lib/prayer'

const CATEGORIES: { key: PrayerCategory; label: string }[] = [
  { key: 'personal', label: 'Personal' },
  { key: 'family', label: 'Family' },
  { key: 'school', label: 'School' },
  { key: 'health', label: 'Health' },
  { key: 'other', label: 'Other' },
]

const CATEGORY_COLORS: Record<PrayerCategory, { bg: string; text: string }> = {
  personal: { bg: '#ede9fe', text: '#6d28d9' },
  family:   { bg: '#fce7f3', text: '#9d174d' },
  school:   { bg: '#e0f2fe', text: '#0369a1' },
  health:   { bg: '#dcfce7', text: '#15803d' },
  other:    { bg: '#f3f4f6', text: '#374151' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3_600_000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function excerpt(text: string, max = 120) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export default function PrayerScreen() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const load = useCallback(
    async (showRefresh = false) => {
      if (!user) return
      if (showRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      try {
        const data = await getPrayerRequests(user.id)
        setRequests(data)
      } catch {
        setError('Could not load prayer requests.\nCheck your connection and try again.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [user]
  )

  useEffect(() => {
    load()
  }, [load])

  function handlePrayToggle(id: string) {
    if (!user) return
    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const iPrayed = !r.i_prayed
        return {
          ...r,
          i_prayed: iPrayed,
          prayer_count: r.prayer_count + (iPrayed ? 1 : -1),
        }
      })
    )
    const req = requests.find((r) => r.id === id)
    if (!req) return
    togglePrayer(id, user.id, req.i_prayed).catch(() => {
      // Revert on failure
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r
          return { ...r, i_prayed: req.i_prayed, prayer_count: req.prayer_count }
        })
      )
    })
  }

  function handleSubmitDone(newRequest: PrayerRequest) {
    setRequests((prev) => [newRequest, ...prev])
    setShowSubmit(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#01003b',
          paddingTop: 56,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '700' }}>Prayer Board</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
            Lift each other up
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSubmit(true)}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
            gap: 5,
          }}
        >
          <Ionicons name="add" size={16} color="#01003b" />
          <Text style={{ color: '#01003b', fontWeight: '700', fontSize: 13 }}>Request</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {error ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Ionicons name="alert-circle-outline" size={44} color="#a4a4a4" />
          <Text
            style={{ color: '#6b7280', textAlign: 'center', marginTop: 12, lineHeight: 22 }}
          >
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
      ) : requests.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Ionicons name="hand-left-outline" size={44} color="#a4a4a4" />
          <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12 }}>
            No prayer requests yet.{'\n'}Be the first to share one.
          </Text>
          <TouchableOpacity
            onPress={() => setShowSubmit(true)}
            style={{
              marginTop: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#01003b',
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>Share a Request</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#01003b"
            />
          }
          renderItem={({ item }) => (
            <PrayerCard item={item} onPrayToggle={handlePrayToggle} />
          )}
        />
      )}

      {/* Submit modal */}
      <Modal
        visible={showSubmit}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSubmit(false)}
      >
        <SubmitModal
          userId={user?.id ?? ''}
          onClose={() => setShowSubmit(false)}
          onSubmitted={handleSubmitDone}
        />
      </Modal>
    </View>
  )
}

function PrayerCard({
  item,
  onPrayToggle,
}: {
  item: PrayerRequest
  onPrayToggle: (id: string) => void
}) {
  const colors = CATEGORY_COLORS[item.category]
  const catLabel = CATEGORIES.find((c) => c.key === item.category)?.label ?? item.category

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
      {/* Meta row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            backgroundColor: colors.bg,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              color: colors.text,
            }}
          >
            {catLabel}
          </Text>
        </View>
        <Text style={{ color: '#9ca3af', fontSize: 12, marginLeft: 'auto' }}>
          {formatDate(item.created_at)}
        </Text>
      </View>

      {/* Body */}
      <Text style={{ color: '#111827', fontSize: 15, lineHeight: 23, marginBottom: 12 }}>
        {excerpt(item.body)}
      </Text>

      {/* Footer */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#9ca3af', fontSize: 12 }}>
          {item.author_name ?? 'Anonymous'}
        </Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={() => onPrayToggle(item.id)}
          activeOpacity={0.75}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            gap: 5,
            backgroundColor: item.i_prayed ? '#01003b' : '#f3f4f6',
          }}
        >
          <Text style={{ fontSize: 14 }}>🙏</Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: item.i_prayed ? '#ffffff' : '#374151',
            }}
          >
            {item.i_prayed ? "I'm Praying" : 'Pray'}
          </Text>
          {item.prayer_count > 0 && (
            <Text
              style={{
                fontSize: 12,
                color: item.i_prayed ? 'rgba(255,255,255,0.7)' : '#9ca3af',
              }}
            >
              · {item.prayer_count}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

function SubmitModal({
  userId,
  onClose,
  onSubmitted,
}: {
  userId: string
  onClose: () => void
  onSubmitted: (r: PrayerRequest) => void
}) {
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<PrayerCategory>('personal')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { profile } = useAuth()

  const bodyLength = body.trim().length
  const canSubmit = bodyLength >= 10 && bodyLength <= 500 && !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitPrayerRequest(userId, body, category, anonymous)
      // Build optimistic record to add to list immediately
      const newRequest: PrayerRequest = {
        id: Math.random().toString(36).slice(2),
        user_id: userId,
        body: body.trim(),
        category,
        anonymous,
        status: 'approved',
        created_at: new Date().toISOString(),
        author_name: anonymous ? null : (profile?.name ?? null),
        prayer_count: 0,
        i_prayed: false,
      }
      onSubmitted(newRequest)
    } catch {
      setSubmitError('Could not submit. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, backgroundColor: '#01003b' }}>
        {/* Modal header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', flex: 1 }}>
            Share a Prayer Request
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Body input */}
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 }}>
            YOUR REQUEST
          </Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="What would you like prayer for?"
            placeholderTextColor="rgba(255,255,255,0.25)"
            multiline
            maxLength={500}
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 14,
              color: '#ffffff',
              fontSize: 15,
              lineHeight: 23,
              minHeight: 120,
              textAlignVertical: 'top',
              marginBottom: 6,
            }}
          />
          <Text style={{ color: bodyLength > 450 ? '#f87171' : 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'right', marginBottom: 24 }}>
            {bodyLength}/500
          </Text>

          {/* Category */}
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 }}>
            CATEGORY
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {CATEGORIES.map((c) => {
              const active = category === c.key
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  activeOpacity={0.75}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Text
                    style={{
                      color: active ? '#01003b' : '#ffffff',
                      fontWeight: '600',
                      fontSize: 13,
                    }}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Anonymous toggle */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: 14,
              marginBottom: 28,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>
                Post anonymously
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
                Your name won't appear on the request
              </Text>
            </View>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#4f46e5' }}
              thumbColor="#ffffff"
            />
          </View>

          {submitError && (
            <Text style={{ color: '#f87171', textAlign: 'center', marginBottom: 16, fontSize: 13 }}>
              {submitError}
            </Text>
          )}

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.8}
            style={{
              backgroundColor: canSubmit ? '#ffffff' : 'rgba(255,255,255,0.2)',
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#01003b" />
            ) : (
              <Text
                style={{
                  color: canSubmit ? '#01003b' : 'rgba(255,255,255,0.4)',
                  fontWeight: '700',
                  fontSize: 15,
                }}
              >
                Submit Request
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
