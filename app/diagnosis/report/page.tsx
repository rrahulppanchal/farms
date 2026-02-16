"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Leaf,
  ArrowLeft,
  Calendar,
  BarChart3,
  Heart,
  Droplets,
  Thermometer,
  Share2,
  Download,
  Bot,
  Send,
  MoreVertical,
  ExternalLink,
  Scissors,
  Sprout,
  Globe,
  TrendingUp,
  Users,
  Monitor,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  Cloud,
  X,
  MessageSquare,
} from "lucide-react"
import Image from "next/image"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: string
}

interface DiagnosisReport {
  reportId: string
  timestamp: string
  cropInfo: {
    cropType: string
    growthStage: string
    location: string
    soilCondition: string
    weatherCondition: string
    description?: string
  }
  analysis: {
    diagnosis: {
      diseaseName: string
      severity: "Low" | "Moderate" | "High" | "Critical"
      confidence: number
      description: string
      scientificName?: string
    }
    environmentalFactors: {
      humidity: {
        value: string
        riskLevel: "LOW" | "MODERATE" | "HIGH"
        impact: string
      }
      temperature: {
        value: string
        riskLevel: "LOW" | "MODERATE" | "HIGH"
        impact: string
      }
      overallRisk: number
    }
    impact: {
      yieldLoss: string
      timeframe: string
      description: string
    }
    treatmentPlan: {
      immediate: Array<{
        title: string
        description: string
        timeline: string
        type: "organic" | "chemical" | "cultural"
        products?: string[]
      }>
      followUp: Array<{
        title: string
        description: string
        timeline: string
        type: "organic" | "chemical" | "cultural"
      }>
      prevention: Array<{
        title: string
        description: string
        timeline: string
        type: "organic" | "chemical" | "cultural"
      }>
    }
    recommendations: {
      pruning?: string
      watering?: string
      fertilization?: string
      monitoring?: string
    }
  }
  imageCount: number
  imagePreviews?: {
    cropImages: string[]
    soilReport: string | null
    weatherImage: string | null
  }
}

export default function DiagnosisReportPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("report")
  const [report, setReport] = useState<DiagnosisReport | null>(null)
  const [message, setMessage] = useState("")
  const [filter, setFilter] = useState("all")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChatExpanded, setIsChatExpanded] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Convert markdown-style formatting to HTML
  const formatMessage = (text: string): string => {
    const lines = text.split('\n')
    const processedLines: string[] = []
    let currentList: { items: string[], isNumbered: boolean } | null = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check for headers
      if (line.match(/^### /)) {
        if (currentList) {
          const listTag = currentList.isNumbered ? 'ol' : 'ul'
          const listClass = currentList.isNumbered 
            ? 'list-decimal ml-6 mb-2 space-y-1' 
            : 'list-disc ml-6 mb-2 space-y-1'
          processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
          currentList = null
        }
        processedLines.push(`<h3 class="font-bold text-base mt-4 mb-2 text-gray-900 dark:text-white">${line.replace(/^### /, '')}</h3>`)
        continue
      }
      if (line.match(/^## /)) {
        if (currentList) {
          const listTag = currentList.isNumbered ? 'ol' : 'ul'
          const listClass = currentList.isNumbered 
            ? 'list-decimal ml-6 mb-2 space-y-1' 
            : 'list-disc ml-6 mb-2 space-y-1'
          processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
          currentList = null
        }
        processedLines.push(`<h2 class="font-bold text-lg mt-4 mb-2 text-gray-900 dark:text-white">${line.replace(/^## /, '')}</h2>`)
        continue
      }
      if (line.match(/^# /)) {
        if (currentList) {
          const listTag = currentList.isNumbered ? 'ol' : 'ul'
          const listClass = currentList.isNumbered 
            ? 'list-decimal ml-6 mb-2 space-y-1' 
            : 'list-disc ml-6 mb-2 space-y-1'
          processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
          currentList = null
        }
        processedLines.push(`<h1 class="font-bold text-xl mt-4 mb-2 text-gray-900 dark:text-white">${line.replace(/^# /, '')}</h1>`)
        continue
      }
      
      // Check for numbered list
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/)
      if (numberedMatch) {
        if (!currentList || !currentList.isNumbered) {
          if (currentList) {
            const listTag = 'ul'
            const listClass = 'list-disc ml-6 mb-2 space-y-1'
            processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
          }
          currentList = { items: [], isNumbered: true }
        }
        currentList.items.push(`<li class="mb-1">${numberedMatch[2]}</li>`)
        continue
      }
      
      // Check for bullet list
      const bulletMatch = line.match(/^[-*]\s+(.*)$/)
      if (bulletMatch) {
        if (!currentList || currentList.isNumbered) {
          if (currentList) {
            const listTag = 'ol'
            const listClass = 'list-decimal ml-6 mb-2 space-y-1'
            processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
          }
          currentList = { items: [], isNumbered: false }
        }
        currentList.items.push(`<li class="mb-1">${bulletMatch[1]}</li>`)
        continue
      }
      
      // Regular line
      if (currentList) {
        const listTag = currentList.isNumbered ? 'ol' : 'ul'
        const listClass = currentList.isNumbered 
          ? 'list-decimal ml-6 mb-2 space-y-1' 
          : 'list-disc ml-6 mb-2 space-y-1'
        processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
        currentList = null
      }
      
      if (line.trim()) {
        processedLines.push(line)
      } else {
        processedLines.push('')
      }
    }
    
    // Close any remaining list
    if (currentList) {
      const listTag = currentList.isNumbered ? 'ol' : 'ul'
      const listClass = currentList.isNumbered 
        ? 'list-decimal ml-6 mb-2 space-y-1' 
        : 'list-disc ml-6 mb-2 space-y-1'
      processedLines.push(`<${listTag} class="${listClass}">${currentList.items.join('')}</${listTag}>`)
    }
    
    // Join lines and apply inline formatting
    let formatted = processedLines.join('\n')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">$1</code>')
      // Line breaks (process last to avoid breaking other formatting)
      .replace(/\n/g, '<br />')
    
    return formatted
  }

  // Download PDF Report
  const downloadPDF = async () => {
    if (!report || isGeneratingPDF) return

    setIsGeneratingPDF(true)
    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF('p', 'mm', 'a4')
      
      let yPosition = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - 2 * margin

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = '#000000') => {
        doc.setFontSize(fontSize)
        doc.setTextColor(color)
        if (isBold) {
          doc.setFont(undefined, 'bold')
        } else {
          doc.setFont(undefined, 'normal')
        }
        
        const lines = doc.splitTextToSize(text, contentWidth)
        lines.forEach((line: string) => {
          checkPageBreak(7)
          doc.text(line, margin, yPosition)
          yPosition += 7
        })
      }

      // Helper function to get image format from data URL
      const getImageFormat = (dataUrl: string): string => {
        if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
          return 'JPEG'
        } else if (dataUrl.startsWith('data:image/png')) {
          return 'PNG'
        } else if (dataUrl.startsWith('data:image/webp')) {
          return 'WEBP'
        }
        return 'JPEG' // default
      }

      // Helper function to add image
      const addImageToPDF = (imageSrc: string, width: number, height: number) => {
        checkPageBreak(height + 5)
        try {
          const format = getImageFormat(imageSrc)
          doc.addImage(imageSrc, format, margin, yPosition, width, height)
          yPosition += height + 5
        } catch (error) {
          console.error('Error adding image to PDF:', error)
          // If image fails, add a placeholder text
          addText('[Image could not be loaded]', 9, false, '#999999')
        }
      }

      // Title
      addText(`Crop Diagnosis Report - ${report.reportId}`, 18, true, '#2E7D32')
      yPosition += 5

      // Report Date
      addText(`Generated: ${formatDate(report.timestamp)}`, 10, false, '#666666')
      yPosition += 10

      // Crop Information
      addText('Crop Information', 14, true)
      addText(`Crop Type: ${report.cropInfo.cropType}`, 11)
      addText(`Growth Stage: ${report.cropInfo.growthStage}`, 11)
      addText(`Location: ${report.cropInfo.location}`, 11)
      addText(`Soil Condition: ${report.cropInfo.soilCondition}`, 11)
      addText(`Weather Condition: ${report.cropInfo.weatherCondition}`, 11)
      yPosition += 5

      // Diagnosis
      addText('Diagnosis', 14, true)
      addText(`Disease: ${report.analysis.diagnosis.diseaseName}`, 12, true)
      if (report.analysis.diagnosis.scientificName) {
        addText(`Scientific Name: ${report.analysis.diagnosis.scientificName}`, 10, false, '#666666')
      }
      addText(`Severity: ${report.analysis.diagnosis.severity}`, 11)
      addText(`AI Confidence: ${report.analysis.diagnosis.confidence}%`, 11)
      addText(`Description: ${report.analysis.diagnosis.description}`, 10)
      yPosition += 5

      // Images Section
      if (report.imagePreviews) {
        addText('Uploaded Images', 14, true)
        yPosition += 5

        // Crop Images
        if (report.imagePreviews.cropImages && report.imagePreviews.cropImages.length > 0) {
          addText(`Crop Images (${report.imagePreviews.cropImages.length})`, 12, true)
          yPosition += 3
          
          for (let i = 0; i < Math.min(report.imagePreviews.cropImages.length, 3); i++) {
            const img = report.imagePreviews.cropImages[i]
            const imgWidth = 60
            const imgHeight = 45
            addImageToPDF(img, imgWidth, imgHeight)
          }
          yPosition += 5
        }

        // Soil Report Image
        if (report.imagePreviews.soilReport) {
          addText('Soil Report', 12, true)
          yPosition += 3
          const imgWidth = 60
          const imgHeight = 45
          addImageToPDF(report.imagePreviews.soilReport, imgWidth, imgHeight)
        }

        // Weather Image
        if (report.imagePreviews.weatherImage) {
          addText('Weather & Sky', 12, true)
          yPosition += 3
          const imgWidth = 60
          const imgHeight = 45
          addImageToPDF(report.imagePreviews.weatherImage, imgWidth, imgHeight)
        }
      }

      // Environmental Factors
      addText('Environmental Risk Factors', 14, true)
      addText(`Humidity: ${report.analysis.environmentalFactors.humidity.value} (${report.analysis.environmentalFactors.humidity.riskLevel} Risk)`, 11)
      addText(`Temperature: ${report.analysis.environmentalFactors.temperature.value} (${report.analysis.environmentalFactors.temperature.riskLevel})`, 11)
      addText(`Overall Risk: ${report.analysis.environmentalFactors.overallRisk}%`, 11, true)
      yPosition += 5

      // Impact
      addText('Potential Impact', 14, true)
      addText(`Yield Loss: ${report.analysis.impact.yieldLoss}`, 11, true, '#DC2626')
      addText(`Timeframe: ${report.analysis.impact.timeframe}`, 11)
      addText(report.analysis.impact.description, 10)
      yPosition += 5

      // Treatment Plan
      addText('Treatment Action Plan', 14, true)
      yPosition += 3

      // Immediate Actions
      if (report.analysis.treatmentPlan.immediate.length > 0) {
        addText('Immediate Action (WITHIN 24 HOURS)', 12, true, '#DC2626')
        report.analysis.treatmentPlan.immediate.forEach((action) => {
          addText(`• ${action.title}`, 11, true)
          addText(action.description, 10)
          yPosition += 2
        })
        yPosition += 3
      }

      // Follow-up Care
      if (report.analysis.treatmentPlan.followUp.length > 0) {
        addText('Follow-up Care (DAY 3-7)', 12, true, '#D97706')
        report.analysis.treatmentPlan.followUp.forEach((action) => {
          addText(`• ${action.title}`, 11, true)
          addText(action.description, 10)
          yPosition += 2
        })
        yPosition += 3
      }

      // Prevention
      if (report.analysis.treatmentPlan.prevention.length > 0) {
        addText('Prevention & Recovery (POST-SEASON)', 12, true, '#2E7D32')
        report.analysis.treatmentPlan.prevention.forEach((action) => {
          addText(`• ${action.title}`, 11, true)
          addText(action.description, 10)
          yPosition += 2
        })
        yPosition += 3
      }

      // Recommendations
      if (report.analysis.recommendations.pruning || report.analysis.recommendations.watering) {
        addText('Additional Recommendations', 12, true)
        if (report.analysis.recommendations.pruning) {
          addText(`Pruning: ${report.analysis.recommendations.pruning}`, 10)
        }
        if (report.analysis.recommendations.watering) {
          addText(`Watering: ${report.analysis.recommendations.watering}`, 10)
        }
        if (report.analysis.recommendations.fertilization) {
          addText(`Fertilization: ${report.analysis.recommendations.fertilization}`, 10)
        }
        if (report.analysis.recommendations.monitoring) {
          addText(`Monitoring: ${report.analysis.recommendations.monitoring}`, 10)
        }
      }

      // Footer
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor('#666666')
        doc.text(
          `Page ${i} of ${totalPages} - Report ID: ${report.reportId}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
      }

      // Save PDF
      doc.save(`Diagnosis_Report_${report.reportId}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Load report data from sessionStorage
  useEffect(() => {
    const reportData = sessionStorage.getItem("diagnosisReport")
    if (reportData) {
      try {
        const parsed = JSON.parse(reportData)
        setReport(parsed)
        // Initialize chat with greeting (localized)
        setMessages([
          {
            id: "1",
            text: t("chatGreeting", {
              diseaseName: parsed.analysis.diagnosis.diseaseName,
              cropType: parsed.cropInfo.cropType,
            }),
            sender: "ai",
            timestamp: new Date().toLocaleTimeString(locale || "en", {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
        ])
      } catch (error) {
        console.error("Error parsing report data:", error)
        router.push("/diagnosis")
      }
    } else {
      // No report data, redirect to diagnosis page
      router.push("/diagnosis")
    }
  }, [router])

  // Update initial greeting when locale changes (so chat stays in regional language)
  useEffect(() => {
    if (!report) return
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].sender !== "ai") return prev
      return [
        {
          ...prev[0],
          text: t("chatGreeting", {
            diseaseName: report.analysis.diagnosis.diseaseName,
            cropType: report.cropInfo.cropType,
          }),
          timestamp: new Date().toLocaleTimeString(locale || "en", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]
    })
  }, [locale, t, report])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(locale || "en", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      // Report context for better AI responses
      const context = report ? {
        diagnosis: report.analysis.diagnosis.diseaseName,
        severity: report.analysis.diagnosis.severity,
        cropType: report.cropInfo.cropType,
        location: report.cropInfo.location,
        confidence: `${report.analysis.diagnosis.confidence}%`,
        growthStage: report.cropInfo.growthStage,
        soilCondition: report.cropInfo.soilCondition,
        weatherCondition: report.cropInfo.weatherCondition,
      } : {}

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          context: context,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.text || t("chatApiError"),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(locale || "en", {
          hour: "numeric",
          minute: "2-digit",
        }),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t("chatError"),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(locale || "en", {
          hour: "numeric",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = async (question: string) => {
    if (isLoading) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(locale || "en", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const context = report ? {
        diagnosis: report.analysis.diagnosis.diseaseName,
        severity: report.analysis.diagnosis.severity,
        cropType: report.cropInfo.cropType,
        location: report.cropInfo.location,
        confidence: `${report.analysis.diagnosis.confidence}%`,
        growthStage: report.cropInfo.growthStage,
        soilCondition: report.cropInfo.soilCondition,
        weatherCondition: report.cropInfo.weatherCondition,
      } : {}

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          context: context,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.text || t("chatApiError"),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(locale || "en", {
          hour: "numeric",
          minute: "2-digit",
        }),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t("chatError"),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(locale || "en", {
          hour: "numeric",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t("loadingReport")}</p>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "HIGH":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "MODERATE":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
      default:
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString(locale || "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Filter treatment plan based on selected filter
  const filteredImmediate = report.analysis.treatmentPlan.immediate.filter(
    (item) => filter === "all" || item.type === filter
  )
  const filteredFollowUp = report.analysis.treatmentPlan.followUp.filter(
    (item) => filter === "all" || item.type === filter
  )
  const filteredPrevention = report.analysis.treatmentPlan.prevention.filter(
    (item) => filter === "all" || item.type === filter
  )

  return (
    <div className="min-h-screen bg-[#F0FDF4] dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/diagnosis"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#2E7D32] dark:hover:text-[#2E7D32] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("backToDashboard")}
          </Link>
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("reportId")}: #{report.reportId}</span>
        </div>

        {/* Main Report Card */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32] opacity-5 dark:opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
            {/* Crop Images Section */}
            {report.imagePreviews?.cropImages && report.imagePreviews.cropImages.length > 0 ? (
              <div className="w-full md:w-48 flex-shrink-0">
                <div className="rounded-xl overflow-hidden shadow-md relative group">
                  <div className="relative w-full h-32 md:h-32">
                    <img
                      alt="Crop image showing disease symptoms"
                      src={report.imagePreviews.cropImages[0]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {t("cropImage")} {report.imagePreviews.cropImages.length > 1 ? t("cropImageOf", { count: report.imagePreviews.cropImages.length }) : ""}
                    </span>
                  </div>
                </div>
                {report.imagePreviews.cropImages.length > 1 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {t("moreCropImages", { n: report.imagePreviews.cropImages.length - 1 })}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full md:w-48 h-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-md relative group bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <Leaf className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-xs">{t("noCropImage")}</span>
                </div>
              </div>
            )}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(report.analysis.diagnosis.severity)}`}>
                  {report.analysis.diagnosis.severity}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(report.timestamp)}
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-4xl text-gray-900 dark:text-white font-bold mb-2">
                {report.analysis.diagnosis.diseaseName}
                {report.analysis.diagnosis.scientificName && (
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                    ({report.analysis.diagnosis.scientificName})
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                {report.analysis.diagnosis.description}
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end">
              <div className="text-right mb-1">
                <span className="block text-sm text-gray-600 dark:text-gray-400">{t("aiConfidence")}</span>
                <span className="text-4xl font-bold text-[#2E7D32]">{report.analysis.diagnosis.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Uploaded Images Section */}
            {(report.imagePreviews?.cropImages?.length > 0 || report.imagePreviews?.soilReport || report.imagePreviews?.weatherImage) && (
              <Card className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-merriweather)] text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#2E7D32]" />
                    {t("uploadedEvidenceImages")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Crop Images */}
                    {report.imagePreviews.cropImages && report.imagePreviews.cropImages.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-[#2E7D32]" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("cropImages")}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({report.imagePreviews.cropImages.length})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {report.imagePreviews.cropImages.slice(0, 4).map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group cursor-pointer">
                              <img
                                src={img}
                                alt={`Crop image ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              {index === 3 && report.imagePreviews.cropImages.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                  <span className="text-white text-xs font-medium">{t("moreCropImages", { n: report.imagePreviews.cropImages.length - 4 })}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {report.imagePreviews.cropImages.length > 4 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {t("showingCropImages", { shown: 4, total: report.imagePreviews.cropImages.length })}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Soil Report */}
                    {report.imagePreviews.soilReport && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#C05621]" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("soilReport")}</span>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group cursor-pointer">
                          <img
                            src={report.imagePreviews.soilReport}
                            alt="Soil report"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* Weather Image */}
                    {report.imagePreviews.weatherImage && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("weatherSky")}</span>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group cursor-pointer">
                          <img
                            src={report.imagePreviews.weatherImage}
                            alt="Weather conditions"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Executive Summary */}
            <Card className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-merriweather)] text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#2E7D32]" />
                  {t("executiveSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#F0FDF4] dark:bg-gray-800/50 rounded-xl p-5 border border-green-100 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-4">
                      {t("environmentalRisk")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg">
                            <Droplets className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{t("humidity")}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{report.analysis.environmentalFactors.humidity.value}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getRiskColor(report.analysis.environmentalFactors.humidity.riskLevel)}`}>
                          {report.analysis.environmentalFactors.humidity.riskLevel === "HIGH" ? t("riskHigh") : report.analysis.environmentalFactors.humidity.riskLevel === "MODERATE" ? t("riskModerate") : t("riskLow")} {t("risk")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-lg">
                            <Thermometer className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{t("temperature")}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{report.analysis.environmentalFactors.temperature.value}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getRiskColor(report.analysis.environmentalFactors.temperature.riskLevel)}`}>
                          {report.analysis.environmentalFactors.temperature.riskLevel === "HIGH" ? t("riskHigh") : report.analysis.environmentalFactors.temperature.riskLevel === "MODERATE" ? t("riskModerate") : t("riskLow")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-2">
                      {t("potentialImpact")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {report.analysis.impact.description}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${report.analysis.environmentalFactors.overallRisk}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{t("lowRisk")}</span>
                      <span>{t("severeRisk", { percent: report.analysis.environmentalFactors.overallRisk })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Action Plan */}
            <Card className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                    <Heart className="w-5 h-5 text-[#2E7D32] stroke-2" />
                    {t("treatmentPlan")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                        filter === "all"
                          ? "bg-[#2E7D32] text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {t("filterAll")}
                    </button>
                    <button
                      onClick={() => setFilter("organic")}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                        filter === "organic"
                          ? "bg-[#2E7D32] text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {t("filterOrganic")}
                    </button>
                    <button
                      onClick={() => setFilter("chemical")}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                        filter === "chemical"
                          ? "bg-[#2E7D32] text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {t("filterChemical")}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative">
                  {/* Immediate Action */}
                  {filteredImmediate.length > 0 && (
                    <div className="relative pb-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("immediateAction")}</h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-white bg-red-600 px-3 py-1.5 rounded-md w-fit">
                          {t("within24Hours")}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {filteredImmediate.map((action, index) => (
                          <div key={index} className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl p-5 shadow-sm">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center">
                                  <Heart className="w-6 h-6 text-red-500 stroke-2 fill-red-500" />
                                </div>
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2">{action.title}</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                                  {action.description}
                                </p>
                                {action.products && action.products.length > 0 ? (
                                  <div className="mt-3">
                                    <a
                                      href="#"
                                      className="inline-flex items-center text-sm font-medium text-[#2E7D32] hover:text-[#1B5E20] hover:underline transition-colors"
                                    >
                                      {t("viewProductRecommendations")} <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                  </div>
                                ) : (
                                  <div className="mt-3">
                                    <a
                                      href="/diagnosis"
                                      className="inline-flex items-center text-sm font-medium text-[#2E7D32] hover:text-[#1B5E20] hover:underline transition-colors"
                                    >
                                      {t("uploadImages")} <span className="ml-1">→</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Care */}
                  {filteredFollowUp.length > 0 && (
                    <div className="relative pb-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("followUpCare")}</h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-yellow-800 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full w-fit">
                          {t("day3to7")}
                        </span>
                      </div>
                      
                      <ul className="space-y-3">
                        {filteredFollowUp.map((action, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {action.type === "organic" ? (
                                <Sprout className="w-5 h-5 text-yellow-500" />
                              ) : action.type === "chemical" ? (
                                <Heart className="w-5 h-5 text-yellow-500" />
                              ) : (
                                <Scissors className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <strong className="font-semibold text-gray-900 dark:text-white">{action.title}:</strong> {action.description}
                              </span>
                            </div>
                          </li>
                        ))}
                        {report.analysis.recommendations.pruning && (
                          <li className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <Scissors className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="flex-grow">
                              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <strong className="font-semibold text-gray-900 dark:text-white">{t("pruningLabel")}:</strong> {report.analysis.recommendations.pruning}
                              </span>
                            </div>
                          </li>
                        )}
                        {report.analysis.recommendations.watering && (
                          <li className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <Droplets className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="flex-grow">
                              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <strong className="font-semibold text-gray-900 dark:text-white">{t("wateringLabel")}:</strong> {report.analysis.recommendations.watering}
                              </span>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Prevention & Recovery */}
                  {filteredPrevention.length > 0 && (
                    <div className="relative pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("prevention")}</h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-md w-fit">
                          {t("postSeason")}
                        </span>
                      </div>
                      
                      <div className="space-y-5">
                        {filteredPrevention.map((action, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-bold text-gray-900 dark:text-white text-base">{action.title}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {action.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Report Actions */}
            <Card className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t("reportActions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md">
                  <Share2 className="w-4 h-4 mr-2" />
                  {t("shareReport")}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF}
                  className="w-full border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingPDF ? t("generatingPdf") : t("downloadPdf")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating AI Agronomist Chat */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-auto max-w-[464px]">
          {/* Floating Chat Button */}
          {!isChatExpanded && (
            <button
              onClick={() => setIsChatExpanded(true)}
              className="w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-in fade-in zoom-in duration-200"
              aria-label={t("openChatAria")}
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          )}

          {/* Chat Card */}
          {isChatExpanded && (
            <Card className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col w-full h-[calc(100vh-8rem)] sm:h-[626px] max-h-[626px] animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden gap-0 py-0">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#2E7D32]">
                      <Bot className="w-5 h-5" />
                    </div>
                    {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></span> */}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{t("aiAgronomist")}</h3>
                    {/* <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold uppercase leading-tight">
                      {t("online")}
                    </span> */}
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={t("closeChatAria")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-1 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-900/20 flex-grow min-h-0">
                <div className="flex flex-col items-center py-4">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                    {t("today")}
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse ml-auto max-w-[85%]" : "max-w-[85%]"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0 flex items-center justify-center text-[#2E7D32]">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl border shadow-sm ${
                        msg.sender === "user"
                          ? "bg-[#2E7D32] text-white rounded-tr-none"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-100 dark:border-gray-700"
                      }`}
                    >
                      <p 
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                      />
                      <span
                        className={`text-[10px] mt-1 block ${
                          msg.sender === "user" ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0 flex items-center justify-center text-[#2E7D32]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 py-2">
                    <button
onClick={() => handleQuickQuestion(t("chatSuggestion1"))}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#2E7D32]/20 text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors bg-white dark:bg-gray-800"
                  >
                      {t("chatSuggestion1")}
                    </button>
                    <button
                      onClick={() => handleQuickQuestion(t("chatSuggestion2"))}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#2E7D32]/20 text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors bg-white dark:bg-gray-800"
                    >
                      {t("chatSuggestion2")}
                    </button>
                    <button
                      onClick={() => handleQuickQuestion(t("chatSuggestion3"))}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#2E7D32]/20 text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors bg-white dark:bg-gray-800"
                    >
                      {t("chatSuggestion3")}
                    </button>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e293b] flex-shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder={t("askPlaceholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl pr-12 pl-4 py-2.5 text-sm focus:ring-[#2E7D32] focus:border-[#2E7D32] placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="absolute right-2 p-1.5 text-[#2E7D32] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2">
                  {t("aiDisclaimer")}
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}