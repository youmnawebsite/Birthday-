"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import ReactConfetti dynamically to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
})

export default function Confetti() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [pieces, setPieces] = useState(200)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial dimensions
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Reduce confetti pieces over time
    const timer = setTimeout(() => {
      setPieces(50)
    }, 3000)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  // Only render after client-side hydration
  if (!mounted) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={pieces}
      gravity={0.15}
      colors={["#0d9488", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]}
    />
  )
}

