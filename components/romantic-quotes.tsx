"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Heart } from "lucide-react"

export default function RomanticQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [mounted, setMounted] = useState(false)

  // قائمة من أبيات الشعر والأغاني المصرية
  const quotes = [
    {
      text: "يا حبيبي أيعقل أن تفرقنا المسافات، وتجمعنا الآهات، يا من ملكت قلبي ومُهجتي، يا من عشقتك وملأت دنيتي.",
      author: "نزار قباني",
    },
    {
      text: "إن كنتُ أهربُ من ظِلالي نَحوَ عَينيكِ الجميلتين، فلا تَسَلني كَيفَ أَصبَحتُ في دُنياكِ شيئًا مِن أَشيائي.",
      author: "فاروق جويدة",
    },
    {
      text: "أحبك فوق ما يصف الكلام، و يهجرني إذا غبتَ المنام، و يصحبني إذا أصبحتُ ظلاً، و يزرعني إذا كنتَ الغمام.",
      author: "محمود درويش",
    },
    {
      text: "لو أن حبكِ في قلبي يُزرعُ، لكان الوردُ لا يكفيني، ولو أن شوقي إليكِ يُروى، لكان البحرُ عطشانَ لحبي.",
      author: "إيليا أبو ماضي",
    },
    {
      text: "حبيبتي، لو خُيّرتُ بينَ أنفاسكِ أو عمري، لاخترتُ أن أتنفسكِ حتى آخر العمر.",
      author: "قيس بن الملوح",
    },
];

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  if (!mounted) return null

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow-md border border-purple-100">
        <div className="relative">
          <div className="absolute -top-3 -right-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-md">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-semibold text-center text-purple-700 mb-4">كلام حلو</h3>

            <div className="relative min-h-[150px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">"{quotes[currentQuote].text}"</p>
                  <p className="text-purple-600 font-medium">- {quotes[currentQuote].author}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center items-center mt-6 space-x-4 space-x-reverse">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-purple-200 hover:bg-purple-100"
                onClick={prevQuote}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="text-sm text-purple-600">
                {currentQuote + 1} / {quotes.length}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-purple-200 hover:bg-purple-100"
                onClick={nextQuote}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

