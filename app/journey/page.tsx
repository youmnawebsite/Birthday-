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
  const [currentSection, setCurrentSection] = useState("")
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showHeartTrail, setShowHeartTrail] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([])
  const [showTooltip, setShowTooltip] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const heartCount = useRef(0)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
      audioRef.current = new Audio("/placeholder.mp3") // Replace with actual background music
      if (audioRef.current) {
        audioRef.current.loop = true
        audioRef.current.volume = 0.3
      }
    }

    // تعديل وظيفة تحديد القسم بناءً على الوقت الحالي
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

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearInterval(interval)
      window.removeEventListener("mousemove", handleMouseMove)
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [currentSection, showHeartTrail])

  // تعديل وظيفة اختيار القسم لتكون غير فعالة
  const selectSection = (section: string) => {
    // لا تفعل شيئًا - الأقسام غير قابلة للضغط
    console.log("الأقسام تظهر حسب الوقت فقط")
  }

  // This function is now just a placeholder - sections can't be manually selected
  const handleSectionClick = () => {
    setShowTooltip(true)

    // Hide tooltip after 3 seconds
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }

    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

  // Toggle background music
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
      setAudioPlaying(!audioPlaying)
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
          <p className="text-teal-700 text-lg">جاري تحميل رحلتك الخاصة...</p>
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

            <div className="text-sm font-medium text-teal-700">رحلة عيد الميلاد</div>

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
        {/* Section navigation */}
        <div className="relative">
          {showTooltip && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 whitespace-nowrap">
              الأقسام بتظهر حسب الوقت بس 🕒
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-teal-600"></div>
            </div>
          )}

          {/* تعديل أزرار الأقسام لتكون غير قابلة للضغط */}
          <div
            className="mb-8 flex flex-wrap justify-center gap-2 bg-white/60 backdrop-blur-sm p-3 rounded-full shadow-sm"
            dir="rtl"
          >
            <motion.button
              onClick={() => {}}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${currentSection === "morning" ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md" : "bg-white/70 text-gray-500 cursor-not-allowed"}`}
            >
              الصبح
            </motion.button>
            <motion.button
              onClick={() => {}}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${currentSection === "noon" ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md" : "bg-white/70 text-gray-500 cursor-not-allowed"}`}
            >
              الظهر
            </motion.button>
            <motion.button
              onClick={() => {}}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${currentSection === "afternoon" ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md" : "bg-white/70 text-gray-500 cursor-not-allowed"}`}
            >
              العصر
            </motion.button>
            <motion.button
              onClick={() => {}}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${currentSection === "evening" ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md" : "bg-white/70 text-gray-500 cursor-not-allowed"}`}
            >
              المغرب
            </motion.button>
            <motion.button
              onClick={() => {}}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${currentSection === "night" ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md" : "bg-white/70 text-gray-500 cursor-not-allowed"}`}
            >
              الليل
            </motion.button>
          </div>
        </div>

        {/* إضافة نص توضيحي أسفل الأزرار */}
        <div className="text-center text-xs text-gray-500 mb-6">كل قسم بيظهر في وقته المناسب على مدار اليوم 🕒</div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentSection === "morning" && <Morning />}
            {currentSection === "noon" && <Noon />}
            {currentSection === "afternoon" && <Afternoon />}
            {currentSection === "evening" && <Evening />}
            {currentSection === "night" && <Night />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

