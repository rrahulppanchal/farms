"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Share2, Globe } from "lucide-react"

export default function Footer() {
  const t = useTranslations("footer")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-8 h-8 text-[#2E7D32]" />
              <span className="font-[family-name:var(--font-merriweather)] font-bold text-2xl text-[#1A2E1A]">AgroAI</span>
            </div>
            <p className="text-[#4B634B] text-sm leading-relaxed mb-6">
              {t("tagline")}
            </p>
            <div className="flex gap-4">
              <Link 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#4B634B] hover:text-[#2E7D32] transition-colors shadow-sm"
              >
                <Share2 className="w-5 h-5" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#4B634B] hover:text-[#2E7D32] transition-colors shadow-sm"
              >
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h6 className="font-bold text-[#1A2E1A] mb-6">{t("product")}</h6>
            <ul className="space-y-4 text-sm text-[#4B634B]">
              <li>
                <Link href="/diagnosis" className="hover:text-[#2E7D32] transition-colors">
                  {t("aiDiagnosis")}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#2E7D32] transition-colors">
                  {t("alwaysFree")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-[#1A2E1A] mb-6">{t("company")}</h6>
            <ul className="space-y-4 text-sm text-[#4B634B]">
              <li>
                <Link href="/about" className="hover:text-[#2E7D32] transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-[#2E7D32] transition-colors">
                  {t("sustainability")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#2E7D32] transition-colors">
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2E7D32] transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-[#1A2E1A] mb-6">{t("resources")}</h6>
            <ul className="space-y-4 text-sm text-[#4B634B]">
              <li>
                <Link href="/#faq" className="hover:text-[#2E7D32] transition-colors">
                  {t("helpFaq")}
                </Link>
              </li>
            </ul>
            <h6 className="font-bold text-[#1A2E1A] mb-4 mt-8">{t("newsletter")}</h6>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all outline-none"
                required
              />
              <Button 
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md"
              >
                {t("subscribe")}
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#4B634B]">
          <p>© {currentYear} AgroAI. {t("copyright")}</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-[#2E7D32] transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-[#2E7D32] transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}