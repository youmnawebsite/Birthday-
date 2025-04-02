"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"

// Import Confetti component with dynamic import to avoid SSR issues
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
})

export default function Noon() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [timer, setTimer] = useState(15)
  const [timerActive, setTimerActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  const questions = [
    {
      question: "إيه أكتر حاجة بتعصبني؟",
      options: ["الزن", "اخويا", "الفوضى", "الأكل البارد"],
      correctAnswer: "اخويا", // Replace with actual answer
    },
    {
      question: "لو طلبت بيتزا، هطلب إيه؟",
      options: ["رانش", "بيبروني", "سوبريم", "باربكيو"],
      correctAnswer: "رانش", // Replace with actual answer
    },
    {
      question: "إيه أكتر حاجه بحبها بتعمليها ",
      options: ["زربنتك ", "دلعك", "غبائك", "قمصك" ,  "عصبيتك"],
      correctAnswer: "دلعك "// Replace with actual answer
    }, 
    {
      question: "ايه اكتر حاجه بحبها في شكلك",
      options: ["عيونك", "خدودك", "شفايفك", "ضحكتك"],
      correctAnswer: "ضحكتك", // Replace with actual answer
    },
    {
      question: "إيه هو لوني المفضل؟",
      options: ["الأزرق", "الأخضر", "الأسود", "البنفسجي"],
      correctAnswer: "الأسود", // Replace with actual answer
    },
  ]

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(interval)
    } else if (timerActive && timer === 0) {
      handleAnswer()
    }
  }, [timerActive, timer])

  // Start timer on first render, but only after mounting
  useEffect(() => {
    if (mounted) {
      startTimer()
    }
  }, [mounted])

  const startTimer = () => {
    setTimer(15)
    setTimerActive(true)
  }

  const handleAnswer = () => {
    setTimerActive(false)

    if (!selectedOption) {
      // If time ran out without selection
      const newAnswers = [...answers, ""]
      setAnswers(newAnswers)
    } else {
      const newAnswers = [...answers, selectedOption]
      setAnswers(newAnswers)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption("")
      setTimeout(() => {
        startTimer()
      }, 500)
    } else {
      setShowResult(true)
      const correctCount = getCorrectAnswersCount()
      if (correctCount === questions.length) {
        setShowConfetti(true)
      }
    }
  }

  const getCorrectAnswersCount = () => {
    return answers.filter((answer, index) => answer === questions[index].correctAnswer).length
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setSelectedOption("")
    setShowConfetti(false)
    setTimeout(() => {
      startTimer()
    }, 500)
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
          <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full shadow-lg mb-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">😂</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
            شوية اسأله حب وضحك يعني 
          </h1>
          <p className="text-sm text-gray-500">شوفي تعرفيني قد ايه</p>
        </motion.div>

        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-amber-100">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">إنتي تعرفيني كويس؟</h2>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        timer <= 5 ? "bg-red-500" : timer <= 10 ? "bg-amber-500" : "bg-teal-500"
                      }`}
                    >
                      {timer}
                    </div>
                  </div>
                </div>

                <div className="relative mb-8 bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-lg">
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                    {currentQuestion + 1}
                  </div>
                  <p className="text-xl mb-4 pt-2">{questions[currentQuestion].question}</p>

                  <RadioGroup value={selectedOption} className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-2 space-x-reverse bg-white p-3 rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedOption(option)}
                      >
                        <RadioGroupItem id={`option-${index}`} value={option} />
                        <Label htmlFor={`option-${index}`} className="text-lg w-full cursor-pointer">
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    سؤال {currentQuestion + 1} من {questions.length}
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAnswer}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          السؤال التالي
                          <ArrowRight className="mr-2 h-5 w-5" />
                        </>
                      ) : (
                        "إنهاء الاختبار"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center">النتيجة!</h2>

                <div className="mb-8">
                  {getCorrectAnswersCount() === questions.length ? (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-teal-600 mb-4">إنتي أسطورة، عارفة كل حاجة عني! ❤️</p>
                      <div className="p-6 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg shadow-inner">
                        <p className="text-lg">جاوبتي على كل الاسئله يروحقلبي انتي تعرفيني اويييي🥹❤</p>
                      </div>
                    </div>
                  ) : getCorrectAnswersCount() > questions.length / 2 ? (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <HelpCircle className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-amber-600 mb-4">تقريباً عارفاني كويس😄</p>
                      <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-inner">
                        <p className="text-lg">
                          جاوبتي على {getCorrectAnswersCount()} من {questions.length} أسئلة صح
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <XCircle className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-red-500 mb-4">نو نو نو انتي كده متعرفنيشش😔</p>
                      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg shadow-inner">
                        <p className="text-lg">
                          جاوبتي على {getCorrectAnswersCount()} من {questions.length} صح أسئله!
                    </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={resetQuiz}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      حاولي مرة تانية
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

