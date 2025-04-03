"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Morning from "@/components/sections/morning"
import Noon from "@/components/sections/noon"
import Afternoon from "@/components/sections/afternoon"
import Evening from "@/components/sections/evening"
import Night from "@/components/sections/night"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, VolumeX, Home, Heart } from "lucide-react"
import Link from "next/link"

export default function Journey() {
  // تعديل الحالة (state) لإضافة وضع المعاينة
  const [currentSection, setCurrentSection] = useState("")
  const [previewSection, setPreviewSection] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showHeartTrail, setShowHeartTrail] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const heartCount = useRef(0)
  const secretClickCount = useRef(0)
  const secretClickTimer = useRef<NodeJS.Timeout | null>(null)

  // Calculate progress based on current section
  const calculateProgress = (section: string) => {
    const sections = ["morning", "noon", "afternoon", "evening", "night"]
    const index = sections.indexOf(section)
    return ((index + 1) / sections.length) * 100
  }

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Initialize audio only on client side
    if (typeof window !== "undefined") {
      try {
        audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3") // Background music
        if (audioRef.current) {
          audioRef.current.loop = true
          audioRef.current.volume = 0.3
        }
      } catch (error) {
        console.error("Error initializing audio:", error)
      }
    }

    // Determine which section to show based on current time
    const determineSection = () => {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 13) {
        return "morning"
      } else if (hour >= 13 && hour < 16) {
        return "noon"
      } else if (hour >= 16 && hour < 19) {
        return "afternoon"
      } else if (hour >= 19 && hour < 22) {
        return "evening"
      } else {
        return "night"
      }
    }

    const section = determineSection()
    setCurrentSection(section)
    setProgress(calculateProgress(section))
    setLoading(false)

    // Update section every minute
    const interval = setInterval(() => {
      const newSection = determineSection()
      if (newSection !== currentSection) {
        setCurrentSection(newSection)
        setProgress(calculateProgress(newSection))
      }
    }, 60000)

    // Mouse move event for heart trail
    const handleMouseMove = (e: MouseEvent) => {
      if (showHeartTrail) {
        const newHeart = {
          id: heartCount.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 15 + 10,
          opacity: Math.random() * 0.5 + 0.5,
        }

        setHearts((prev) => [...prev, newHeart])

        // Remove heart after animation
        setTimeout(() => {
          setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
        }, 2000)
      }
    }

    // إضافة مستمع لضغطات المفاتيح للوصول السري لوضع المعاينة
    const handleKeyDown = (e: KeyboardEvent) => {
      // تفعيل وضع المعاينة عند الضغط على Ctrl+Shift+P
      if (e.ctrlKey && e.shiftKey && e.key === "M") {
        e.preventDefault()
        togglePreviewMode()
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      clearInterval(interval)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("keydown", handleKeyDown)
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (secretClickTimer.current) {
        clearTimeout(secretClickTimer.current)
      }
    }
  }, [currentSection, showHeartTrail])

  // تعديل وظيفة اختيار القسم لتعمل مع وضع المعاينة
  const selectSection = (section: string) => {
    if (isPreviewMode) {
      // في وضع المعاينة، نقوم فقط بتعيين قسم المعاينة دون تغيير القسم الحالي
      setPreviewSection(section)
    } else {
      // في الوضع العادي، نقوم بتغيير القسم الحالي مباشرة
      setCurrentSection(section)
      setProgress(calculateProgress(section))
    }
  }

  // وظيفة جديدة لتأكيد اختيار القسم بعد المعاينة
  const confirmSectionSelection = () => {
    if (previewSection) {
      setCurrentSection(previewSection)
      setProgress(calculateProgress(previewSection))
      setPreviewSection(null)
      setIsPreviewMode(false)
    }
  }

  // وظيفة جديدة لإلغاء المعاينة والعودة إلى القسم الحالي
  const cancelPreview = () => {
    setPreviewSection(null)
    setIsPreviewMode(false)
  }

  // وظيفة جديدة لتبديل وضع المعاينة
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      // عند تفعيل وضع المعاينة، نعين قسم المعاينة ليكون هو القسم الحالي مبدئيًا
      setPreviewSection(currentSection)
    } else {
      // عند إلغاء وضع المعاينة، نلغي المعاينة
      setPreviewSection(null)
    }
  }

  // وظيفة للنقرات السرية لتفعيل وضع المعاينة
  const handleSecretClick = () => {
    secretClickCount.current += 1

    // إعادة ضبط العداد بعد 2 ثانية من عدم النقر
    if (secretClickTimer.current) {
      clearTimeout(secretClickTimer.current)
    }

    secretClickTimer.current = setTimeout(() => {
      secretClickCount.current = 0
    }, 2000)

    // تفعيل وضع المعاينة بعد 5 نقرات متتالية
    if (secretClickCount.current >= 5) {
      secretClickCount.current = 0
      togglePreviewMode()
    }
  }

  // Toggle background music
  const toggleAudio = () => {
    if (audioRef.current) {
      try {
        if (audioPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
        }
        setAudioPlaying(!audioPlaying)
      } catch (error) {
        console.error("Error toggling audio:", error)
      }
    }
  }

  // Toggle heart trail
  const toggleHeartTrail = () => {
    setShowHeartTrail(!showHeartTrail)
  }

  // Only render after client-side hydration
  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-teal-700 text-lg">بنحمل الصفحة استنى شوية...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 pb-20">
      {/* Heart trail */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="fixed pointer-events-none z-50 text-red-500"
          initial={{ scale: 0, x: heart.x, y: heart.y, opacity: heart.opacity }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 2 }}
          style={{ fontSize: `${heart.size}px` }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Fixed header with progress */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Home className="h-5 w-5" />
              </Button>
            </Link>

            {/* منطقة النقر السري - تبدو كعنوان عادي */}
            <div className="text-sm font-medium text-teal-700 cursor-default select-none" onClick={handleSecretClick}>
              رحلة عيد الميلاد
            </div>

            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleHeartTrail}>
                <Heart className={`h-5 w-5 ${showHeartTrail ? "text-red-500 fill-red-500" : ""}`} />
              </Button>

              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleAudio}>
                {audioPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* أزرار تأكيد أو إلغاء المعاينة - تظهر فقط في وضع المعاينة */}
        {isPreviewMode && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <Button
              onClick={confirmSectionSelection}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
            >
              تأكيد
            </Button>
            <Button
              onClick={cancelPreview}
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              إلغاء
            </Button>
          </div>
        )}

        {/* Section navigation */}
        <div
          className="mb-8 flex flex-wrap justify-center gap-2 bg-white/60 backdrop-blur-sm p-3 rounded-full shadow-sm"
          dir="rtl"
        >
          <motion.button
            onClick={() => (isPreviewMode ? selectSection("morning") : null)}
            disabled={!isPreviewMode}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              (isPreviewMode ? previewSection === "morning" : currentSection === "morning")
                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                : "bg-white/70 text-teal-700 hover:bg-teal-50"
            } ${!isPreviewMode && currentSection !== "morning" ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={isPreviewMode ? { scale: 1.05 } : {}}
            whileTap={isPreviewMode ? { scale: 0.95 } : {}}
          >
          الصبح
          </motion.button>
          <motion.button
            onClick={() => (isPreviewMode ? selectSection("noon") : null)}
            disabled={!isPreviewMode}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              (isPreviewMode ? previewSection === "noon" : currentSection === "noon")
                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                : "bg-white/70 text-teal-700 hover:bg-teal-50"
            } ${!isPreviewMode && currentSection !== "noon" ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={isPreviewMode ? { scale: 1.05 } : {}}
            whileTap={isPreviewMode ? { scale: 0.95 } : {}}
          >
            الضهر
          </motion.button>
          <motion.button
            onClick={() => (isPreviewMode ? selectSection("afternoon") : null)}
            disabled={!isPreviewMode}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              (isPreviewMode ? previewSection === "afternoon" : currentSection === "afternoon")
                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                : "bg-white/70 text-teal-700 hover:bg-teal-50"
            } ${!isPreviewMode && currentSection !== "afternoon" ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={isPreviewMode ? { scale: 1.05 } : {}}
            whileTap={isPreviewMode ? { scale: 0.95 } : {}}
          >
            العصر
          </motion.button>
          <motion.button
            onClick={() => (isPreviewMode ? selectSection("evening") : null)}
            disabled={!isPreviewMode}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              (isPreviewMode ? previewSection === "evening" : currentSection === "evening")
                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                : "bg-white/70 text-teal-700 hover:bg-teal-50"
            } ${!isPreviewMode && currentSection !== "evening" ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={isPreviewMode ? { scale: 1.05 } : {}}
            whileTap={isPreviewMode ? { scale: 0.95 } : {}}
          >
            المغرب
          </motion.button>
          <motion.button
            onClick={() => (isPreviewMode ? selectSection("night") : null)}
            disabled={!isPreviewMode}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              (isPreviewMode ? previewSection === "night" : currentSection === "night")
                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                : "bg-white/70 text-teal-700 hover:bg-teal-50"
            } ${!isPreviewMode && currentSection !== "night" ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={isPreviewMode ? { scale: 1.05 } : {}}
            whileTap={isPreviewMode ? { scale: 0.95 } : {}}
          >
            الليل
          </motion.button>
        </div>

        {!isPreviewMode && (
          <div className="text-center text-xs text-gray-500 mb-4">الوقت بيتغير تلقائي </div>
        )}

        {/* إشارة صغيرة جدًا لوضع المعاينة - تظهر فقط في وضع المعاينة */}
        {isPreviewMode && <div className="fixed top-4 left-4 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}

        <AnimatePresence mode="wait">
          <motion.div
            key={isPreviewMode ? previewSection || currentSection : currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {(isPreviewMode ? previewSection || currentSection : currentSection) === "morning" && <Morning />}
            {(isPreviewMode ? previewSection || currentSection : currentSection) === "noon" && <Noon />}
            {(isPreviewMode ? previewSection || currentSection : currentSection) === "afternoon" && <Afternoon />}
            {(isPreviewMode ? previewSection || currentSection : currentSection) === "evening" && <Evening />}
            {(isPreviewMode ? previewSection || currentSection : currentSection) === "night" && <Night />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

