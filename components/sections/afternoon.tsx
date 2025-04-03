"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Quote, Gift, Gamepad } from "lucide-react"
import RomanticQuotes from "@/components/romantic-quotes"
import MemoryGame from "@/components/games/memory-game"

export default function Afternoon() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pre-defined special moments
  const specialMoments = [
    {
      id: 1,
      title: "أول مره اشوفك",
      description:
        "اول مره شوفتك بقى كان اول يوم نزلت فيه الدراما تحت تقريبا او تاني يوم كنتي داخله انتي وتقى وموده دخلتو بتسلمو عالمستر وهو بيحاول يفتكر اساميكم وكده ف انا كنت بصيت كده بصه كانت حلوه اوي عشان كنت شايفك كده يعني شايفك حلوه اوي اوي اوي اوي بجد يعني شايفك ان ملامحك حلوه وطريقتك كمان تحفه كانت دي اول مره اشوفك فيها",
      icon: <Heart className="h-5 w-5 text-red-500" />,
    },
    {
      id: 2,
      title: "أول هدية",
      description:
        "انتي اللي جيبتي اول هديه بعيدا عن الحاجات الثغنتوتته اللي بجيبهالك واللي هجيبهالك يعني اما اقابلك اول هديه يعني هي جت في وقت مكناش عاوزينها تيجي فيه بس صدقيني انا مقصر في ردة فعلي ب انبساطي بالهديه لأنها محفظه وهي اللي بستخدمها والله وبفتكرك كل مره وكمان حاطط الورقه القمر بتاعتك فيها الهديتين دول هيفضلو في دماغي طول حياتي",
      icon: <Gift className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 3,
      title: "أول ضحكة",
      description:
        "اول ضحكه دي يعني بردو بعتبرها وقت اما صورتيني بعدها انتي كنتي بنضحكي ضحكتي كتير اوي وعجبتني ضحكتك اوي اوي وكمان واحنا نازلين ضحكنا بردو وكمان لما كنا بنبص لبعض ونضحك لما كنت بنكشك وابعتلك فالشات واحنا قصاد بعض",
      icon: <Quote className="h-5 w-5 text-blue-500" />,
    },
  ]

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
          <div className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-full shadow-lg mb-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">💖</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            لحظات حلوة
          </h1>
          <p className="text-sm text-gray-500">ذكريات وكلام من القلب</p>
        </motion.div>

        <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <AnimatePresence mode="wait">
            {activeSection === null ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => setActiveSection("quotes")}
                  >
                    <Card className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 h-full border-none shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-md mb-4">
                          <Quote className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">كلام حلو</h3>
                        <p className="text-gray-600">شوية ابيات شعر بقى من الأخر</p>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => setActiveSection("moments")}
                  >
                    <Card className="bg-gradient-to-r from-teal-100 to-green-100 p-6 h-full border-none shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gradient-to-r from-teal-500 to-green-500 p-3 rounded-full shadow-md mb-4">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">ذكريات حلوة</h3>
                        <p className="text-gray-600">لحظات مش هننساها</p>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => setActiveSection("game")}
                  >
                    <Card className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 h-full border-none shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full shadow-md mb-4">
                          <Gamepad className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">لعبة ثغنتوتته</h3>
                        <p className="text-gray-600"> يلا نلعب شوية يبنوتي</p>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            ) : activeSection === "quotes" ? (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-purple-700">كلام حلو</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveSection(null)}
                    className="hover:bg-purple-50"
                  >
                    رجوع
                  </Button>
                </div>

                <RomanticQuotes />
              </motion.div>
            ) : activeSection === "game" ? (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-amber-600">لعبة صغيرة</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveSection(null)}
                    className="hover:bg-amber-50"
                  >
                    رجوع
                  </Button>
                </div>

                <MemoryGame />
              </motion.div>
            ) : (
              <motion.div
                key="moments"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-teal-700">ذكريات حلوة</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)} className="hover:bg-teal-50">
                    رجوع
                  </Button>
                </div>

                <div className="space-y-4">
                  {specialMoments.map((moment) => (
                    <motion.div
                      key={moment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: moment.id * 0.1 }}
                    >
                      <Card className="p-4 bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100">
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm ml-3">{moment.icon}</div>
                          <div>
                            <h3 className="text-lg font-medium text-teal-700 mb-1">{moment.title}</h3>
                            <p className="text-gray-600">{moment.description}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

