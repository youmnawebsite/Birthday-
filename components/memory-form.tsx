"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { saveMemory } from "@/lib/supabase"

interface MemoryFormProps {
  onMemorySaved: () => void
  onCancel: () => void
}

export default function MemoryForm({ onMemorySaved, onCancel }: MemoryFormProps) {
  const [text, setText] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // التحقق من البيانات
    if (!text.trim()) {
      setError("الرجاء كتابة ذكرى")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // حفظ الذكرى في قاعدة البيانات
      await saveMemory({
        text: text.trim(),
      })

      // إعادة تعيين النموذج
      setText("")

      // إخبار المكون الأب بأن الذكرى تم حفظها
      onMemorySaved()
    } catch (error) {
      console.error("خطأ في حفظ الذكرى:", error)
      setError("حدث خطأ أثناء حفظ الذكرى. الرجاء المحاولة مرة أخرى.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-blue-700 mb-2">شاركيني ذكرى جميلة من وجهة نظرك</h3>

      <Textarea
        placeholder="اكتبي ذكرى جميلة تجمعنا..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[120px] text-right border-blue-200 focus:border-blue-400"
        ref={textareaRef}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-center space-x-3 space-x-reverse">
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          disabled={isSaving}
        >
          {isSaving ? "جاري الحفظ..." : "احفظي الذكرى"}
        </Button>

        <Button type="button" onClick={onCancel} variant="outline" className="border-blue-200">
          إلغاء
        </Button>
      </div>
    </form>
  )
}

