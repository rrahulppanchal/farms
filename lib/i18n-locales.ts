/**
 * Indian languages supported for UI rendering and AI-generated text.
 * ISO 639-1 codes with native names for the language switcher.
 * Used by APIs to instruct Gemini to respond in the correct language and script.
 */
export const INDIAN_LOCALES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
] as const;

export type LocaleCode = (typeof INDIAN_LOCALES)[number]["code"];

export const LOCALE_CODES: LocaleCode[] = INDIAN_LOCALES.map((l) => l.code);

export const DEFAULT_LOCALE: LocaleCode = "en";

/** Display name for switcher (native name preferred). */
export function getLocaleDisplayName(code: string): string {
  return INDIAN_LOCALES.find((l) => l.code === code)?.nativeName ?? code;
}

/**
 * Language instruction for Gemini API: respond in this language using native script.
 * Used in diagnosis and chat API prompts.
 */
export const GEMINI_LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: "Respond in English.",
  hi: "Respond entirely in Hindi (हिन्दी) using Devanagari script.",
  bn: "Respond entirely in Bengali (বাংলা) using Bengali script.",
  te: "Respond entirely in Telugu (తెలుగు) using Telugu script.",
  mr: "Respond entirely in Marathi (मराठी) using Devanagari script.",
  ta: "Respond entirely in Tamil (தமிழ்) using Tamil script.",
  gu: "Respond entirely in Gujarati (ગુજરાતી) using Gujarati script.",
  kn: "Respond entirely in Kannada (ಕನ್ನಡ) using Kannada script.",
  ml: "Respond entirely in Malayalam (മലയാളം) using Malayalam script.",
  pa: "Respond entirely in Punjabi (ਪੰਜਾਬੀ) using Gurmukhi script.",
  or: "Respond entirely in Odia (ଓଡ଼ିଆ) using Odia script.",
  as: "Respond entirely in Assamese (অসমীয়া) using Assamese/Bengali script.",
  ur: "Respond entirely in Urdu (اردو) using Perso-Arabic (Nastaliq) script.",
};

export function getGeminiLanguageInstruction(locale: string): string {
  return GEMINI_LANGUAGE_INSTRUCTION[locale] ?? GEMINI_LANGUAGE_INSTRUCTION.en;
}
