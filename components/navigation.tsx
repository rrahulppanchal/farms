"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { INDIAN_LOCALES } from "@/lib/i18n-locales"

const LOCALE_COOKIE = "NEXT_LOCALE"

function setLocaleCookie(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`
}

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("nav")
  const isHomePage = pathname === "/"

  const handleLocaleChange = (newLocale: string) => {
    setLocaleCookie(newLocale)
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 md:h-20 items-center gap-2 min-h-0">
          <div className="flex items-center gap-4 sm:gap-10 min-w-0 flex-1">
            <Link href="/" className="flex items-center cursor-pointer min-w-0 shrink-0">
              <Image
                src="/logo.png"
                alt={t("brand")}
                width={980}
                height={278}
                className="h-8 sm:h-10 md:h-16 w-auto object-contain"
                priority
              />
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
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="relative">
              <Select value={locale} onValueChange={handleLocaleChange}>
                <SelectTrigger className="relative appearance-none bg-transparent border border-gray-200 text-[#4B634B] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#2E7D32]/20 cursor-pointer pl-8 pr-6 sm:pl-9 sm:pr-7 py-1.5 sm:py-2 w-auto min-w-[88px] sm:min-w-[140px] rounded-full flex items-center gap-2 h-9 sm:h-10">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" />
                  </div>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_LOCALES.map(({ code, nativeName, name }) => (
                    <SelectItem key={code} value={code}>
                      <span className="font-medium">{nativeName}</span>
                      {/* <span className="text-gray-400 ml-1 text-xs">({name})</span> */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isHomePage && (
              <Link href="/diagnosis" className="shrink-0">
                <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-full font-semibold transition-all shadow-[0_10px_30px_-5px_rgba(46,125,50,0.2)] h-9 sm:h-10">
                  {t("getStarted")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}