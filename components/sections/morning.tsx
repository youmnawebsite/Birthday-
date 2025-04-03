"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, Heart, Quote, Sun, Coffee } from "lucide-react"

export default function Morning() {
  const [showGift, setShowGift] = useState(false)
  const [activeQuote, setActiveQuote] = useState(0)
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

  // صباح الخير رسائل
  const morningMessages = [
    "صباح الخير يا أجمل ما في الدنيا كل سنة وانتي طيبة ومعايا يروحقلبي ❤️",
    "صباح النور على عيونك الحلوة، يومك قمر زي قلبك يا أحلى حاجة في حياتي",
    "صباح الخير يبنوتييي🥹❤❤",
    "صباح الهنا النهاردة يوم تحفه لأنه يوم ميلاد أغلى إنسانة في حياتي",
    "صباح الحب كل سنة وانتي معايا وقلبي معاكي دايمًا",
  ]

  // كلمات صباحية جميلة
  const morningQuotes = [
    {
      text: "أنتِ شمس صباحي وقمر ليلي كل سنة وانتي طيبة يحبيبتي",
      author: "من قلبي",
    },
    {
      text: "كل صباح بيكون أحلى لما بفتكر إنك في حياتي، عيد ميلاد سعيد",
      author: "من قلبي",
    },
    {
      text: "صباحك سكر زيك يومك فل زي قلبك، عيد ميلاد تحفه يا أحلى حاجة في الدنيا",
      author: "من قلبي",
    },
  ]

  useEffect(() => {
    setMounted(true)

    // تغيير الرسالة كل 5 ثواني
    if (showGift) {
      const interval = setInterval(() => {
        setActiveQuote((prev) => (prev + 1) % morningQuotes.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [showGift, morningQuotes.length])

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
          <p className="text-sm text-gray-500">بداية يوم مميز لقمر مميزه</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-teal-100">
              <div className="relative p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg mb-6">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-full shadow-md">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-xl text-gray-700 leading-relaxed pt-2">
                  {morningMessages[Math.floor(Math.random() * morningMessages.length)]}
                </p>
              </div>

              {!showGift ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setShowGift(true)}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg w-full"
                  >
                    <Gift className="ml-2 h-5 w-5" />
                    افتحي أول هدية
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
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-3 rounded-full shadow-md">
                        <Sun className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-center text-teal-700 mb-4">صباح الحب والحاجات الحلوه</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg shadow-inner">
                        <div className="flex items-center mb-3">
                          <Coffee className="h-5 w-5 text-teal-600 mr-2" />
                          <h4 className="font-medium text-teal-700">رغي الصبح </h4>
                        </div>
                        <p className="text-gray-700">
                          لو كنا سوا دلوقتي يبت يا يمنى و ف بيتنا كان زماني بعملك بروبوزيل من تاني وبتقدملك تاني واحبك تاني الفرق بقى بعد ما اطلعلك الخاتم وتوافقي هنحضن بعض حضن كبير اوي عادي ويارب ارزقنا ويخليكي ليا يا يومنتي 
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-inner">
                        <div className="flex items-center mb-3">
                          <Gift className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="font-medium text-blue-700">هدية الصبح كده</h4>
                        </div>
                        <p className="text-gray-700">
                          كل ثانيه معاكي هدية وكل يوم بيعدي وانتي في حياتي نعمة عيد ميلاد قمر شبهك يا أجمل هدية في حياتي
                        </p>
                      </div>
                    </div>

                    <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-inner mb-4">
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-2 rounded-full shadow-md">
                          <Quote className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeQuote}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="pt-2"
                        >
                          <p className="text-lg text-gray-700 mb-2">"{morningQuotes[activeQuote].text}"</p>
                          <p className="text-right text-amber-700 text-sm">{morningQuotes[activeQuote].author}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="text-center text-gray-500 text-sm">المسدجات بتتغير تلقائيًا كل 5 ثواني</div>
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

