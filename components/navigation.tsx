"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Globe } from "lucide-react"
import { INDIAN_LOCALES } from "@/lib/i18n-locales"

const LOCALE_COOKIE = "NEXT_LOCALE"

function setLocaleCookie(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`
}

export default function Navigation() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("nav")

  const handleLocaleChange = (newLocale: string) => {
    setLocaleCookie(newLocale)
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-8 h-8 text-[#2E7D32]" />
              <span className="font-[family-name:var(--font-merriweather)] font-bold text-2xl text-[#1A2E1A] tracking-tight">{t("brand")}</span>
            </Link>
            {/* <div className="hidden lg:flex space-x-8">
              <Link
                href="/diagnosis"
                className={cn(
                  "text-[#4B634B] hover:text-[#2E7D32] transition-colors font-medium text-sm",
                  pathname === "/diagnosis" && "text-[#2E7D32]"
                )}
              >
                Diagnosis
              </Link>
              <Link
                href="#"
                className={cn(
                  "text-[#4B634B] hover:text-[#2E7D32] transition-colors font-medium text-sm",
                  pathname === "/chat" && "text-[#2E7D32]"
                )}
              >
                Expert Chat
              </Link>
              <Link
                href="#pricing"
                className={cn(
                  "text-[#4B634B] hover:text-[#2E7D32] transition-colors font-medium text-sm",
                  pathname === "/pricing" && "text-[#2E7D32]"
                )}
              >
                Always Free
              </Link>
              <Link
                href="#faq"
                className={cn(
                  "text-[#4B634B] hover:text-[#2E7D32] transition-colors font-medium text-sm",
                  pathname === "/faq" && "text-[#2E7D32]"
                )}
              >
                FAQ
              </Link>
            </div> */}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Select value={locale} onValueChange={handleLocaleChange}>
                <SelectTrigger className="relative appearance-none bg-transparent border border-gray-200 text-[#4B634B] text-sm font-medium focus:ring-2 focus:ring-[#2E7D32]/20 cursor-pointer pl-10 pr-8 py-2 w-auto min-w-[140px] rounded-full flex items-center gap-2">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                    <Globe className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_LOCALES.map(({ code, nativeName, name }) => (
                    <SelectItem key={code} value={code}>
                      <span className="font-medium">{nativeName}</span>
                      <span className="text-gray-400 ml-1 text-xs">({name})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link href="/diagnosis">
              <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-[0_10px_30px_-5px_rgba(46,125,50,0.2)]">
                {t("getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}