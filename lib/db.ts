// نظام بسيط لتخزين البيانات باستخدام localStorage في المتصفح
// في تطبيق حقيقي، يمكنك استخدام قاعدة بيانات مثل Supabase أو MongoDB

export type Wish = {
  id: string
  message: string
  name: string
  createdAt: number
}

export type Memory = {
  id: string
  text: string
  createdAt: number
}

// تخزين الأمنيات
export const saveWish = (wish: Omit<Wish, "id" | "createdAt">) => {
  if (typeof window === "undefined") return null

  const wishes = getWishes()
  const newWish = {
    ...wish,
    id: Date.now().toString(),
    createdAt: Date.now(),
  }

  wishes.push(newWish)
  localStorage.setItem("birthday_wishes", JSON.stringify(wishes))
  return newWish
}

export const getWishes = (): Wish[] => {
  if (typeof window === "undefined") return []

  const wishes = localStorage.getItem("birthday_wishes")
  return wishes ? JSON.parse(wishes) : []
}

// تخزين الذكريات
export const saveMemory = (memory: Omit<Memory, "id" | "createdAt">) => {
  if (typeof window === "undefined") return null

  const memories = getMemories()
  const newMemory = {
    ...memory,
    id: Date.now().toString(),
    createdAt: Date.now(),
  }

  memories.push(newMemory)
  localStorage.setItem("birthday_memories", JSON.stringify(memories))
  return newMemory
}

export const getMemories = (): Memory[] => {
  if (typeof window === "undefined") return []

  const memories = localStorage.getItem("birthday_memories")
  return memories ? JSON.parse(memories) : []
}

// تخزين التسجيلات الصوتية
export type AudioRecording = {
  id: string
  url: string
  createdAt: number
}

export const saveAudioRecording = (url: string) => {
  if (typeof window === "undefined") return null

  const recordings = getAudioRecordings()
  const newRecording = {
    id: Date.now().toString(),
    url,
    createdAt: Date.now(),
  }

  recordings.push(newRecording)
  localStorage.setItem("audio_recordings", JSON.stringify(recordings))
  return newRecording
}

export const getAudioRecordings = (): AudioRecording[] => {
  if (typeof window === "undefined") return []

  const recordings = localStorage.getItem("audio_recordings")
  return recordings ? JSON.parse(recordings) : []
}

