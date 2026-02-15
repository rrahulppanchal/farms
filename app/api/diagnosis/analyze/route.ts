import { NextRequest, NextResponse } from "next/server"
import { getGeminiLanguageInstruction } from "@/lib/i18n-locales"

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  return `data:${file.type};base64,${base64}`
}

// Helper function to extract location components
function parseLocation(location: string): { city?: string; state?: string; country?: string; region?: string } {
  const parts = location.split(',').map(p => p.trim())
  const result: { city?: string; state?: string; country?: string; region?: string } = {}
  
  if (parts.length >= 1) result.city = parts[0]
  if (parts.length >= 2) result.state = parts[1]
  if (parts.length >= 3) result.country = parts[2]
  
  // Determine region based on state/country
  if (result.state) {
    result.region = result.state
  } else if (result.country) {
    result.region = result.country
  }
  
  return result
}

// Helper function to get regional soil characteristics
function getRegionalSoilData(location: string): string {
  const loc = parseLocation(location)
  const region = loc.state || loc.country || location.toLowerCase()
  
  // Common regional soil characteristics database
  const regionalSoilData: Record<string, string> = {
    // US States
    'iowa': 'Iowa soils are predominantly Mollisols (prairie soils) with high organic matter (3-5%), well-drained, pH 6.0-7.5. Common soil types: Clarion-Nicollet-Webster series (loamy), Tama series (silty clay loam). Typical nutrient levels: N 120-180 ppm, P 15-30 ppm, K 150-250 ppm. High cation exchange capacity (CEC) 15-25 meq/100g.',
    'illinois': 'Illinois soils are primarily Mollisols with high fertility, organic matter 3-6%, pH 6.2-7.2. Common types: Drummer silty clay loam, Flanagan silt loam. Typical nutrients: N 100-200 ppm, P 20-40 ppm, K 180-300 ppm. CEC 18-28 meq/100g.',
    'indiana': 'Indiana soils are mostly Alfisols and Mollisols, well-drained, organic matter 2-5%, pH 6.0-7.0. Common: Miami silt loam, Crosby silt loam. Nutrients: N 110-170 ppm, P 18-35 ppm, K 160-280 ppm. CEC 16-24 meq/100g.',
    'ohio': 'Ohio soils are primarily Alfisols, well-drained, organic matter 2-4%, pH 6.2-7.0. Common: Hoytville clay loam, Canfield silt loam. Nutrients: N 100-160 ppm, P 15-30 ppm, K 150-250 ppm. CEC 14-22 meq/100g.',
    'minnesota': 'Minnesota soils are Mollisols with high organic matter (4-8%), pH 6.0-7.5. Common: Barnes loam, Bearden silty clay loam. Nutrients: N 120-200 ppm, P 20-45 ppm, K 200-350 ppm. CEC 20-30 meq/100g.',
    'nebraska': 'Nebraska soils are Mollisols, well-drained, organic matter 2-4%, pH 6.5-7.8. Common: Holdrege silt loam, Sharpsburg silty clay loam. Nutrients: N 90-150 ppm, P 12-25 ppm, K 180-300 ppm. CEC 16-26 meq/100g.',
    'missouri': 'Missouri soils are Alfisols and Mollisols, variable drainage, organic matter 2-5%, pH 5.5-7.0. Common: Mexico silt loam, Putnam silt loam. Nutrients: N 80-140 ppm, P 10-25 ppm, K 120-220 ppm. CEC 12-20 meq/100g.',
    'kansas': 'Kansas soils are Mollisols, well-drained, organic matter 2-4%, pH 6.5-7.5. Common: Harney silt loam, Crete silt loam. Nutrients: N 85-145 ppm, P 12-28 ppm, K 160-280 ppm. CEC 15-25 meq/100g.',
    'wisconsin': 'Wisconsin soils are Alfisols and Mollisols, well-drained, organic matter 3-6%, pH 6.0-7.2. Common: Miami silt loam, Fayette silt loam. Nutrients: N 100-170 ppm, P 15-32 ppm, K 150-270 ppm. CEC 16-24 meq/100g.',
    'michigan': 'Michigan soils are Alfisols, well-drained, organic matter 2-5%, pH 6.0-7.0. Common: Capac loam, Coloma sandy loam. Nutrients: N 90-150 ppm, P 12-28 ppm, K 140-250 ppm. CEC 14-22 meq/100g.',
    
    // Other regions (can be expanded)
    'california': 'California soils vary widely: Central Valley has alluvial soils (pH 7.0-8.5), coastal areas have loamy soils (pH 6.5-7.5). Organic matter 1-3%. Nutrients vary by region.',
    'texas': 'Texas soils are diverse: Blackland Prairie has Vertisols (pH 7.5-8.5), East Texas has Alfisols (pH 5.5-7.0). Organic matter 1-4%.',
    'florida': 'Florida soils are primarily Spodosols and Entisols, sandy, well-drained, pH 5.5-7.5, low organic matter (1-3%).',
    
    // Countries
    'usa': 'US agricultural soils are primarily Mollisols and Alfisols, well-drained, organic matter 2-6%, pH 6.0-7.5. Typical nutrients: N 100-200 ppm, P 15-40 ppm, K 150-300 ppm.',
    'canada': 'Canadian prairie soils are Chernozems (Mollisols), high organic matter (4-8%), pH 6.5-7.5. Eastern Canada has Podzols, acidic (pH 5.0-6.5).',
    'india': 'Indian soils vary: Alluvial soils (pH 6.5-8.5), Black soils (pH 7.5-8.5), Red soils (pH 5.5-7.0). Organic matter 0.5-2%.',
  }
  
  // Try to find matching region (case-insensitive)
  const regionLower = region.toLowerCase()
  for (const [key, value] of Object.entries(regionalSoilData)) {
    if (regionLower.includes(key) || key.includes(regionLower)) {
      return value
    }
  }
  
  // Default regional soil information
  return `Regional soil characteristics for ${location}: Agricultural soils typically have organic matter 2-5%, pH 6.0-7.5, with moderate to high fertility. Common nutrients: N 100-180 ppm, P 15-30 ppm, K 150-250 ppm. Consider local soil testing for specific nutrient levels.`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      )
    }

    // Extract form data
    const cropType = formData.get("cropType") as string
    const customCropType = formData.get("customCropType") as string
    const growthStage = formData.get("growthStage") as string
    const customGrowthStage = formData.get("customGrowthStage") as string
    const location = formData.get("location") as string
    const soilCondition = formData.get("soilCondition") as string
    const customSoilCondition = formData.get("customSoilCondition") as string
    const weatherCondition = formData.get("weatherCondition") as string
    const customWeatherCondition = formData.get("customWeatherCondition") as string
    const description = formData.get("description") as string || ""
    const locale = (formData.get("locale") as string) || "en"

    // Get crop images
    const cropImages = formData.getAll("cropImages") as File[]
    const soilReport = formData.get("soilReport") as File | null
    const weatherImage = formData.get("weatherImage") as File | null

    // Convert images to base64 for Gemini
    const imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = []
    
    for (const image of cropImages) {
      if (image && image.size > 0) {
        const base64 = await fileToBase64(image)
        imageParts.push({
          inlineData: {
            data: base64.split(",")[1], // Remove data:image/...;base64, prefix
            mimeType: image.type,
          },
        })
      }
    }

    if (weatherImage && weatherImage.size > 0) {
      const base64 = await fileToBase64(weatherImage)
      imageParts.push({
        inlineData: {
          data: base64.split(",")[1],
          mimeType: weatherImage.type,
        },
      })
    }

    // Build comprehensive prompt for Gemini
    const finalCropType = cropType === "Other" ? customCropType : cropType
    const finalGrowthStage = growthStage === "Other" ? customGrowthStage : growthStage
    const finalSoilCondition = soilCondition === "Other" ? customSoilCondition : soilCondition
    const finalWeatherCondition = weatherCondition === "Other" ? customWeatherCondition : weatherCondition

    // Get regional soil data based on location
    const regionalSoilInfo = getRegionalSoilData(location)
    const locationInfo = parseLocation(location)

    const languageInstruction = getGeminiLanguageInstruction(locale)

    const prompt = `You are an expert AI agronomist with deep knowledge of crop diseases, plant pathology, and agricultural best practices. You MUST provide location-specific analysis and recommendations based strictly on the provided location.

CRITICAL LANGUAGE REQUIREMENT:
${languageInstruction}
The ENTIRE JSON response (all field values: diseaseName, description, impact text, treatment titles and descriptions, recommendations, etc.) MUST be in that language and script. No English in the response unless the language is English.

CRITICAL LOCATION REQUIREMENT:
The location "${location}" is the PRIMARY factor for your analysis. ALL recommendations, treatment plans, and environmental assessments MUST be specific to this location. Consider:
- Regional climate patterns and typical weather conditions for this location
- Common diseases and pests in this region
- Local agricultural practices and available products
- Regional soil characteristics (provided below)
- Seasonal timing appropriate for this location

CROP INFORMATION:
- Crop Type: ${finalCropType}
- Growth Stage: ${finalGrowthStage}
- Location: ${location}${locationInfo.city ? ` (City: ${locationInfo.city})` : ''}${locationInfo.state ? ` (State/Region: ${locationInfo.state})` : ''}${locationInfo.country ? ` (Country: ${locationInfo.country})` : ''}
- Soil Condition: ${finalSoilCondition}
- Recent Weather: ${finalWeatherCondition}
${description ? `- Additional Notes: ${description}` : ""}

REGIONAL SOIL CHARACTERISTICS FOR ${location.toUpperCase()}:
${regionalSoilInfo}

IMPORTANT: Use the above regional soil data to inform your recommendations. If the user-provided soil condition differs from regional norms, consider both in your analysis.

TASK:
Analyze the crop images provided and create a detailed diagnosis report in the following JSON format. Be thorough, accurate, and provide actionable recommendations that are SPECIFIC TO THE LOCATION PROVIDED.

REQUIRED JSON FORMAT:
{
  "diagnosis": {
    "diseaseName": "Name of the disease or issue identified",
    "severity": "Low" | "Moderate" | "High" | "Critical",
    "confidence": "percentage as number (0-100)",
    "description": "Detailed description of the disease/issue, its causes, and symptoms visible in the images",
    "scientificName": "Scientific name of pathogen if applicable"
  },
  "environmentalFactors": {
    "humidity": {
      "value": "percentage or description",
      "riskLevel": "LOW" | "MODERATE" | "HIGH",
      "impact": "How this affects the disease"
    },
    "temperature": {
      "value": "temperature range or description",
      "riskLevel": "LOW" | "MODERATE" | "HIGH",
      "impact": "How this affects the disease"
    },
    "overallRisk": "percentage (0-100)"
  },
  "impact": {
    "yieldLoss": "estimated percentage range (e.g., '20-40%')",
    "timeframe": "timeframe for impact (e.g., 'within 7 days')",
    "description": "Detailed explanation of potential impact without intervention"
  },
  "treatmentPlan": {
    "immediate": [
      {
        "title": "Action title",
        "description": "Detailed action description",
        "timeline": "WITHIN 24 HOURS",
        "type": "organic" | "chemical" | "cultural",
        "products": ["Product recommendations if applicable"]
      }
    ],
    "followUp": [
      {
        "title": "Action title",
        "description": "Detailed action description",
        "timeline": "DAY 3-7",
        "type": "organic" | "chemical" | "cultural"
      }
    ],
    "prevention": [
      {
        "title": "Action title",
        "description": "Detailed action description",
        "timeline": "POST-SEASON",
        "type": "organic" | "chemical" | "cultural"
      }
    ]
  },
  "recommendations": {
    "pruning": "Specific pruning recommendations",
    "watering": "Watering schedule and method recommendations",
    "fertilization": "Fertilization recommendations if applicable",
    "monitoring": "What to monitor and how often"
  }
}

CRITICAL REQUIREMENTS:
1. LOCATION-SPECIFIC ANALYSIS (MANDATORY):
   - ALL recommendations MUST be tailored to "${location}"
   - Consider regional climate, typical weather patterns, and seasonal conditions for this location
   - Reference common diseases and pests that occur in this region
   - Recommend products and treatments available/effective in this location
   - Consider local agricultural extension recommendations for this region

2. REGIONAL SOIL CONSIDERATION (MANDATORY):
   - Use the regional soil characteristics provided above as the baseline
   - If user-provided soil condition differs, explain how it affects the diagnosis
   - Adjust treatment recommendations based on regional soil pH, nutrient levels, and soil type
   - Consider common soil issues in this region

3. ENVIRONMENTAL FACTORS:
   - Base humidity and temperature assessments on typical conditions for "${location}"
   - Consider seasonal weather patterns for this location
   - Factor in regional climate risks (drought, flooding, frost, etc.)

4. TREATMENT RECOMMENDATIONS:
   - Recommend products and treatments that are available and effective in "${location}"
   - Consider local regulations and agricultural practices
   - Provide location-specific application timing based on regional growing seasons
   - Include both organic and chemical options when applicable, but prioritize what works best in this region

5. GENERAL REQUIREMENTS:
   - Base your analysis on the actual images provided
   - Be realistic about timelines and expected outcomes
   - If multiple issues are detected, prioritize the most critical
   - Return ONLY valid JSON, no additional text before or after

Now analyze the images and provide the diagnosis report in the exact JSON format specified above, ensuring ALL recommendations are specific to "${location}".`

    // Prepare content parts (text + images)
    const contentParts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [
      { text: prompt },
      ...imageParts,
    ]

    // Call Gemini Flash API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: contentParts,
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      return NextResponse.json(
        { error: "Failed to get response from Gemini API", details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract the text from Gemini's response
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I couldn't generate a response. Please try again."

    // Try to parse JSON from the response
    let analysisResult
    try {
      // Extract JSON from response (handle cases where there might be extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.error("Response text:", responseText)
      
      // Fallback: create a structured response from the text
      analysisResult = {
        diagnosis: {
          diseaseName: "Analysis Error",
          severity: "Moderate",
          confidence: 50,
          description: responseText.substring(0, 500),
          scientificName: "Unknown",
        },
        environmentalFactors: {
          humidity: {
            value: "Unknown",
            riskLevel: "MODERATE",
            impact: "Unable to assess",
          },
          temperature: {
            value: "Unknown",
            riskLevel: "MODERATE",
            impact: "Unable to assess",
          },
          overallRisk: 50,
        },
        impact: {
          yieldLoss: "Unknown",
          timeframe: "Unknown",
          description: "Unable to assess impact",
        },
        treatmentPlan: {
          immediate: [],
          followUp: [],
          prevention: [],
        },
        recommendations: {
          pruning: "Please consult with an agricultural expert.",
          watering: "Please consult with an agricultural expert.",
          fertilization: "Please consult with an agricultural expert.",
          monitoring: "Please consult with an agricultural expert.",
        },
      }
    }

    // Generate report ID
    const reportId = `AG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`

    // Return comprehensive report
    return NextResponse.json({
      reportId,
      timestamp: new Date().toISOString(),
      cropInfo: {
        cropType: finalCropType,
        growthStage: finalGrowthStage,
        location,
        soilCondition: finalSoilCondition,
        weatherCondition: finalWeatherCondition,
        description,
      },
      analysis: analysisResult,
      imageCount: cropImages.length,
    })
  } catch (error) {
    console.error("Error in diagnosis analysis:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
