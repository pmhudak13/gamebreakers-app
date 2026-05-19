const BIBLE_ID = 'de4e12af7f28f599-01' // KJV
const API_BASE = 'https://api.scripture.api.bible/v1'

export interface BibleBook {
  id: string
  name: string
  nameLong: string
}

export interface BibleChapter {
  id: string
  number: string
  bookId: string
}

export interface BibleVerse {
  number: number
  text: string
}

async function apiFetch(path: string) {
  const key = process.env.EXPO_PUBLIC_BIBLE_API_KEY
  if (!key) throw new Error('EXPO_PUBLIC_BIBLE_API_KEY not set in .env.local')
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'api-key': key } })
  if (!res.ok) throw new Error(`Bible API error: ${res.status}`)
  return res.json()
}

export async function getBooks(): Promise<BibleBook[]> {
  const json = await apiFetch(`/bibles/${BIBLE_ID}/books`)
  return json.data as BibleBook[]
}

export async function getChapters(bookId: string): Promise<BibleChapter[]> {
  const json = await apiFetch(`/bibles/${BIBLE_ID}/books/${bookId}/chapters`)
  return (json.data as BibleChapter[]).filter((c) => c.number !== 'intro')
}

export async function getChapterVerses(chapterId: string): Promise<BibleVerse[]> {
  const json = await apiFetch(
    `/bibles/${BIBLE_ID}/chapters/${chapterId}?include-verse-numbers=true&include-titles=false&include-chapter-numbers=false`
  )
  return parseVerses(json.data?.content ?? '')
}

function parseVerses(html: string): BibleVerse[] {
  // Split on verse number spans: <span data-number="N" ... class="v">N</span>
  const parts = html.split(/(<span\s[^>]*class="v"[^>]*>\d+<\/span>)/)
  const verses: BibleVerse[] = []

  for (let i = 0; i < parts.length; i++) {
    const verseMatch = parts[i].match(/<span\s[^>]*class="v"[^>]*>(\d+)<\/span>/)
    if (verseMatch) {
      const number = parseInt(verseMatch[1])
      const text = cleanHtml(parts[i + 1] ?? '')
      if (text) verses.push({ number, text })
      i++
    }
  }

  return verses
}

function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
