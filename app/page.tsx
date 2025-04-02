"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Import Confetti component with dynamic import to avoid SSR issues
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
})

export default function Home() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Show confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const startJourney = () => {
    router.push("/journey")
  }

  // Only render the full component after mounting to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4 overflow-hidden">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center border border-teal-100"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl text-white">🎂</span>
          </div>
        </motion.div>

        <h1
          className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-6"
          style={{ direction: "rtl" }}
        >
          يومك في قلبي لحظة بلحظة ✨
        </h1>

        <p className="text-lg mb-8 text-gray-700 leading-relaxed" style={{ direction: "rtl" }}>
          النهاردة مش يوم عادي النهاردة يومك وحبيت أعيشه معاكي بطريقتي الخاصة مستعدة؟
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={startJourney}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg w-full"
          >
            يلا نبدأ
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-8 text-sm text-gray-500"
      >
        دوسي على الزر عشان نبدأ
      </motion.div>
    </div>
  )
}

