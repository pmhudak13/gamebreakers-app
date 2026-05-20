import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  getResources,
  type Resource,
  type ResourceCategory,
  type ResourceType,
} from '../../lib/resources'

type FilterKey = 'all' | ResourceCategory

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'faith', label: 'Faith' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'academics', label: 'Academics' },
  { key: 'life', label: 'Life Skills' },
]

const CATEGORY_META: Record<ResourceCategory, { label: string; bg: string; text: string }> = {
  faith:     { label: 'Faith',       bg: '#ede9fe', text: '#6d28d9' },
  fitness:   { label: 'Fitness',     bg: '#dcfce7', text: '#15803d' },
  academics: { label: 'Academics',   bg: '#e0f2fe', text: '#0369a1' },
  life:      { label: 'Life Skills', bg: '#fef3c7', text: '#92400e' },
}

const TYPE_ICON: Record<ResourceType, React.ComponentProps<typeof Ionicons>['name']> = {
  article: 'newspaper-outline',
  video:   'play-circle-outline',
  podcast: 'mic-outline',
  tool:    'construct-outline',
}

const TYPE_LABEL: Record<ResourceType, string> = {
  article: 'Article',
  video:   'Video',
  podcast: 'Podcast',
  tool:    'Tool',
}

export default function ResourcesScreen() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filter, setFilter] = useState<FilterKey>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await getResources(filter === 'all' ? undefined : filter)
      setResources(data)
    } catch {
      setError('Could not load resources.\nCheck your connection and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

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
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '700' }}>Resources</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
          Grow on and off the field
        </Text>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ gap: 8 }}
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
        </ScrollView>
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
      ) : resources.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Ionicons name="grid-outline" size={44} color="#a4a4a4" />
          <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12 }}>
            No resources in this category yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#01003b"
            />
          }
          renderItem={({ item }) => <ResourceCard item={item} />}
        />
      )}
    </View>
  )
}

function ResourceCard({ item }: { item: Resource }) {
  const cat = CATEGORY_META[item.category]
  const iconName = TYPE_ICON[item.resource_type]

  async function handleOpen() {
    const supported = await Linking.canOpenURL(item.url)
    if (supported) {
      await Linking.openURL(item.url)
    }
  }

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
      {/* Top row: icon + category badge + type label */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: cat.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={iconName} size={17} color={cat.text} />
        </View>
        <View
          style={{
            paddingHorizontal: 7,
            paddingVertical: 2,
            borderRadius: 5,
            backgroundColor: cat.bg,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: cat.text,
            }}
          >
            {cat.label}
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: '#9ca3af' }}>{TYPE_LABEL[item.resource_type]}</Text>
      </View>

      {/* Title */}
      <Text
        style={{
          color: '#111827',
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 6,
          lineHeight: 22,
        }}
      >
        {item.title}
      </Text>

      {/* Description */}
      <Text
        style={{ color: '#6b7280', fontSize: 14, lineHeight: 21, marginBottom: 14 }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      {/* Open button */}
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 10,
          backgroundColor: '#01003b',
          gap: 5,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 13 }}>Open</Text>
        <Ionicons name="arrow-forward" size={13} color="#ffffff" />
      </TouchableOpacity>
    </View>
  )
}
