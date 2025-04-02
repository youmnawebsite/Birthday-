"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface LoveLetterProps {
  title: string
  content: string
  signature?: string
}

export default function LoveLetter({ title, content, signature = "حبيبك" }: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <Card className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-lg shadow-md border border-red-200">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-red-700">{title}</h3>
                <p className="text-red-600 text-sm">انقر لفتح الرسالة</p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white w-full"
                  >
                    افتح الرسالة
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-white p-6 rounded-lg shadow-lg border border-red-200">
              <div className="relative">
                <div className="absolute -top-3 -right-3">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full shadow-md">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <h3 className="text-xl font-semibold text-red-700 text-center">{title}</h3>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-lg border border-red-100 shadow-inner">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
                  </div>

                  <div className="text-right mt-4 text-red-600 font-medium">{signature}</div>

                  <div className="mt-6 text-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        إغلاق الرسالة
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

