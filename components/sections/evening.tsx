"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import LoveLetter from "@/components/love-letter"

export default function Evening() {
  const [showGift, setShowGift] = useState(false)
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([])
  const [mounted, setMounted] = useState(false)

  // Pre-populated content
const wishContent = {
  title: "رسالة مني🌚",
  content: `حبيبة قلبي يا أجمل حاجة في الدنيا

كل سنة وانتي معايا يا روحي النهاردة مش عيد ميلاد عادي ده يوم مميز عشان انتي فيه معايا بحس إن الدنيا كلها حلوة عشانك انتي بس انتي دايمًا معايا ودي أكبر نعمة في حياتي

أنا مش عارف أقولك إيه غير إنك كل حاجة بالنسبة لي انتي مش بس حبيبتي انتي صاحبتي وأختي وأمي وكل حاجة حلوة في حياتي بحبك من قلبي وبشكر ربنا كل يوم إنه رزقني بيكي

يا رب السنة دي تبقي أحلى سنة ليكي ويحققلك فيها كل اللي نفسك فيه وتفضلي دايمًا معايا نضحك سوا ونعيش أحلى لحظات مع بعض

كل سنة وانتي طيبة وكل سنة وانتي في حياتي يا أجمل نعمة في الدنيا`,

  signature: "مزونتك اللي بيحبك جدًا",
}

  useEffect(() => {
    setMounted(true)

    // Create random stars
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 3,
    }))
    setStars(newStars)
  }, [])

  const handleWishSubmitted = () => {
    setShowGift(true)
  }

  const resetWish = () => {
    setShowGift(false)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col items-center" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 w-full"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-full shadow-lg mb-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">✨</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            رسالة خاصة
          </h1>
          <p className="text-sm text-gray-500">كلمات من القلب في يومك المميز</p>
        </motion.div>

        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-purple-100 overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {stars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400"
                style={{
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  fontSize: `${star.size}rem`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  delay: star.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Star className="h-3 w-3 fill-current" />
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <LoveLetter title={wishContent.title} content={wishContent.content} signature={wishContent.signature} />
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

