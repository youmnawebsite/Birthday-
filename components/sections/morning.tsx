"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, Music, Mic, Heart, Play, Pause } from "lucide-react"
import AudioRecorder from "@/components/audio-recorder"

export default function Morning() {
  const [showGift, setShowGift] = useState(false)
  const [activeTab, setActiveTab] = useState("music")
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Pre-populated content
  const morningContent = {
    music: {
      title: "أغنية ليكي ",
      description: "أغنية اخترتها عشان اليوم الحلو ده",
    },
    voice: {
      title: "رسالة عالصبح",
      description: "الرساله مني يعني",
    },
  }

  useEffect(() => {
    setMounted(true)

    // Initialize audio elements with default audio
    if (typeof window !== "undefined") {
      // Using built-in browser audio capabilities with your custom song
      musicAudioRef.current = new Audio("/public/song.mp3")
      voiceAudioRef.current = new Audio("/public/song.mp3")

      // Add event listeners
      const musicAudio = musicAudioRef.current
      const voiceAudio = voiceAudioRef.current

      if (musicAudio) {
        musicAudio.addEventListener("ended", () => setIsPlayingMusic(false))
      }

      if (voiceAudio) {
        voiceAudio.addEventListener("ended", () => setIsPlayingVoice(false))
      }

      // Cleanup
      return () => {
        if (musicAudio) {
          musicAudio.pause()
          musicAudio.removeEventListener("ended", () => setIsPlayingMusic(false))
        }

        if (voiceAudio) {
          voiceAudio.pause()
          voiceAudio.removeEventListener("ended", () => setIsPlayingVoice(false))
        }
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!musicAudioRef.current) return

    if (isPlayingMusic) {
      musicAudioRef.current.pause()
    } else {
      // Pause voice message if playing
      if (isPlayingVoice && voiceAudioRef.current) {
        voiceAudioRef.current.pause()
        setIsPlayingVoice(false)
      }

      musicAudioRef.current.play().catch((err) => console.error("Error playing music:", err))
    }

    setIsPlayingMusic(!isPlayingMusic)
  }

  const toggleVoice = () => {
    if (!voiceAudioRef.current) return

    if (isPlayingVoice) {
      voiceAudioRef.current.pause()
    } else {
      // Pause music if playing
      if (isPlayingMusic && musicAudioRef.current) {
        musicAudioRef.current.pause()
        setIsPlayingMusic(false)
      }

      voiceAudioRef.current.play().catch((err) => console.error("Error playing voice message:", err))
    }

    setIsPlayingVoice(!isPlayingVoice)
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
          <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 p-3 rounded-full shadow-lg mb-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">🌤️</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            أجمل بداية
          </h1>
          <p className="text-sm text-gray-500">بداية يوم مميز لشخص مميز</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-teal-100">
              <div className="relative p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg mb-6">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-full shadow-md">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-xl text-gray-700 leading-relaxed pt-2">
                  بما إن النهارده عيد ميلادك، فأنا قررت أكون صوت صباحك القمر: صباح الخير يا أحلى حاجة حصلت في الدنيا!
                </p>
              </div>

              {!showGift ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setShowGift(true)}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg w-full"
                  >
                    <Gift className="ml-2 h-5 w-5" />
                    افتح أول هدية
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="gift"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <Card className="p-6 bg-white border border-teal-100 shadow-md">
                    <div className="flex justify-center mb-4 border-b pb-3">
                      <div className="flex space-x-2 space-x-reverse bg-gray-100 p-1 rounded-full">
                        <Button
                          variant={activeTab === "music" ? "default" : "ghost"}
                          size="sm"
                          className={`rounded-full ${activeTab === "music" ? "bg-gradient-to-r from-teal-500 to-blue-500" : ""}`}
                          onClick={() => setActiveTab("music")}
                        >
                          <Music className="h-4 w-4 ml-1" />
                          موسيقى
                        </Button>
                        <Button
                          variant={activeTab === "voice" ? "default" : "ghost"}
                          size="sm"
                          className={`rounded-full ${activeTab === "voice" ? "bg-gradient-to-r from-teal-500 to-blue-500" : ""}`}
                          onClick={() => setActiveTab("voice")}
                        >
                          <Mic className="h-4 w-4 ml-1" />
                          رسالة صوتية
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {activeTab === "music" && (
                        <motion.div
                          key="music"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 text-center">
                            <p className="text-gray-700 mb-2 font-medium">{morningContent.music.title}</p>
                            <div className="h-24 flex items-center justify-center border border-dashed border-teal-200 rounded bg-white/80">
                              <div className="flex flex-col items-center justify-center w-full">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-12 w-12 rounded-full bg-teal-100 hover:bg-teal-200 mb-2"
                                  onClick={toggleMusic}
                                >
                                  {isPlayingMusic ? (
                                    <Pause className="h-6 w-6 text-teal-700" />
                                  ) : (
                                    <Play className="h-6 w-6 text-teal-700" />
                                  )}
                                </Button>
                                <p className="text-sm text-teal-700">
                                  {isPlayingMusic ? "إيقاف الأغنية" : "تشغيل الأغنية"}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{morningContent.music.description}</p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "voice" && (
                        <motion.div
                          key="voice"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <AudioRecorder />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

