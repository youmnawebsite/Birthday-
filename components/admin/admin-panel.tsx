"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getWishes, getMemories, getUploadedImages, saveMemory, saveWish } from "@/lib/supabase"
import { put } from "@vercel/blob"
import { Upload, Loader2, Check, X, Music, Mic } from "lucide-react"

export default function AdminPanel() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [wishes, setWishes] = useState<any[]>([])
  const [memories, setMemories] = useState<any[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [audioUploadStatus, setAudioUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null)
  const [newWishText, setNewWishText] = useState("")
  const [newMemoryText, setNewMemoryText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  // كلمة المرور البسيطة للوصول إلى لوحة الإدارة
  const correctPassword = "admin123" // يمكنك تغييرها إلى كلمة مرور أكثر أمانًا

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === correctPassword) {
      setIsAuthenticated(true)
      loadData()
    } else {
      alert("كلمة المرور غير صحيحة")
    }
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      const wishesData = await getWishes()
      const memoriesData = await getMemories()
      const imagesData = await getUploadedImages()

      setWishes(wishesData)
      setMemories(memoriesData)
      setImages(imagesData)
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadStatus("uploading")
    setUploadError(null)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExtension = file.name.split(".").pop()
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

        // رفع الملف إلى Vercel Blob
        const blob = await put(uniqueFilename, file, {
          access: "public",
        })

        // حفظ رابط الصورة في قاعدة البيانات
        await fetch("/api/admin/save-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: blob.url }),
        })
      }

      setUploadStatus("success")
      // إعادة تحميل الصور بعد الرفع
      const imagesData = await getUploadedImages()
      setImages(imagesData)

      // إعادة تعيين حالة الرفع بعد 3 ثوانٍ
      setTimeout(() => {
        setUploadStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("خطأ في رفع الصور:", error)
      setUploadStatus("error")
      setUploadError(error instanceof Error ? error.message : "حدث خطأ أثناء رفع الصور")
    } finally {
      // إعادة تعيين حقل الملف
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setAudioUploadStatus("uploading")
    setAudioUploadError(null)

    try {
      const file = files[0]
      const fileExtension = file.name.split(".").pop()
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

      // رفع الملف إلى Vercel Blob
      const blob = await put(uniqueFilename, file, {
        access: "public",
      })

      setAudioUploadStatus("success")

      // إعادة تعيين حالة الرفع بعد 3 ثوانٍ
      setTimeout(() => {
        setAudioUploadStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("خطأ في رفع الملف الصوتي:", error)
      setAudioUploadStatus("error")
      setAudioUploadError(error instanceof Error ? error.message : "حدث خطأ أثناء رفع الملف الصوتي")
    } finally {
      // إعادة تعيين حقل الملف
      if (audioInputRef.current) {
        audioInputRef.current.value = ""
      }
    }
  }

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWishText.trim()) return

    try {
      await saveWish({
        name: "المدير",
        message: newWishText.trim(),
      })

      setNewWishText("")
      loadData() // إعادة تحميل البيانات
    } catch (error) {
      console.error("خطأ في إضافة أمنية:", error)
    }
  }

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemoryText.trim()) return

    try {
      await saveMemory({
        text: newMemoryText.trim(),
      })

      setNewMemoryText("")
      loadData() // إعادة تحميل البيانات
    } catch (error) {
      console.error("خطأ في إضافة ذكرى:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">لوحة الإدارة</h1>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">لوحة إدارة موقع عيد الميلاد</h1>

        <Tabs defaultValue="images">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="images">الصور</TabsTrigger>
            <TabsTrigger value="audio">الملفات الصوتية</TabsTrigger>
            <TabsTrigger value="wishes">الأمنيات</TabsTrigger>
            <TabsTrigger value="memories">الذكريات</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">رفع صور جديدة</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploadStatus === "uploading"}
                    className="hidden"
                    id="image-upload"
                    ref={fileInputRef}
                  />
                  <Label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${
                      uploadStatus === "success"
                        ? "border-green-500 bg-green-50"
                        : uploadStatus === "error"
                          ? "border-red-500 bg-red-50"
                          : "border-blue-300 hover:border-blue-500"
                    }`}
                  >
                    {uploadStatus === "uploading" ? (
                      <>
                        <Loader2 className="h-6 w-6 ml-2 animate-spin" />
                        <span>جاري رفع الصور...</span>
                      </>
                    ) : uploadStatus === "success" ? (
                      <>
                        <Check className="h-6 w-6 ml-2 text-green-500" />
                        <span className="text-green-600">تم رفع الصور بنجاح</span>
                      </>
                    ) : uploadStatus === "error" ? (
                      <>
                        <X className="h-6 w-6 ml-2 text-red-500" />
                        <span className="text-red-600">فشل رفع الصور</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 ml-2" />
                        <span>انقر لاختيار صور للرفع (يمكنك اختيار عدة صور)</span>
                      </>
                    )}
                  </Label>
                  {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">الصور المرفوعة ({images.length})</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                  <p className="mt-2">جاري تحميل الصور...</p>
                </div>
              ) : images.length === 0 ? (
                <p className="text-center py-8 text-gray-500">لا توجد صور مرفوعة بعد</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden shadow-md">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // يمكن إضافة وظيفة حذف الصورة هنا
                            alert("سيتم إضافة وظيفة حذف الصورة قريبًا")
                          }}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">رفع ملفات صوتية</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">رفع ملف موسيقى</h3>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        disabled={audioUploadStatus === "uploading"}
                        className="hidden"
                        id="music-upload"
                        ref={audioInputRef}
                      />
                      <Label
                        htmlFor="music-upload"
                        className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${
                          audioUploadStatus === "success"
                            ? "border-green-500 bg-green-50"
                            : audioUploadStatus === "error"
                              ? "border-red-500 bg-red-50"
                              : "border-blue-300 hover:border-blue-500"
                        }`}
                      >
                        {audioUploadStatus === "uploading" ? (
                          <>
                            <Loader2 className="h-6 w-6 ml-2 animate-spin" />
                            <span>جاري رفع الملف...</span>
                          </>
                        ) : audioUploadStatus === "success" ? (
                          <>
                            <Check className="h-6 w-6 ml-2 text-green-500" />
                            <span className="text-green-600">تم رفع الملف بنجاح</span>
                          </>
                        ) : audioUploadStatus === "error" ? (
                          <>
                            <X className="h-6 w-6 ml-2 text-red-500" />
                            <span className="text-red-600">فشل رفع الملف</span>
                          </>
                        ) : (
                          <>
                            <Music className="h-6 w-6 ml-2" />
                            <span>انقر لاختيار ملف موسيقى</span>
                          </>
                        )}
                      </Label>
                      {audioUploadError && <p className="text-red-500 text-sm mt-2">{audioUploadError}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">رفع رسالة صوتية</h3>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        disabled={audioUploadStatus === "uploading"}
                        className="hidden"
                        id="voice-upload"
                      />
                      <Label
                        htmlFor="voice-upload"
                        className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer border-blue-300 hover:border-blue-500`}
                      >
                        <Mic className="h-6 w-6 ml-2" />
                        <span>انقر لاختيار ملف رسالة صوتية</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="wishes" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">إضافة أمنية جديدة</h2>
              <form onSubmit={handleAddWish} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wish-text">نص الأمنية</Label>
                  <Textarea
                    id="wish-text"
                    value={newWishText}
                    onChange={(e) => setNewWishText(e.target.value)}
                    placeholder="اكتب أمنية جديدة هنا..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit">إضافة أمنية</Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">الأمنيات المرسلة ({wishes.length})</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                  <p className="mt-2">جاري تحميل الأمنيات...</p>
                </div>
              ) : wishes.length === 0 ? (
                <p className="text-center py-8 text-gray-500">لا توجد أمنيات مرسلة بعد</p>
              ) : (
                <div className="space-y-4">
                  {wishes.map((wish) => (
                    <Card key={wish.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                      <p className="text-lg mb-2">"{wish.message}"</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{new Date(wish.created_at).toLocaleString("ar-EG")}</span>
                        <span>{wish.name}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="memories" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">إضافة ذكرى جديدة</h2>
              <form onSubmit={handleAddMemory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="memory-text">نص الذكرى</Label>
                  <Textarea
                    id="memory-text"
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    placeholder="اكتب ذكرى جديدة هنا..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit">إضافة ذكرى</Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">الذكريات المشتركة ({memories.length})</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                  <p className="mt-2">جاري تحميل الذكريات...</p>
                </div>
              ) : memories.length === 0 ? (
                <p className="text-center py-8 text-gray-500">لا توجد ذكريات مشتركة بعد</p>
              ) : (
                <div className="space-y-4">
                  {memories.map((memory) => (
                    <Card key={memory.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                      <p className="text-lg">{memory.text}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(memory.created_at).toLocaleString("ar-EG")}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

