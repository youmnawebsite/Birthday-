"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { saveWish } from "@/lib/supabase"

interface WishFormProps {
  onWishSubmitted: () => void
}

export default function WishForm({ onWishSubmitted }: WishFormProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // التحقق من البيانات
    if (!message.trim()) {
      setError("الرجاء كتابة أمنيتك")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // حفظ الأمنية في قاعدة البيانات مع اسم ثابت
      await saveWish({
        name: "حبيبتي",
        message: message.trim(),
      })

      // إعادة تعيين النموذج
      setMessage("")

      // إخبار المكون الأب بأن الأمنية تم إرسالها
      onWishSubmitted()
    } catch (error) {
      console.error("خطأ في حفظ الأمنية:", error)
      setError("حدث خطأ أثناء حفظ أمنيتك. الرجاء المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="أمنيتك..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] text-right border-purple-200 focus:border-purple-400"
          required
        />

        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري الإرسال..." : "إرسال الأمنية"}
      </Button>
    </form>
  )
}

