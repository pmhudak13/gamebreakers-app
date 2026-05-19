import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getBooks, getChapters, getChapterVerses } from '../../lib/bible'
import type { BibleBook, BibleChapter, BibleVerse } from '../../lib/bible'

const DEFAULT_BOOK_ID = 'JHN'

export default function BibleScreen() {
  const [books, setBooks] = useState<BibleBook[]>([])
  const [chapters, setChapters] = useState<BibleChapter[]>([])
  const [verses, setVerses] = useState<BibleVerse[]>([])
  const [book, setBook] = useState<BibleBook | null>(null)
  const [chapter, setChapter] = useState<BibleChapter | null>(null)
  const [bookModal, setBookModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getBooks()
      .then((bks) => {
        setBooks(bks)
        const defaultBook = bks.find((b) => b.id === DEFAULT_BOOK_ID) ?? bks[0]
        setBook(defaultBook ?? null)
      })
      .catch(() => {
        setError('Could not load books.\nCheck EXPO_PUBLIC_BIBLE_API_KEY in .env.local')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!book) return
    getChapters(book.id)
      .then((chaps) => {
        setChapters(chaps)
        setChapter(chaps[0] ?? null)
      })
      .catch(() => setError('Could not load chapters.'))
  }, [book])

  useEffect(() => {
    if (!chapter) return
    setLoading(true)
    setError(null)
    getChapterVerses(chapter.id)
      .then((vs) => setVerses(vs))
      .catch(() => setError('Could not load chapter content.'))
      .finally(() => setLoading(false))
  }, [chapter])

  function pickBook(b: BibleBook) {
    setBook(b)
    setBookModal(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#01003b' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '700' }}>Bible</Text>
        <TouchableOpacity
          onPress={() => setBookModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          activeOpacity={0.75}
        >
          <Text style={{ color: '#ffffff', fontWeight: '600', marginRight: 4 }}>
            {book?.name ?? '—'} {chapter?.number ?? ''}
          </Text>
          <Ionicons name="chevron-down" size={14} color="white" />
        </TouchableOpacity>
      </View>

      {/* Chapter selector */}
      {chapters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 10,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {chapters.map((ch) => {
            const active = chapter?.id === ch.id
            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => setChapter(ch)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.12)',
                }}
                activeOpacity={0.75}
              >
                <Text
                  style={{
                    color: active ? '#01003b' : '#ffffff',
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  {ch.number}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}

      {/* Content */}
      {error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Ionicons name="alert-circle-outline" size={44} color="#a4a4a4" />
          <Text style={{ color: '#a4a4a4', textAlign: 'center', marginTop: 12, lineHeight: 22 }}>
            {error}
          </Text>
        </View>
      ) : loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="white" size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
          <Text
            style={{
              color: '#a4a4a4',
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 16,
              marginTop: 4,
            }}
          >
            {book?.name} {chapter?.number} — KJV
          </Text>
          {verses.map((v) => (
            <View key={v.number} style={{ flexDirection: 'row', marginBottom: 14 }}>
              <Text
                style={{
                  color: '#a4a4a4',
                  fontSize: 11,
                  width: 24,
                  paddingTop: 3,
                  fontWeight: '700',
                }}
              >
                {v.number}
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 16, lineHeight: 26, flex: 1 }}>
                {v.text}
              </Text>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Book picker modal */}
      <Modal
        visible={bookModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBookModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#01003b' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingTop: 20,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', flex: 1 }}>
              Select Book
            </Text>
            <TouchableOpacity onPress={() => setBookModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={books}
            keyExtractor={(b) => b.id}
            renderItem={({ item }) => {
              const active = book?.id === item.id
              return (
                <TouchableOpacity
                  onPress={() => pickBook(item)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.06)',
                    backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#ffffff', fontSize: 16 }}>{item.name}</Text>
                  {active && <Ionicons name="checkmark" size={18} color="#a4a4a4" />}
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </Modal>
    </View>
  )
}
