"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { RefreshCw, Star, Heart, Music, Sun, Moon, Cloud, Smile } from "lucide-react"

// أنواع البطاقات المتاحة في اللعبة
const cardTypes = [
  { id: 1, icon: <Star className="h-8 w-8" />, color: "text-yellow-500" },
  { id: 2, icon: <Heart className="h-8 w-8" />, color: "text-red-500" },
  { id: 3, icon: <Music className="h-8 w-8" />, color: "text-blue-500" },
  { id: 4, icon: <Sun className="h-8 w-8" />, color: "text-amber-500" },
  { id: 5, icon: <Moon className="h-8 w-8" />, color: "text-indigo-500" },
  { id: 6, icon: <Cloud className="h-8 w-8" />, color: "text-sky-500" },
  { id: 7, icon: <Smile className="h-8 w-8" />, color: "text-green-500" },
  { id: 8, icon: <RefreshCw className="h-8 w-8" />, color: "text-purple-500" },
]

// إنشاء مصفوفة البطاقات مع كل بطاقة مكررة مرة واحدة
const createCards = () => {
  // نضاعف البطاقات لإنشاء أزواج
  const duplicatedCards = [...cardTypes, ...cardTypes]

  // نخلط البطاقات بشكل عشوائي
  return duplicatedCards.map((card) => ({ ...card, key: Math.random() })).sort(() => Math.random() - 0.5)
}

export default function MemoryGame() {
  const [cards, setCards] = useState<any[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  // تهيئة اللعبة
  useEffect(() => {
    setMounted(true)
    resetGame()
  }, [])

  const resetGame = () => {
    setCards(createCards())
    setFlippedIndices([])
    setMatchedPairs([])
    setMoves(0)
    setGameComplete(false)
  }

  // التحقق من تطابق البطاقات المقلوبة
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices

      // زيادة عدد المحاولات
      setMoves((moves) => moves + 1)

      // التحقق من تطابق البطاقتين
      if (cards[firstIndex].id === cards[secondIndex].id) {
        // إضافة البطاقات المتطابقة إلى القائمة
        setMatchedPairs([...matchedPairs, cards[firstIndex].id])
        // إعادة تعيين البطاقات المقلوبة
        setFlippedIndices([])
      } else {
        // إذا لم تتطابق البطاقات، انتظر قليلاً ثم اقلبها مرة أخرى
        setTimeout(() => {
          setFlippedIndices([])
        }, 1000)
      }
    }
  }, [flippedIndices, cards])

  // التحقق من اكتمال اللعبة
  useEffect(() => {
    if (matchedPairs.length === cardTypes.length && mounted) {
      setGameComplete(true)
    }
  }, [matchedPairs, mounted])

  // التعامل مع النقر على البطاقة
  const handleCardClick = (index: number) => {
    // لا تفعل شيئًا إذا كانت البطاقة مقلوبة بالفعل أو تم العثور على زوجها
    if (flippedIndices.includes(index) || matchedPairs.includes(cards[index].id) || flippedIndices.length >= 2) {
      return
    }

    // قلب البطاقة
    setFlippedIndices([...flippedIndices, index])
  }

  // التحقق مما إذا كانت البطاقة مقلوبة
  const isCardFlipped = (index: number) => {
    return flippedIndices.includes(index) || matchedPairs.includes(cards[index].id)
  }

  if (!mounted || cards.length === 0) return null

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md border border-blue-100">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">لعبة الذاكرة</h3>
        <p className="text-sm text-gray-600 mb-4">افتكر مكان كل صورة وطابقها مع زوجها</p>

        <div className="flex justify-between items-center mb-4">
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
            <p className="text-sm font-medium">المحاولات: {moves}</p>
          </div>

          <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
            <p className="text-sm font-medium">
              الأزواج: {matchedPairs.length}/{cardTypes.length}
            </p>
          </div>
        </div>
      </div>

      {gameComplete ? (
        <div className="text-center py-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-white" fill="white" />
          </div>
          <h3 className="text-xl font-bold text-green-600 mb-2">شطورهههه! 🎉</h3>
          <p className="text-gray-600 mb-4">انتي كسبتي اللعبة في {moves} محاولة</p>

          <Button
            onClick={resetGame}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            العبي تاني
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(index)}
              className="aspect-square cursor-pointer"
            >
              <div
                className={`w-full h-full rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isCardFlipped(index) ? `bg-white ${card.color}` : "bg-gradient-to-r from-blue-400 to-purple-400"
                }`}
              >
                {isCardFlipped(index) ? card.icon : <span className="text-white text-2xl">؟</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!gameComplete && (
        <div className="flex justify-center">
          <Button onClick={resetGame} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <RefreshCw className="h-4 w-4 ml-2" />
            ابدأي من جديد
          </Button>
        </div>
      )}
    </Card>
  )
}

