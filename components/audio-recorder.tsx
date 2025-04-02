"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, Play, Pause, Save, Trash2, Loader2 } from "lucide-react"

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedAudios, setSavedAudios] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)

    // Load saved audios from localStorage
    const loadSavedAudios = () => {
      try {
        const saved = localStorage.getItem("saved_audios")
        if (saved) {
          setSavedAudios(JSON.parse(saved))
        }
      } catch (error) {
        console.error("Error loading saved audios:", error)
      }
    }

    loadSavedAudios()

    // Add a dummy audio element for testing
    if (!savedAudios.length) {
      const dummyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      setSavedAudios([dummyAudio])
      try {
        localStorage.setItem("saved_audios", JSON.stringify([dummyAudio]))
      } catch (error) {
        console.error("Error saving dummy audio:", error)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
          const url = URL.createObjectURL(audioBlob)
          setAudioURL(url)

          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop())
        } catch (error) {
          console.error("Error creating audio blob:", error)
          setError("حصل مشكلة في تسجيل الصوت، حاول تاني")
        }
      }

      // Start recording
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setError("مش قادر أوصل للميكروفون، اسمح للموقع باستخدام الميكروفون")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop()
        setIsRecording(false)

        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      } catch (error) {
        console.error("Error stopping recording:", error)
        setError("حصل مشكلة في إيقاف التسجيل، حاول تاني")
      }
    }
  }

  const playAudio = (url: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.src = url
        audioRef.current.onended = () => setIsPlaying(false)
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err)
          setError("مش قادر أشغل الصوت، حاول تاني")
        })
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setError("مش قادر أشغل الصوت، حاول تاني")
    }
  }

  const saveAudio = () => {
    if (audioURL) {
      setIsSaving(true)

      try {
        // For this demo, we'll just save to localStorage
        const newSavedAudios = [...savedAudios, audioURL]
        setSavedAudios(newSavedAudios)
        localStorage.setItem("saved_audios", JSON.stringify(newSavedAudios))

        setTimeout(() => {
          setIsSaving(false)
          // Reset for new recording
          setAudioURL(null)
        }, 1000)
      } catch (error) {
        console.error("Error saving audio:", error)
        setError("مش قادر أحفظ الصوت، حاول تاني")
        setIsSaving(false)
      } finally {
        setTimeout(() => {
          setIsSaving(false)
        }, 1000)
      }
    }
  }

  const discardAudio = () => {
    setAudioURL(null)
    setError(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!mounted) return null

  return (
    <Card className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg shadow-md border border-teal-100">
      <h3 className="text-xl font-semibold text-center text-teal-700 mb-4">سجل رسالة صوتية</h3>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {audioURL ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <audio src={audioURL} className="hidden" />

            <div className="flex justify-center mb-3">
              <Button
                onClick={() => playAudio(audioURL)}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-teal-200 hover:bg-teal-100"
              >
                {isPlaying ? <Pause className="h-6 w-6 text-teal-700" /> : <Play className="h-6 w-6 text-teal-700" />}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">دوس عشان تسمع التسجيل</div>
          </div>

          <div className="flex justify-center space-x-3 space-x-reverse">
            <Button
              onClick={saveAudio}
              disabled={isSaving}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  بيحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  احفظ التسجيل
                </>
              )}
            </Button>

            <Button onClick={discardAudio} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 ml-2" />
              امسح
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
            {isRecording ? (
              <>
                <div className="text-xl font-bold text-red-500 mb-2">{formatTime(recordingTime)}</div>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse mb-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-500">بيسجل دلوقتي...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                  <Mic className="h-8 w-8 text-teal-700" />
                </div>
                <p className="text-sm text-gray-500">دوس على الزر عشان تبدأ تسجل</p>
              </>
            )}
          </div>

          <div className="flex justify-center">
            {isRecording ? (
              <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white">
                <Square className="h-4 w-4 ml-2" />
                وقف التسجيل
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                <Mic className="h-4 w-4 ml-2" />
                ابدأ التسجيل
              </Button>
            )}
          </div>
        </div>
      )}

      {savedAudios.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-teal-700 mb-3">التسجيلات المحفوظة</h4>
          <div className="space-y-2">
            {savedAudios.map((url, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center ml-3">
                  <Mic className="h-4 w-4 text-teal-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">تسجيل {index + 1}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-teal-50"
                  onClick={() => playAudio(url)}
                >
                  {isPlaying && audioRef.current?.src === url ? (
                    <Pause className="h-4 w-4 text-teal-700" />
                  ) : (
                    <Play className="h-4 w-4 text-teal-700" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

