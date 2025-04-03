"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Sparkles, Send } from "lucide-react"
import LoveLetter from "@/components/love-letter"
import { Textarea } from "@/components/ui/textarea"

export default function Evening() {
  const [showGift, setShowGift] = useState(false)
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([])
  const [mounted, setMounted] = useState(false)
  const [showWishForm, setShowWishForm] = useState(false)
  const [wish, setWish] = useState("")
  const [savedWishes, setSavedWishes] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWishSuccess, setShowWishSuccess] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

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

    // Load saved wishes from localStorage
    const loadSavedWishes = () => {
      try {
        const saved = localStorage.getItem("birthday_wishes")
        if (saved) {
          setSavedWishes(JSON.parse(saved))
        }
      } catch (error) {
        console.error("Error loading saved wishes:", error)
      }
    }

    loadSavedWishes()
  }, [])

  const handleWishSubmitted = () => {
    if (!wish.trim()) return

    setIsSubmitting(true)

    // Save wish to localStorage
    try {
      const newWishes = [...savedWishes, wish]
      setSavedWishes(newWishes)
      localStorage.setItem("birthday_wishes", JSON.stringify(newWishes))

      // Show success animation
      setShowWishSuccess(true)

      // Create shooting stars effect
      createShootingStars()

      // Reset form after delay
      setTimeout(() => {
        setWish("")
        setIsSubmitting(false)
        setShowWishSuccess(false)
        setShowWishForm(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving wish:", error)
      setIsSubmitting(false)
    }
  }

  const createShootingStars = () => {
    // Scroll to form if it exists
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" })
    }
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
            رساله مني🌚
          </h1>
          <p className="text-sm text-gray-500">كلام من قلبي في يومك التحفه</p>
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

        {/* New Wish Feature */}
        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-full shadow-md mb-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              أمنيتك 
            </h2>
            <p className="text-sm text-gray-500 mt-1">اكتبي أمنيتك وشوفي السحر</p>
          </div>

          {!showWishForm ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setShowWishForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg w-full"
              >
                <Star className="ml-2 h-5 w-5" />
                اكتبي أمنيتك
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
              ref={formRef}
            >
              <div className="relative">
                <Textarea
                  placeholder="اكتبي أمنيتك هنا..."
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  className="min-h-[120px] text-right border-purple-200 focus:border-purple-400"
                  disabled={isSubmitting || showWishSuccess}
                />

                <AnimatePresence>
                  {showWishSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm flex items-center justify-center rounded-md"
                    >
                      <div className="text-center text-white">
                        <Sparkles className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-lg font-semibold">تم حفظ أمنيتك!</p>
                        <p className="text-sm opacity-80">يارب تتحقق قريب ❤️</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex space-x-3 space-x-reverse">
                <Button
                  onClick={handleWishSubmitted}
                  disabled={!wish.trim() || isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                      جاري الحفظ...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      ابعتي أمنيتك
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowWishForm(false)}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
              </div>
            </motion.div>
          )}

          {/* Display saved wishes */}
          {savedWishes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-purple-700 mb-3">أمنياتك السابقة</h3>
              <div className="space-y-3">
                {savedWishes.map((savedWish, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-start">
                        <div className="bg-white p-1.5 rounded-full shadow-sm ml-3">
                          <Star className="h-4 w-4 text-purple-500" />
                        </div>
                        <p className="text-gray-700">{savedWish}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Starry Night Animation */}
        <div className="relative h-40 w-full max-w-2xl mx-auto overflow-hidden rounded-xl bg-gradient-to-b from-indigo-900 to-purple-900 mb-8">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">ليلة مليانه نجوم وأمنيات وجو الساحره الشريره ده</h3>
              <p className="text-sm opacity-80">كل نجمة في السما شايله أمنية ليكي</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

