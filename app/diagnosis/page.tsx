"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

// Speech Recognition Types
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition
    }
    webkitSpeechRecognition: {
      new (): SpeechRecognition
    }
  }
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Leaf,
  Upload,
  Image as ImageIcon,
  Layers,
  Cloud,
  X,
  MapPin,
  Navigation,
  Sprout,
  Clock,
  Lightbulb,
  Scissors,
  Thermometer,
  Droplets,
  CloudRain,
  BarChart3,
  Mic,
  Square,
  Loader2,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

// Validation Schema
const diagnosisSchema = z.object({
  cropImages: z
    .array(z.instanceof(File))
    .min(1, "At least one crop image is required")
    .refine(
      (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
      "Each image must be less than 10MB"
    )
    .refine(
      (files) => files.every((file) => file.type.startsWith("image/")),
      "All files must be images"
    ),
  cropType: z.string().min(1, "Crop type is required"),
  customCropType: z.string().optional(),
  growthStage: z.string().min(1, "Growth stage is required"),
  customGrowthStage: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  soilCondition: z.string().min(1, "Soil condition is required"),
  customSoilCondition: z.string().optional(),
  weatherCondition: z.string().min(1, "Weather condition is required"),
  customWeatherCondition: z.string().optional(),
  description: z.string().optional(),
  soilReport: z.instanceof(File).optional(),
  weatherImage: z.instanceof(File).optional(),
}).refine(
  (data) => {
    if (data.cropType === "Other") {
      return data.customCropType && data.customCropType.trim().length > 0
    }
    return true
  },
  {
    message: "Please specify the crop type",
    path: ["customCropType"],
  }
).refine(
  (data) => {
    if (data.growthStage === "Other") {
      return data.customGrowthStage && data.customGrowthStage.trim().length > 0
    }
    return true
  },
  {
    message: "Please specify the growth stage",
    path: ["customGrowthStage"],
  }
).refine(
  (data) => {
    if (data.soilCondition === "Other") {
      return data.customSoilCondition && data.customSoilCondition.trim().length > 0
    }
    return true
  },
  {
    message: "Please specify the soil condition",
    path: ["customSoilCondition"],
  }
).refine(
  (data) => {
    if (data.weatherCondition === "Other") {
      return data.customWeatherCondition && data.customWeatherCondition.trim().length > 0
    }
    return true
  },
  {
    message: "Please specify the weather condition",
    path: ["customWeatherCondition"],
  }
)

type DiagnosisFormValues = z.infer<typeof diagnosisSchema>

export default function DiagnosisPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("diagnosis")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [soilReportPreview, setSoilReportPreview] = useState<string | null>(null)
  const [weatherImagePreview, setWeatherImagePreview] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: {
      cropImages: [],
      cropType: "Tomato",
      customCropType: "",
      growthStage: "",
      customGrowthStage: "",
      location: "Ames, Iowa, USA",
      soilCondition: "",
      customSoilCondition: "",
      weatherCondition: "",
      customWeatherCondition: "",
      description: "",
      soilReport: undefined,
      weatherImage: undefined,
    },
    mode: "onChange",
  })

  const cropType = form.watch("cropType")
  const growthStage = form.watch("growthStage")
  const soilCondition = form.watch("soilCondition")
  const weatherCondition = form.watch("weatherCondition")
  const description = form.watch("description")

  // Handle image upload and preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"))

    // Validate file sizes
    const validFiles = imageFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        form.setError("cropImages", {
          type: "manual",
          message: `File ${file.name} exceeds 10MB limit`,
        })
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...newPreviews])

    // Update form with files
    const currentFiles = form.getValues("cropImages") || []
    form.setValue("cropImages", [...currentFiles, ...validFiles], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleImageRemove = (index: number) => {
    const currentFiles = form.getValues("cropImages") || []
    const newFiles = currentFiles.filter((_, i) => i !== index)
    form.setValue("cropImages", newFiles, {
      shouldValidate: true,
      shouldDirty: true,
    })

    // Remove preview and revoke URL
    const previewToRemove = imagePreviews[index]
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove)
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSoilReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      form.setError("soilReport", {
        type: "manual",
        message: "File exceeds 10MB limit",
      })
      return
    }

    form.setValue("soilReport", file, {
      shouldValidate: true,
      shouldDirty: true,
    })

    if (file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file)
      setSoilReportPreview(preview)
    } else {
      setSoilReportPreview(null)
    }
  }

  const handleWeatherImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      form.setError("weatherImage", {
        type: "manual",
        message: "File must be an image",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      form.setError("weatherImage", {
        type: "manual",
        message: "File exceeds 10MB limit",
      })
      return
    }

    form.setValue("weatherImage", file, {
      shouldValidate: true,
      shouldDirty: true,
    })

    const preview = URL.createObjectURL(file)
    setWeatherImagePreview(preview)
  }

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode these coordinates
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          form.setValue("location", `${lat}, ${lng}`, {
            shouldValidate: true,
            shouldDirty: true,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          form.setError("location", {
            type: "manual",
            message: "Failed to get location. Please enter manually.",
          })
        }
      )
    } else {
      form.setError("location", {
        type: "manual",
        message: "Geolocation is not supported in your browser.",
      })
    }
  }

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognitionClass) {
        const recognitionInstance = new SpeechRecognitionClass()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const transcript = result[0].transcript
            if (result.isFinal) {
              finalTranscript += transcript + " "
            } else {
              interimTranscript += transcript
            }
          }

          const currentDescription = form.getValues("description") || ""
          const baseText = currentDescription.replace(interimTranscript, "")
          const newDescription = baseText + finalTranscript + interimTranscript

          form.setValue("description", newDescription, {
            shouldDirty: true,
          })
        }

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error)
          if (event.error === "no-speech" || event.error === "aborted") {
            setIsRecording(false)
          }
        }

        recognitionInstance.onend = () => {
          setIsRecording(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [form])

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
      if (soilReportPreview) URL.revokeObjectURL(soilReportPreview)
      if (weatherImagePreview) URL.revokeObjectURL(weatherImagePreview)
    }
  }, [imagePreviews, soilReportPreview, weatherImagePreview])

  const startRecording = () => {
    if (recognition) {
      try {
        recognition.start()
        setIsRecording(true)
      } catch (error) {
        console.error("Error starting recording:", error)
      }
    } else {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
    }
  }

  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Convert File to base64 data URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const onSubmit = async (data: DiagnosisFormValues) => {
    setIsAnalyzing(true)
    try {
      // Create FormData to send files
      const formData = new FormData()
      
      // Add all form fields
      formData.append("cropType", data.cropType)
      if (data.customCropType) formData.append("customCropType", data.customCropType)
      formData.append("growthStage", data.growthStage)
      if (data.customGrowthStage) formData.append("customGrowthStage", data.customGrowthStage)
      formData.append("location", data.location)
      formData.append("soilCondition", data.soilCondition)
      if (data.customSoilCondition) formData.append("customSoilCondition", data.customSoilCondition)
      formData.append("weatherCondition", data.weatherCondition)
      if (data.customWeatherCondition) formData.append("customWeatherCondition", data.customWeatherCondition)
      if (data.description) formData.append("description", data.description)
      formData.append("locale", locale)

      // Add images
      data.cropImages.forEach((file) => {
        formData.append("cropImages", file)
      })
      
      if (data.soilReport) {
        formData.append("soilReport", data.soilReport)
      }
      
      if (data.weatherImage) {
        formData.append("weatherImage", data.weatherImage)
      }
      
      // Send to analysis API
      const response = await fetch("/api/diagnosis/analyze", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze diagnosis")
      }
      
      const analysisResult = await response.json()
      
      // Convert File objects to base64 data URLs for persistence
      const cropImageDataUrls = await Promise.all(
        data.cropImages.map((file) => fileToDataURL(file))
      )
      
      const soilReportDataUrl = data.soilReport 
        ? await fileToDataURL(data.soilReport)
        : null
      
      const weatherImageDataUrl = data.weatherImage
        ? await fileToDataURL(data.weatherImage)
        : null
      
      // Store image previews as base64 data URLs for display in report
      const imageData = {
        cropImages: cropImageDataUrls,
        soilReport: soilReportDataUrl,
        weatherImage: weatherImageDataUrl,
      }
      
      // Combine analysis result with image previews
      const reportData = {
        ...analysisResult,
        imagePreviews: imageData,
      }
      
      // Store results in sessionStorage to pass to report page
      sessionStorage.setItem("diagnosisReport", JSON.stringify(reportData))
      
      // Navigate to report page
      router.push("/diagnosis/report")
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsAnalyzing(false)
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to submit diagnosis. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] dark:bg-[#111827] text-gray-800 dark:text-gray-100 transition-colors duration-200">
      {/* Full Screen Loader */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[9999] bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#2F855A]/10 dark:bg-[#2F855A]/20 animate-pulse"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#2F855A]/20 dark:bg-[#2F855A]/30 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#2F855A] dark:text-green-400 animate-spin" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-[#2F855A] dark:text-green-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              {t("aiProgressTitle")}
            </h3>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {t("aiProgressDesc")}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-[#2F855A] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-[#2F855A] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-[#2F855A] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      )}
      <main className="flex-grow py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 dark:text-white font-[family-name:var(--font-merriweather)] mb-3 sm:mb-4">
                {t("title")}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("subtitle")}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                  {/* Evidence Sources */}
                  <Card className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-4 sm:pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle className="text-base sm:text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                          <Upload className="w-5 h-5 text-[#2F855A] flex-shrink-0" />
                          {t("evidenceSources")}
                        </CardTitle>
                        <span className="text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2.5 py-0.5 rounded-full w-fit">
                          {t("step1")}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      {/* Crop Images */}
                      <FormField
                        control={form.control}
                        name="cropImages"
                        render={({ field }) => (
                          <FormItem>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Leaf className="w-5 h-5 text-[#2F855A] flex-shrink-0" />
                                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white m-0">
                                    1. {t("cropImages")} <span className="text-red-500">*</span>
                                  </FormLabel>
                                </div>
                                <span className="text-xs text-gray-500">{t("cropImagesHint")}</span>
                              </div>
                              <div className="p-4 sm:p-6">
                                <FormControl>
                                  <label className="flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-[#2F855A] dark:hover:border-[#2F855A] transition-colors cursor-pointer group bg-gray-50/50 dark:bg-gray-800/30">
                                    <div className="space-y-2 text-center">
                                      <ImageIcon className="mx-auto h-10 w-10 text-gray-400 group-hover:text-[#2F855A] transition-colors" />
                                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <span className="font-medium text-[#2F855A] hover:text-green-600 cursor-pointer">
                                          {t("uploadVisual")}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-500">JPG, PNG up to 10MB</p>
                                    </div>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </FormControl>
                                {imagePreviews.length > 0 && (
                                  <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {imagePreviews.map((preview, index) => (
                                      <div key={index} className="relative group flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                                        <Image
                                          src={preview}
                                          alt={`Crop image ${index + 1}`}
                                          width={96}
                                          height={96}
                                          className="object-cover pointer-events-none group-hover:opacity-75 w-full h-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                                        />
                                        <button
                                          onClick={() => handleImageRemove(index)}
                                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600 focus:outline-none transition-colors"
                                          type="button"
                                          aria-label="Remove image"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Soil and Weather Uploads */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Soil Report */}
                        <FormField
                          control={form.control}
                          name="soilReport"
                          render={({ field }) => (
                            <FormItem>
                              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-[#C05621] flex-shrink-0" />
                                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-white m-0">
                                      2. {t("soilReport")}
                                    </FormLabel>
                                  </div>
                                </div>
                                <FormControl>
                                  <label className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[140px] cursor-pointer group">
                                    <div className="rounded-full bg-orange-50 dark:bg-orange-900/20 p-2.5 sm:p-3 group-hover:scale-110 transition-transform">
                                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-[#C05621]" />
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
                                      Upload PDF or Soil Photo
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1">
                                      Nutrient Analysis
                                    </span>
                                    <input
                                      type="file"
                                      accept=".pdf,image/*"
                                      onChange={handleSoilReportUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </FormControl>
                                {soilReportPreview && (
                                  <div className="px-4 pb-4">
                                    <div className="relative w-full h-32">
                                      <Image
                                        src={soilReportPreview}
                                        alt="Soil report preview"
                                        fill
                                        className="object-cover rounded-lg"
                                      />
                                    </div>
                                  </div>
                                )}
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Weather & Sky */}
                        <FormField
                          control={form.control}
                          name="weatherImage"
                          render={({ field }) => (
                            <FormItem>
                              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center gap-2">
                                    <Cloud className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-white m-0">
                                      3. {t("weatherSky")}
                                    </FormLabel>
                                  </div>
                                </div>
                                <FormControl>
                                  <label className="p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[140px] cursor-pointer group">
                                    <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 group-hover:scale-110 transition-transform">
                                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
                                      Upload Sky Conditions
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1">
                                      Atmospheric Risk
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleWeatherImageUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </FormControl>
                                {weatherImagePreview && (
                                  <div className="px-4 pb-4">
                                    <div className="relative w-full h-32">
                                      <Image
                                        src={weatherImagePreview}
                                        alt="Weather image preview"
                                        fill
                                        className="object-cover rounded-lg"
                                      />
                                    </div>
                                  </div>
                                )}
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Crop & Environmental Details */}
                  <Card className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-4 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#2F855A] flex-shrink-0" />
                        {t("cropDetails")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* Crop Type */}
                        <FormField
                          control={form.control}
                          name="cropType"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-3">
                              <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("cropType")} <span className="text-red-500">*</span>
                              </FormLabel>
                              <div className="relative">
                                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                  <div className="flex items-center justify-center w-5 h-5">
                                    <Sprout className="w-5 h-5 text-[#2F855A] dark:text-green-400 flex-shrink-0" />
                                  </div>
                                </div> */}
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      if (value !== "Other") {
                                        form.setValue("customCropType", "", { shouldValidate: true })
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-full !h-11 relative z-10">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Tomato">Tomato</SelectItem>
                                      <SelectItem value="Potato">Potato</SelectItem>
                                      <SelectItem value="Corn (Maize)">Corn (Maize)</SelectItem>
                                      <SelectItem value="Wheat">Wheat</SelectItem>
                                      <SelectItem value="Rice">Rice</SelectItem>
                                      <SelectItem value="Soybean">Soybean</SelectItem>
                                      <SelectItem value="Cotton">Cotton</SelectItem>
                                      <SelectItem value="Barley">Barley</SelectItem>
                                      <SelectItem value="Oats">Oats</SelectItem>
                                      <SelectItem value="Sorghum">Sorghum</SelectItem>
                                      <SelectItem value="Pepper">Pepper</SelectItem>
                                      <SelectItem value="Cucumber">Cucumber</SelectItem>
                                      <SelectItem value="Lettuce">Lettuce</SelectItem>
                                      <SelectItem value="Carrot">Carrot</SelectItem>
                                      <SelectItem value="Onion">Onion</SelectItem>
                                      <SelectItem value="Cabbage">Cabbage</SelectItem>
                                      <SelectItem value="Broccoli">Broccoli</SelectItem>
                                      <SelectItem value="Cauliflower">Cauliflower</SelectItem>
                                      <SelectItem value="Spinach">Spinach</SelectItem>
                                      <SelectItem value="Beans">Beans</SelectItem>
                                      <SelectItem value="Peas">Peas</SelectItem>
                                      <SelectItem value="Sunflower">Sunflower</SelectItem>
                                      <SelectItem value="Canola">Canola</SelectItem>
                                      <SelectItem value="Sugar Beet">Sugar Beet</SelectItem>
                                      <SelectItem value="Other">Other (Specify)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </div>
                              {cropType === "Other" && (
                                <FormField
                                  control={form.control}
                                  name="customCropType"
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormControl>
                                        <Input
                                          placeholder="Enter crop type..."
                                          {...field}
                                          className="h-11"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </FormItem>
                          )}
                        />

                        {/* Growth Stage */}
                        <FormField
                          control={form.control}
                          name="growthStage"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-3">
                              <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("growthStage")} <span className="text-red-500">*</span>
                              </FormLabel>
                              <div className="relative">
                                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                  <div className="flex items-center justify-center w-5 h-5">
                                    <Clock className="w-5 h-5 text-[#2F855A] dark:text-green-400 flex-shrink-0" />
                                  </div>
                                </div> */}
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      if (value !== "Other") {
                                        form.setValue("customGrowthStage", "", { shouldValidate: true })
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-full !h-11 relative z-10">
                                      <SelectValue placeholder="Select growth stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Germination">Germination</SelectItem>
                                      <SelectItem value="Seedling">Seedling</SelectItem>
                                      <SelectItem value="Vegetative">Vegetative</SelectItem>
                                      <SelectItem value="Flowering">Flowering</SelectItem>
                                      <SelectItem value="Fruiting">Fruiting</SelectItem>
                                      <SelectItem value="Maturation">Maturation</SelectItem>
                                      <SelectItem value="Harvest">Harvest</SelectItem>
                                      <SelectItem value="Post-Harvest">Post-Harvest</SelectItem>
                                      <SelectItem value="Other">Other (Specify)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </div>
                              {growthStage === "Other" && (
                                <FormField
                                  control={form.control}
                                  name="customGrowthStage"
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormControl>
                                        <Input
                                          placeholder="Enter growth stage..."
                                          {...field}
                                          className="h-11"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </FormItem>
                          )}
                        />

                        {/* Location */}
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-6">
                              <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("location")} <span className="text-red-500">*</span>
                              </FormLabel>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                <div className="relative flex-grow focus-within:z-10">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                    <div className="flex items-center justify-center w-5 h-5">
                                      <MapPin className="w-5 h-5 text-[#2F855A] dark:text-green-400 flex-shrink-0" />
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Input
                                      placeholder="Start typing address or coordinates..."
                                      {...field}
                                      className="pl-10 sm:rounded-none sm:rounded-l-md h-11 relative z-10"
                                    />
                                  </FormControl>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleLocationDetect}
                                  className="sm:-ml-px sm:rounded-none sm:rounded-r-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 h-11"
                                >
                                  <Navigation className="w-4 h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">Locate Me</span>
                                  <span className="sm:hidden">Locate</span>
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Soil Condition */}
                        <FormField
                          control={form.control}
                          name="soilCondition"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-3">
                              <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("soilCondition")} <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                    if (value !== "Other") {
                                      form.setValue("customSoilCondition", "", { shouldValidate: true })
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-full !h-11">
                                    <SelectValue placeholder="Select soil condition" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Well-drained">Well-drained</SelectItem>
                                    <SelectItem value="Clay">Clay</SelectItem>
                                    <SelectItem value="Sandy">Sandy</SelectItem>
                                    <SelectItem value="Loamy">Loamy</SelectItem>
                                    <SelectItem value="Silty">Silty</SelectItem>
                                    <SelectItem value="Waterlogged">Waterlogged</SelectItem>
                                    <SelectItem value="Dry">Dry</SelectItem>
                                    <SelectItem value="Other">Other (Specify)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                              {soilCondition === "Other" && (
                                <FormField
                                  control={form.control}
                                  name="customSoilCondition"
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormControl>
                                        <Input
                                          placeholder="Enter soil condition..."
                                          {...field}
                                          className="h-11"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </FormItem>
                          )}
                        />

                        {/* Weather Condition */}
                        <FormField
                          control={form.control}
                          name="weatherCondition"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-3">
                              <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("weatherCondition")} <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                    if (value !== "Other") {
                                      form.setValue("customWeatherCondition", "", { shouldValidate: true })
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-full !h-11">
                                    <SelectValue placeholder="Select weather condition" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sunny">Sunny</SelectItem>
                                    <SelectItem value="Cloudy">Cloudy</SelectItem>
                                    <SelectItem value="Rainy">Rainy</SelectItem>
                                    <SelectItem value="Humid">Humid</SelectItem>
                                    <SelectItem value="Dry">Dry</SelectItem>
                                    <SelectItem value="Windy">Windy</SelectItem>
                                    <SelectItem value="Frost">Frost</SelectItem>
                                    <SelectItem value="Drought">Drought</SelectItem>
                                    <SelectItem value="Other">Other (Specify)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                              {weatherCondition === "Other" && (
                                <FormField
                                  control={form.control}
                                  name="customWeatherCondition"
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormControl>
                                        <Input
                                          placeholder="Enter weather condition..."
                                          {...field}
                                          className="h-11"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </FormItem>
                          )}
                        />

                        {/* Description Textarea with Voice Recording */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-6">
                              <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("additionalDesc")}
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">
                                  {t("additionalDescHint")}
                                </span>
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe any symptoms, observations, or concerns about your crops. You can type or use the microphone to record your description..."
                                    {...field}
                                    rows={5}
                                    className="w-full px-4 py-3 pr-24 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#2F855A] focus:border-[#2F855A] transition-all resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                                  />
                                </FormControl>
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                  {isRecording && (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                      <span className="text-xs font-medium">{formatTime(recordingTime)}</span>
                                    </div>
                                  )}
                                  {isRecording ? (
                                    <Button
                                      type="button"
                                      onClick={stopRecording}
                                      className="h-9 w-9 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
                                      title="Stop Recording"
                                    >
                                      <Square className="w-4 h-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      onClick={startRecording}
                                      disabled={!recognition}
                                      className="h-9 w-9 p-0 bg-[#2F855A] hover:bg-[#1B5E20] text-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Start Voice Recording"
                                    >
                                      <Mic className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {!recognition && (
                                <FormDescription className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                  Voice recording requires Chrome, Edge, or Safari browser
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Run Analysis Button */}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {form.formState.errors.root && (
                          <div className="w-full sm:w-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
                            {form.formState.errors.root.message}
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={form.formState.isSubmitting || isAnalyzing}
                          className="w-full sm:w-auto bg-[#2F855A] hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <BarChart3 className="w-5 h-5 mr-2" />
                          {form.formState.isSubmitting || isAnalyzing ? (
                            <span>{t("analyzing")}</span>
                          ) : (
                            <>
                              <span className="hidden sm:inline">{t("runAnalysis")}</span>
                              <span className="sm:hidden">{t("runAnalysisShort")}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                  {/* Agricultural Tips */}
                  <Card className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#C05621] flex-shrink-0" />
                        <span className="text-sm sm:text-base">Agricultural Tips: Tomato</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all cursor-default group">
                        <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:bg-[#2F855A] transition-colors">
                          <Scissors className="w-5 h-5 text-[#2F855A] group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Proper Tomato Pruning</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug">
                            Remove suckers from leaf axils to direct energy toward fruit and improve airflow.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30 hover:shadow-md transition-all cursor-default group">
                        <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:bg-[#C05621] transition-colors">
                          <Thermometer className="w-5 h-5 text-[#C05621] group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Optimal Soil Temperature</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug">
                            Tomatoes thrive in soil between 21-29°C. Use organic mulch to help regulate root temperature.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all cursor-default group">
                        <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:bg-blue-500 transition-colors">
                          <Droplets className="w-5 h-5 text-blue-500 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Consistent Watering</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug">
                            Maintain even moisture to prevent blossom end rot and fruit cracking during fruit set.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weather Alert */}
                  <Card className="bg-gradient-to-br from-[#2F855A] to-green-800 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] p-5 sm:p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    <h4 className="text-xs sm:text-sm font-medium opacity-90 mb-3">Local Weather Alert</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <CloudRain className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
                      <div>
                        <p className="text-lg sm:text-xl font-bold">Heavy Rain</p>
                        <p className="text-xs opacity-80">Expected in 2 hours</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                      High humidity following rain increases risk of fungal infections. Check drainage.
                    </p>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
