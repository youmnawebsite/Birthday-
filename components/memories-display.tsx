"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { getMemories, type Memory } from "@/lib/supabase"

export default function MemoriesDisplay() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // جلب الذكريات من قاعدة البيانات
    const fetchMemories = async () => {
      try {
        setLoading(true)
        const loadedMemories = await getMemories()
        setMemories(loadedMemories)
      } catch (error) {
        console.error("خطأ في جلب الذكريات:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemories()
  }, [])

  // إذا كان جاري التحميل، اعرض رسالة تحميل
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-blue-600 text-sm">جاري تحميل الذكريات...</p>
      </div>
    )
  }

  // إذا لم تكن هناك ذكريات، اعرض رسالة افتراضية
  if (memories.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">سنبدأ معًا في صنع ذكريات جميلة!</p>
      </div>
    )
  }

  return (
    <div className="my-6">
      <h3 className="text-lg font-medium text-blue-700 mb-3 text-center">ذكريات مشتركة</h3>

      <div className="space-y-4">
        {memories.map((memory) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-100 shadow-sm">
              <div className="relative">
                <div className="absolute -top-3 -right-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full shadow-md">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed pt-2">{memory.text}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

