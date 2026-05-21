import { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { submitTutorRequest, type Tutor } from '../lib/tutors'

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Props {
  tutor: Tutor | null
  onClose: () => void
  onSuccess: () => void
}

export function TutorRequestModal({ tutor, onClose, onSuccess }: Props) {
  const [subject, setSubject] = useState('')
  const [days, setDays] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (tutor) {
      setSubject(tutor.subjects[0] ?? '')
      setDays([])
      setMessage('')
    }
  }, [tutor])

  function toggleDay(day: string) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  async function handleSubmit() {
    if (!tutor || !subject) return
    setSubmitting(true)
    try {
      await submitTutorRequest({ tutor_id: tutor.id, subject, message, preferred_days: days })
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not send request. Please try again.'
      Alert.alert('Error', msg)
    } finally {
      setSubmitting(false)
    }
  }

  const sortedDays = [...(tutor?.availability ?? [])].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b),
  )

  return (
    <Modal visible={tutor !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
        {/* Backdrop tap to dismiss */}
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 40,
            }}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#e5e7eb',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />

            {/* Title row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                Request {tutor?.name}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Subject selector */}
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Subject
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
              contentContainerStyle={{ gap: 8 }}
            >
              {(tutor?.subjects ?? []).map((s) => {
                const active = s === subject
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSubject(s)}
                    activeOpacity={0.75}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: active ? '#01003b' : '#f3f4f6',
                    }}
                  >
                    <Text
                      style={{
                        color: active ? '#ffffff' : '#374151',
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

            {/* Preferred days */}
            {sortedDays.length > 0 && (
              <>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Preferred Days{' '}
                  <Text style={{ fontWeight: '400', color: '#9ca3af' }}>(optional)</Text>
                </Text>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}
                >
                  {sortedDays.map((day) => {
                    const active = days.includes(day)
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        activeOpacity={0.75}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          backgroundColor: active ? '#dbeafe' : '#f3f4f6',
                          borderWidth: 1,
                          borderColor: active ? '#3b82f6' : 'transparent',
                        }}
                      >
                        <Text
                          style={{
                            color: active ? '#1d4ed8' : '#374151',
                            fontWeight: '600',
                            fontSize: 13,
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </>
            )}

            {/* Message */}
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Message{' '}
              <Text style={{ fontWeight: '400', color: '#9ca3af' }}>(optional)</Text>
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell them what you need help with..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: '#111827',
                minHeight: 80,
                marginBottom: 20,
              }}
            />

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: '#f3f4f6',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '600', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting || !subject}
                style={{
                  flex: 2,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: submitting || !subject ? '#9ca3af' : '#01003b',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>
                      Send Request
                    </Text>
                    <Ionicons name="send" size={14} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}
