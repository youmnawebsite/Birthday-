"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Heart, Gift, Play, Pause } from "lucide-react"
import dynamic from "next/dynamic"

// Import Confetti component with dynamic import to avoid SSR issues
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
})

export default function Night() {
  const [showFinalGift, setShowFinalGift] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Mark component as mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate countdown to next birthday
  useEffect(() => {
    if (!mounted) return

    const calculateTimeLeft = () => {
      // Set next birthday - using a fixed date for the demo
      const nextBirthday = new Date()
      nextBirthday.setMonth(nextBirthday.getMonth() + 1) // Set to one month from now for demo
      nextBirthday.setDate(nextBirthday.getDate() + 5) // Add 5 days

      const difference = +nextBirthday - +new Date()

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [mounted])

  const handleOpenGift = () => {
    setShowFinalGift(true)
    setTimeout(() => {
      setShowConfetti(true)
    }, 500)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Only render after client-side hydration
  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center" dir="rtl">
      {showConfetti && <Confetti />}

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
          <div className="inline-block bg-gradient-to-r from-indigo-400 to-blue-500 p-3 rounded-full shadow-lg mb-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">💙</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            الكلام اللي ميكفيش
          </h1>
          <p className="text-sm text-gray-500">نهاية يوم مميز</p>
        </motion.div>

        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
          <div className="mb-8">
            <div className="relative p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg mb-6 shadow-inner border border-indigo-100">
              <div className="absolute -top-3 -right-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-full shadow-md">
                  <Heart className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed pt-2">
                اليوم خلص بس وجودك في حياتي مبيخلصش قلبي عايز يشكرك على كل لحظة بتعيشيها وعلى كل حاجة صغيرة بتعمليها ليا انتي مش يوم في السنة انتي كل يوم بالنسبالي يا اميرتي❤.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!showFinalGift ? (
                <motion.div
                  key="gift-button"
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleOpenGift}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Gift className="ml-2 h-5 w-5" />
                    افتحي المفاجأة الأخيرة
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="final-gift"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg shadow-inner border border-indigo-100">
                    {/* Video/Image placeholder */}
                    <div className="mb-6">
                      <div className="relative h-64 rounded-lg overflow-hidden mb-4 shadow-md">
                        <Image
                          src="https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=1470&auto=format&fit=crop"
                          alt="المفاجأة الأخيرة"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white"
                            onClick={togglePlay}
                          >
                            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white/80 p-5 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-3">رسالة خاصة</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                          يا حبي الوحيد يا أجمل حاجة حصلتلي في حياتي يا أحلى صدفة خلت كل حاجة في الدنيا تبقى ليها معنى كل سنة وانتي أحلى وأجمل وأغلى حاجة في حياتي كل سنة وانتي اللي بتنور أيامي وبتحلي كل حاجة حواليَّا كل سنة وانتي الحب اللي مالي قلبي والونس اللي في حياتي والسند اللي عمري ما كنت متخيله يكون موجود بالشكل ده النهاردة مش يوم عادي ده اليوم اللي ربنا قرر فيه يخليني محظوظ أكتر مما كنت أتخيل وينور حياتي بيكي ويخليني أحب وأتحب بالشكل اللي كنت بتمناه وأكتر بكتير
أنا مش عارف أقول إيه غير إني فعلاً بجد محظوظ إنك في حياتي محظوظ إني بحبك ومحظوظ أكتر إنك بتحبيني محظوظ إني بعيش معاكي كل لحظة حلوة ومش حلوة وألاقيكي دايماً معايا بتحسي بيا بتحسي بمشاعري وبأفكاري وبتعرفي تفرقِ بين لما أكون محتاج أتكلم ولما أكون محتاج حضن أو مجرد وجودك جنبي من غير كلام انتي اللي بتحلي الأيام واللي بتدي للحياة طعم واللي مهما كنت متضايق أو مضغوط ضحكتك بتمسح أي هم وأي تعب انتي اللي لما بتكلمك بحس إني مرتاح حتى لو الدنيا كلها فوق دماغي ولما ببص في عنيكي بحس إن العالم كله وقف وإن مفيش حاجة تفرق مادام انتي معايا

انتي أكتر حد بيفرحني في الدنيا بحب طريقتك في الكلام بحب حركاتك العشوائية بحب طريقتك وانتي بتزعقي لي بحب لما تتدلعي عليا فجأة بحب كل تفصيلة فيكي بحب ضحكتك اللي بتملى قلبي بحب لما تتكلمي في حاجات غريبة ملهاش معنى بس صوتك بيكون حلو بحب لما تفكري في حاجة بجدية تامة وكأنها أخطر حاجة في العالم وهي في الحقيقة مش مستاهلة بس حماسك بيكون جميل بحب نظرتك لما تبصيلي بحب لما تعيطي بحب لما تضحكي بحب لما تتكلمي بحب حتى لما تتجاهليني لما بتتضيقي مني

أنا فخور بيكي فخور بكل حاجة بتعمليها فخور بإصرارك وبعزيمتك وبشخصيتك اللي مهما كانت بتحس أوقات إنها مش كفاية بس هي أعظم من أي حاجة تانية أنا شايف فيكي كل الحاجات اللي عمري ما كنت متخيل إني هشوفها في حد واحد شايف فيكي الحبيبة والصديقة والأمان والونس والسند والفرحة شايف فيكي كل حاجة حلوة في الدنيا وأكتر

أنا نفسي في السنة الجديدة دي تبقي مبسوطة أكتر وتضحكي أكتر وتحسي إنك أجمل وأهم حد في الدنيا لإنك فعلاً كده مش علشاني بس علشان انتي تستحقي كل الحب والفرحة اللي في العالم كله نفسي أشوف عنيكي بتلمع بالفرحة كل يوم مش بس النهاردة وأفضل أحبك وأحميكي وأكون جنبك في كل لحظة نفسي كل سنة وانتي بتكبري وتحققي أكتر وتوصلي لحاجات أكتر وتفضلي أحلى وأجمل وأغلى ما في حياتي

بحبك يا قلبي بحبك بجد بكل حاجة فيا بحبك فوق أي كلام وأي وصف بحبك بطريقة تخلي كل يوم في حياتي ليه معنى وطعم بحبك لإنك انتي انتي بكل تفاصيلك بكل حركاتك بكل طريقة كلامك بكل حاجة فيكي بحبك لإنك أنتي أجمل وأغلى وأحلى حد في الدنيا كلها وعيد ميلاد عسل زيك يا أجمل هدية في حياتي

.
                        </p>
                      </div>
                    </div>

                    {/* Countdown to next birthday */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-indigo-700 mb-3">باقي على عيد ميلادك الجاي 
                      (لو طلع بايظ يعني متاخديش بالك)</h3>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-indigo-600">{countdown.days}</div>
                          <div className="text-xs text-gray-500">يوم</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-indigo-600">{countdown.hours}</div>
                          <div className="text-xs text-gray-500">ساعة</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-indigo-600">{countdown.minutes}</div>
                          <div className="text-xs text-gray-500">دقيقة</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-indigo-600">{countdown.seconds}</div>
                          <div className="text-xs text-gray-500">ثانية</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

