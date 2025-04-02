import { createClient } from "@supabase/supabase-js"
import { saveWish as saveLocalWish, getWishes as getLocalWishes } from "./db"
import { saveMemory as saveLocalMemory, getMemories as getLocalMemories } from "./db"
import { saveAudioRecording as saveLocalAudio, getAudioRecordings as getLocalAudios } from "./db"

// تأكد من إضافة هذه المتغيرات البيئية عند رفع الموقع
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// التحقق من توفر بيانات Supabase
const isSupabaseAvailable = !!(supabaseUrl && supabaseAnonKey)

// إنشاء عميل Supabase فقط إذا كانت البيانات متوفرة
export const supabase = isSupabaseAvailable ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// أنواع البيانات
export type Wish = {
  id: string
  message: string
  name?: string
  created_at: string
}

export type Memory = {
  id: string
  text: string
  created_at: string
}

// Pre-populated data for wishes
const defaultWishes = [
  {
    id: "1",
    message: "أتمنى لكِ عامًا مليئًا بالسعادة والنجاح والحب",
    name: "حبيبك",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    message: "أتمنى أن تحققي كل أحلامك وطموحاتك في العام الجديد",
    name: "حبيبك",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    message: "أتمنى أن نقضي معًا سنوات طويلة من الحب والسعادة",
    name: "حبيبك",
    created_at: new Date().toISOString(),
  },
]

// Pre-populated data for memories
const defaultMemories = [
  {
    id: "1",
    text: "أول مرة قابلتك فيها، كنتِ أجمل ما رأيت في حياتي",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    text: "رحلتنا الأولى معًا، كانت مليئة بالمغامرات والضحك",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    text: "عندما أهديتك تلك الهدية البسيطة وفرحتِ بها كثيرًا",
    created_at: new Date().toISOString(),
  },
]

// دوال للتعامل مع الأمنيات
export async function saveWish(wish: { name: string; message: string }) {
  try {
    // إذا كان Supabase متاح، استخدمه
    if (supabase) {
      const { data, error } = await supabase
        .from("wishes")
        .insert([
          {
            name: wish.name || "زائر",
            message: wish.message,
          },
        ])
        .select()

      if (error) throw error
      return data?.[0]
    } else {
      // استخدام التخزين المحلي كبديل
      return saveLocalWish({
        name: wish.name,
        message: wish.message,
      })
    }
  } catch (error) {
    console.error("خطأ في حفظ الأمنية:", error)
    // محاولة استخدام التخزين المحلي في حالة الفشل
    return saveLocalWish({
      name: wish.name,
      message: wish.message,
    })
  }
}

export async function getWishes() {
  try {
    // إذا كان Supabase متاح، استخدمه
    if (supabase) {
      const { data, error } = await supabase.from("wishes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || defaultWishes
    } else {
      // استخدام التخزين المحلي كبديل
      const localWishes = getLocalWishes()
      return localWishes.length > 0 ? localWishes : defaultWishes
    }
  } catch (error) {
    console.error("خطأ في جلب الأمنيات:", error)
    // محاولة استخدام التخزين المحلي في حالة الفشل
    const localWishes = getLocalWishes()
    return localWishes.length > 0 ? localWishes : defaultWishes
  }
}

// دوال للتعامل مع الذكريات
export async function saveMemory(memory: { text: string }) {
  try {
    // إذا كان Supabase متاح، استخدمه
    if (supabase) {
      const { data, error } = await supabase
        .from("memories")
        .insert([{ text: memory.text }])
        .select()

      if (error) throw error
      return data?.[0]
    } else {
      // استخدام التخزين المحلي كبديل
      return saveLocalMemory({
        text: memory.text,
      })
    }
  } catch (error) {
    console.error("خطأ في حفظ الذكرى:", error)
    // محاولة استخدام التخزين المحلي في حالة الفشل
    return saveLocalMemory({
      text: memory.text,
    })
  }
}

export async function getMemories() {
  try {
    // إذا كان Supabase متاح، استخدمه
    if (supabase) {
      const { data, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || defaultMemories
    } else {
      // استخدام التخزين المحلي كبديل
      const localMemories = getLocalMemories()
      return localMemories.length > 0 ? localMemories : defaultMemories
    }
  } catch (error) {
    console.error("خطأ في جلب الذكريات:", error)
    // محاولة استخدام التخزين المحلي في حالة الفشل
    const localMemories = getLocalMemories()
    return localMemories.length > 0 ? localMemories : defaultMemories
  }
}

// دوال للتعامل مع التسجيلات الصوتية
export async function saveAudioRecording(url: string) {
  try {
    // إذا كان Supabase متاح، استخدمه
    if (supabase) {
      const { data, error } = await supabase.from("audio_recordings").insert([{ url }]).select()

      if (error) throw error
      return data?.[0]
    } else {
      // استخدام التخزين المحلي كبديل
      return saveLocalAudio(url)
    }
  } catch (error) {
    console.error("خطأ في حفظ التسجيل الصوتي:", error)
    // محاولة استخدام التخزين المحلي في حالة الفشل
    return saveLocalAudio(url)
  }
}

export async function getAudioRecordings() {
  try {
    // إذا كان Supabase متاح، استخدمه
    if (supabase) {
      const { data, error } = await supabase
        .from("audio_recordings")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } else {
      // استخدام التخزين المحلي كبديل
      return getLocalAudios()
    }
  } catch (error) {
    console.error("خطأ في جلب التسجيلات الصوتية:", error)
    // محاولة استخدام التخزين المحلي في حالة الفشل
    return getLocalAudios()
  }
}

export async function saveUploadedImage(url: string) {
  try {
    if (supabase) {
      const { data, error } = await supabase.from("uploaded_images").insert([{ url }]).select()

      if (error) throw error
      return data?.[0]
    } else {
      console.warn("Supabase not available. Image URL not saved.")
      return null
    }
  } catch (error) {
    console.error("Error saving image URL:", error)
    return null
  }
}

export async function getUploadedImages(): Promise<string[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("uploaded_images")
        .select("url")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Extract URLs from the data array
      const imageUrls = data.map((item) => item.url)
      return imageUrls
    } else {
      console.warn("Supabase not available. Returning empty array for images.")
      return []
    }
  } catch (error) {
    console.error("Error fetching uploaded images:", error)
    return []
  }
}

