import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getDevotionals } from '../../lib/devotionals'
import type { Devotional } from '../../lib/devotionals'

type Filter = 'all' | 'daily' | 'weekly'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function excerpt(text: string, max = 110) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export default function DevotionalsScreen() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Devotional | null>(null)

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await getDevotionals()
      setDevotionals(data)
    } catch {
      setError('Could not load devotionals.\nCheck your connection and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered =
    filter === 'all' ? devotionals : devotionals.filter((d) => d.type === filter)

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#01003b',
          paddingTop: 56,
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '700' }}>Devotionals</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
          Faith fuel for the grind
        </Text>
      </View>

      {/* Filter pills */}
      <View
        style={{
          backgroundColor: '#01003b',
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
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
                {f.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Content */}
      {error ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
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
      ) : filtered.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
        >
          <Ionicons name="heart-outline" size={44} color="#a4a4a4" />
          <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12 }}>
            {filter === 'all' ? 'No devotionals yet.' : `No ${filter} devotionals yet.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#01003b"
            />
          }
          renderItem={({ item }) => <DevotionalCard item={item} onPress={() => setSelected(item)} />}
        />
      )}

      {/* Detail modal */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && <DevotionalDetail devotional={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </View>
  )
}

function DevotionalCard({
  item,
  onPress,
}: {
  item: Devotional
  onPress: () => void
}) {
  const isDaily = item.type === 'daily'
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            backgroundColor: isDaily ? '#e0f2fe' : '#f0fdf4',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: isDaily ? '#0369a1' : '#15803d',
            }}
          >
            {item.type}
          </Text>
        </View>
        <Text style={{ color: '#9ca3af', fontSize: 12, marginLeft: 'auto' }}>
          {formatDate(item.published_at)}
        </Text>
      </View>

      <Text style={{ color: '#01003b', fontSize: 17, fontWeight: '700', marginBottom: 4 }}>
        {item.title}
      </Text>

      {item.scripture_ref && (
        <Text style={{ color: '#a4a4a4', fontSize: 12, marginBottom: 8 }}>
          {item.scripture_ref}
        </Text>
      )}

      <Text style={{ color: '#6b7280', fontSize: 14, lineHeight: 21 }}>
        {excerpt(item.body)}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#01003b', fontSize: 13, fontWeight: '600' }}>Read more</Text>
        <Ionicons name="arrow-forward" size={13} color="#01003b" style={{ marginLeft: 4 }} />
      </View>
    </TouchableOpacity>
  )
}

function DevotionalDetail({
  devotional,
  onClose,
}: {
  devotional: Devotional
  onClose: () => void
}) {
  const isDaily = devotional.type === 'daily'
  return (
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
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            backgroundColor: isDaily ? 'rgba(3,105,161,0.35)' : 'rgba(21,128,61,0.35)',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: isDaily ? '#7dd3fc' : '#86efac',
            }}
          >
            {devotional.type}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 32,
            marginBottom: 4,
          }}
        >
          {devotional.title}
        </Text>
        <Text style={{ color: '#a4a4a4', fontSize: 12, marginBottom: 24 }}>
          {formatDate(devotional.published_at)}
        </Text>

        {/* Scripture block */}
        {devotional.scripture_ref && (
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderLeftWidth: 3,
              borderLeftColor: 'rgba(255,255,255,0.25)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 28,
            }}
          >
            {devotional.scripture_text && (
              <Text
                style={{
                  color: '#e5e7eb',
                  fontSize: 15,
                  lineHeight: 24,
                  fontStyle: 'italic',
                  marginBottom: 8,
                }}
              >
                "{devotional.scripture_text}"
              </Text>
            )}
            <Text style={{ color: '#a4a4a4', fontSize: 12, fontWeight: '600' }}>
              — {devotional.scripture_ref}
            </Text>
          </View>
        )}

        {/* Body paragraphs */}
        {devotional.body.split('\n\n').map((para, i) => (
          <Text
            key={i}
            style={{ color: '#ffffff', fontSize: 16, lineHeight: 26, marginBottom: 16 }}
          >
            {para}
          </Text>
        ))}
      </ScrollView>
    </View>
  )
}
