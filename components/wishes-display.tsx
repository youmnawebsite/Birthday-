"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { getWishes, type Wish } from "@/lib/supabase"

export default function WishesDisplay() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // جلب الأمنيات من قاعدة البيانات
    const fetchWishes = async () => {
      try {
        setLoading(true)
        const loadedWishes = await getWishes()
        setWishes(loadedWishes)

        // تغيير الأمنية المعروضة كل 8 ثوانٍ إذا كان هناك أكثر من أمنية
        if (loadedWishes.length > 1) {
          const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedWishes.length)
          }, 8000)

          return () => clearInterval(interval)
        }
      } catch (error) {
        console.error("خطأ في جلب الأمنيات:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishes()
  }, [])

  // إذا كان جاري التحميل، اعرض رسالة تحميل
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600 mb-2"></div>
        <p className="text-purple-600 text-sm">جاري تحميل الأمنيات...</p>
      </div>
    )
  }

  // إذا لم تكن هناك أمنيات، اعرض رسالة افتراضية
  if (wishes.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">أمنياتي لكِ بيوم ميلاد سعيد مليء بالفرح والسعادة!</p>
      </div>
    )
  }

  const currentWish = wishes[currentIndex]

  return (
    <div className="my-6">
      <h3 className="text-lg font-medium text-purple-700 mb-3 text-center">أمنيات خاصة</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWish.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-100 shadow-sm">
            <div className="relative">
              <div className="absolute -top-3 -right-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-md">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed pt-2 mb-3">"{currentWish.message}"</p>

              <div className="text-right text-sm text-gray-500">- {currentWish.name || "حبيبك"}</div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {wishes.length > 1 && (
        <div className="flex justify-center mt-3">
          {wishes.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? "bg-purple-500" : "bg-purple-200"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

