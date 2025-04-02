"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Heart {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  opacity: number
}

export default function FallingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // إنشاء قلوب متساقطة
    const createHearts = () => {
      const newHearts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // موقع أفقي عشوائي
        size: Math.random() * 1 + 0.5, // حجم عشوائي
        delay: Math.random() * 10, // تأخير عشوائي
        duration: Math.random() * 10 + 10, // مدة عشوائية
        opacity: Math.random() * 0.5 + 0.3, // شفافية عشوائية
      }))

      setHearts(newHearts)
    }

    createHearts()

    // إعادة إنشاء القلوب كل 20 ثانية
    const interval = setInterval(createHearts, 20000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-red-500"
          style={{
            left: `${heart.x}%`,
            top: "-5%",
            fontSize: `${heart.size}rem`,
            opacity: heart.opacity,
          }}
          animate={{
            y: ["0vh", "105vh"],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  )
}

