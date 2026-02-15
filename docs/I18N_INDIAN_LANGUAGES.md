# Indian Languages Integration (i18n)

AgroAI supports **UI text** and **AI-generated text** in major Indian languages.

## How it works

1. **UI (rendering)**  
   - `next-intl` loads messages from `messages/{locale}.json`.  
   - Locale is stored in cookie `NEXT_LOCALE` and read in `i18n/request.ts`.  
   - Nav bar language switcher sets the cookie and refreshes the app.

2. **AI (diagnosis & chat)**  
   - Current locale is sent to `/api/diagnosis/analyze` (form field `locale`) and `/api/gemini` (body `locale`).  
   - Prompts include a language instruction from `lib/i18n-locales.ts` so Gemini responds in that language and script.

## Supported locales (ISO 639-1)

| Code | Language  | Script        |
|------|-----------|---------------|
| en   | English   | Latin         |
| hi   | Hindi     | Devanagari    |
| bn   | Bengali   | Bengali       |
| te   | Telugu    | Telugu        |
| mr   | Marathi   | Devanagari    |
| ta   | Tamil     | Tamil         |
| gu   | Gujarati  | Gujarati      |
| kn   | Kannada   | Kannada       |
| ml   | Malayalam | Malayalam     |
| pa   | Punjabi   | Gurmukhi      |
| or   | Odia      | Odia          |
| as   | Assamese  | Assamese/Bengali |
| ur   | Urdu      | Perso-Arabic  |

## Adding a new language (e.g. Tamil)

1. **Add messages**  
   Create `messages/ta.json` with the same structure as `messages/en.json`.  
   You can copy `en.json` and translate values. Missing keys fall back to English.

2. **Locale is already listed**  
   `lib/i18n-locales.ts` already includes all the locales above. The switcher and API will use the new locale as soon as the message file exists.

3. **Optional: tune AI instruction**  
   In `lib/i18n-locales.ts`, adjust `GEMINI_LANGUAGE_INSTRUCTION["ta"]` if you want a different instruction for Gemini.

## Install note (Next.js 16)

`next-intl` may not yet list Next 16 as a peer. Install with:

```bash
npm install next-intl --legacy-peer-deps
```

Or add to `package.json`:

```json
"overrides": {
  "next-intl": {
    "next": "$next"
  }
}
```

Then run `npm install`.

## File reference

- `lib/i18n-locales.ts` – Locale list, display names, Gemini language instructions  
- `i18n/request.ts` – Reads cookie, loads `messages/{locale}.json`  
- `messages/en.json`, `messages/hi.json` – UI strings  
- `app/layout.tsx` – `NextIntlClientProvider`, `getLocale()`, `getMessages()`  
- `components/navigation.tsx` – Language switcher (sets cookie, refresh)  
- `app/api/diagnosis/analyze/route.ts` – Uses `locale` form field and `getGeminiLanguageInstruction(locale)`  
- `app/api/gemini/route.ts` – Uses `locale` from JSON body and `getGeminiLanguageInstruction(locale)`
