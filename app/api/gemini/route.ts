import { NextRequest, NextResponse } from "next/server"
import { getGeminiLanguageInstruction } from "@/lib/i18n-locales"

export async function POST(request: NextRequest) {
  try {
    const { message, context, locale: localeParam } = await request.json()
    const locale = localeParam && typeof localeParam === "string" ? localeParam : "en"

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const languageInstruction = getGeminiLanguageInstruction(locale)

    // Build the prompt with context if provided; respond in user's language
    const prompt = context
      ? `You are an expert AI agronomist helping farmers with crop diagnosis and treatment. Use the following context to provide accurate, helpful advice:\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${message}\n\n${languageInstruction}\n\nProvide a clear, concise, and actionable response in the required language and script.`
      : `You are an expert AI agronomist helping farmers with crop diagnosis and treatment. Answer the following question with clear, concise, and actionable advice:\n\n${message}\n\n${languageInstruction}\n\nProvide your response in the required language and script.`

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      return NextResponse.json(
        { error: "Failed to get response from Gemini API" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract the text from Gemini's response
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I couldn't generate a response. Please try again."

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
