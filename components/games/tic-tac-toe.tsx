"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine(lines[i])
        return squares[a]
      }
    }

    return null
  }

  const handleClick = (i: number) => {
    if (winner || board[i]) return

    const newBoard = [...board]
    newBoard[i] = isXNext ? "X" : "O"
    setBoard(newBoard)
    setIsXNext(!isXNext)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
    } else if (!newBoard.includes(null)) {
      // تعادل
      setWinner("تعادل")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine(null)
  }

  const renderSquare = (i: number) => {
    const isWinningSquare = winningLine?.includes(i)

    return (
      <motion.button
        className={`w-full h-20 text-3xl font-bold flex items-center justify-center bg-white border border-gray-200 ${
          isWinningSquare ? "bg-green-100" : ""
        }`}
        onClick={() => handleClick(i)}
        whileHover={{ scale: board[i] ? 1 : 1.05 }}
        whileTap={{ scale: board[i] ? 1 : 0.95 }}
        disabled={!!board[i] || !!winner}
      >
        {board[i] === "X" ? (
          <span className="text-blue-500">X</span>
        ) : board[i] === "O" ? (
          <span className="text-red-500">O</span>
        ) : null}
      </motion.button>
    )
  }

  const getStatusMessage = () => {
    if (winner === "X") {
      return "انت كسبت! 🎉"
    } else if (winner === "O") {
      return "الكمبيوتر كسب! 😢"
    } else if (winner === "تعادل") {
      return "تعادل! 🤝"
    } else {
      return `دورك يا ${isXNext ? "X" : "O"}`
    }
  }

  // محاكاة حركة الكمبيوتر
  useEffect(() => {
    if (!isXNext && !winner && mounted) {
      const timer = setTimeout(() => {
        const emptySquares = board.map((square, index) => (square === null ? index : null)).filter((i) => i !== null)

        if (emptySquares.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptySquares.length)
          handleClick(emptySquares[randomIndex] as number)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isXNext, winner, board, mounted])

  if (!mounted) return null

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md border border-blue-100">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">لعبة إكس أو</h3>
        <p className="text-sm text-gray-600 mb-4">العب ضد الكمبيوتر</p>

        <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
          <p className="text-lg font-medium">{getStatusMessage()}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array(9)
          .fill(null)
          .map((_, i) => (
            <div key={i}>{renderSquare(i)}</div>
          ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={resetGame} className="bg-gradient-to-r from-blue-500 to-purple-500">
          <RefreshCw className="h-4 w-4 ml-2" />
          لعبة جديدة
        </Button>
      </div>
    </Card>
  )
}

