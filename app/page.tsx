import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import {
  Leaf,
  Sparkles,
  Calculator,
  Bot,
  CheckCircle2,
  Star,
  PlayCircle,
  BarChart3,
} from "lucide-react"
import Image from "next/image"

export default async function Home() {
  const t = await getTranslations("home")

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Healthy Farm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrttrurBXIRTLt-qUw2YzkwBmgwt6rhz3PXKi1MSFRHIv0dEeRUd4qDtmijLn4u6EyF2Y-MznKls_RgfKQuRafFuZTTXSK7yBx5Ur6cNAtq-dwFeyqJPHQjeSldeDpdjIHPQ-kqVdhwS0rMz6lU89jQ0TlbF92oZSI4J3xY5NHTYof_yLJLLK06ant8MCmmJykmTsUKMKRIysVlVVRDZCur-eurf6V-gNyhUcY9bfqoUKam72dLdcRF4-2wUUWvTyt7TQJ7xOU8Xhm"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFDFB]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-white/90 border border-white/70 text-[#2E7D32] font-semibold text-xs sm:text-sm mb-4 sm:mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32]/70 opacity-70"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]/80"></span>
            </span>
            {t("badge")}
          </div>
          <h1 className="font-[family-name:var(--font-merriweather)] text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-sm px-1">
            {t("title")}
            <br />
            <span className="text-white">{t("titleLine2")}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed font-light px-1">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
            <Link href="/diagnosis" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl font-bold text-base sm:text-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("ctaAnalysis")}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white hover:bg-gray-50 text-[#2E7D32] border-white rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              {t("ctaDemo")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A2E1A] mb-3 sm:mb-4">{t("featuresHeading")}</h2>
            <p className="text-[#4B634B] text-base sm:text-lg max-w-2xl mx-auto px-1">{t("featuresSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 bg-[#FDFDFB] hover:border-[#2E7D32]/30 hover:shadow-[0_10px_40px_-10px_rgba(46,125,50,0.15)] transition-all duration-500 ease-out group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-green-100 flex items-center justify-center text-[#2E7D32] mb-4 sm:mb-6 group-hover:bg-[#2E7D32] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-pulse" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-[#2E7D32] transition-colors duration-300">{t("feature1Title")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-[#4B634B] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 group-hover:text-[#1A2E1A] transition-colors duration-300">{t("feature1Desc")}</CardDescription>
                  <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5 text-xs sm:text-sm font-medium text-[#4B634B]">
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E7D32] shrink-0" />
                      <span>{t("feature1Bullet1")}</span>
                    </li>
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E7D32] shrink-0" />
                      <span>{t("feature1Bullet2")}</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            <Card className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 bg-[#FDFDFB] hover:border-orange-300/50 hover:shadow-[0_10px_40px_-10px_rgba(192,86,33,0.15)] transition-all duration-500 ease-out group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 sm:mb-6 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  <Calculator className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-pulse" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">{t("feature2Title")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-[#4B634B] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 group-hover:text-[#1A2E1A] transition-colors duration-300">{t("feature2Desc")}</CardDescription>
                  <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5 text-xs sm:text-sm font-medium text-[#4B634B]">
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                      <span>{t("feature2Bullet1")}</span>
                    </li>
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                      <span>{t("feature2Bullet2")}</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            <Card className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 bg-[#FDFDFB] hover:border-blue-300/50 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.15)] transition-all duration-500 ease-out group cursor-pointer overflow-hidden sm:col-span-2 md:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl" aria-hidden="true" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  <Bot className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-pulse" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">{t("feature3Title")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-[#4B634B] text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 group-hover:text-[#1A2E1A] transition-colors duration-300">{t("feature3Desc")}</CardDescription>
                  <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5 text-xs sm:text-sm font-medium text-[#4B634B]">
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                      <span>{t("feature3Bullet1")}</span>
                    </li>
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                      <span>{t("feature3Bullet2")}</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Three Steps Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-[#FDFDFB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A2E1A]">{t("threeStepsHeading")}</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[#2E7D32]/30 -z-10" aria-hidden="true" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white border-2 sm:border-4 border-[#2E7D32] shadow-lg flex items-center justify-center text-xl sm:text-2xl font-bold text-[#2E7D32] mx-auto mb-4 sm:mb-6 relative">1</div>
                <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{t("step1Title")}</h4>
                <p className="text-[#4B634B] text-xs sm:text-sm">{t("step1Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white border-2 sm:border-4 border-[#2E7D32] shadow-lg flex items-center justify-center text-xl sm:text-2xl font-bold text-[#2E7D32] mx-auto mb-4 sm:mb-6">2</div>
                <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{t("step2Title")}</h4>
                <p className="text-[#4B634B] text-xs sm:text-sm">{t("step2Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white border-2 sm:border-4 border-[#2E7D32] shadow-lg flex items-center justify-center text-xl sm:text-2xl font-bold text-[#2E7D32] mx-auto mb-4 sm:mb-6">3</div>
                <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{t("step3Title")}</h4>
                <p className="text-[#4B634B] text-xs sm:text-sm">{t("step3Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border-2 border-[#2E7D32] shadow-[0_10px_30px_-5px_rgba(46,125,50,0.2)] p-4 sm:p-6 md:p-8 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 sm:p-4">
              <div className="bg-[#2E7D32]/10 text-[#2E7D32] px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2">
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">{t("communitySponsored")}</span>
              </div>
            </div>
            <div className="relative z-10 text-center pt-8 sm:pt-0">
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A2E1A] mb-3 sm:mb-4">{t("pricingHeading")}</h2>
              <p className="text-[#4B634B] text-base sm:text-lg mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto px-0 sm:px-2">{t("pricingSubtitle")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12 text-left">
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FDFDFB]">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1A2E1A] text-sm sm:text-base">{t("pricingUnlimitedTitle")}</h4>
                    <p className="text-xs sm:text-sm text-[#4B634B] mt-0.5">{t("pricingUnlimitedDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FDFDFB]">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1A2E1A] text-sm sm:text-base">{t("pricingExpertTitle")}</h4>
                    <p className="text-xs sm:text-sm text-[#4B634B] mt-0.5">{t("pricingExpertDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FDFDFB] sm:col-span-2 md:col-span-1">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1A2E1A] text-sm sm:text-base">{t("pricingCostTitle")}</h4>
                    <p className="text-xs sm:text-sm text-[#4B634B] mt-0.5">{t("pricingCostDesc")}</p>
                  </div>
                </div>
              </div>
              <Link href="/diagnosis" className="inline-block">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl transition-all shadow-lg transform hover:-translate-y-1"
                >
                  {t("getStartedForFree")}
                </Button>
              </Link>
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#4B634B]">{t("farmersCount")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-[#FDFDFB]" id="faq">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A2E1A] mb-3 sm:mb-4">{t("faqHeading")}</h2>
            <p className="text-[#4B634B] text-base sm:text-lg">{t("faqSubtitle")}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-semibold text-[#1A2E1A] text-left">
                {t("faq1Q")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 sm:px-6 sm:pb-6 text-[#4B634B] text-sm sm:text-base leading-relaxed">
                {t("faq1A")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-semibold text-[#1A2E1A] text-left">
                {t("faq2Q")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 sm:px-6 sm:pb-6 text-[#4B634B] text-sm sm:text-base leading-relaxed">
                {t("faq2A")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-semibold text-[#1A2E1A] text-left">
                {t("faq3Q")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 sm:px-6 sm:pb-6 text-[#4B634B] text-sm sm:text-base leading-relaxed">
                {t("faq3A")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-semibold text-[#1A2E1A] text-left">
                {t("faq4Q")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 sm:px-6 sm:pb-6 text-[#4B634B] text-sm sm:text-base leading-relaxed">
                {t("faq4A")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonial Section - Indian farmer */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-[#2E7D32] rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-4 sm:p-6 md:p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-white/10 rounded-full -mr-20 sm:-mr-28 md:-mr-32 -mt-20 sm:-mt-28 md:-mt-32 blur-3xl" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex gap-0.5 sm:gap-1 text-yellow-400 mb-4 sm:mb-6 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400" />
                ))}
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-[family-name:var(--font-merriweather)] italic leading-relaxed mb-6 sm:mb-8 text-center sm:text-left">
                &ldquo;{t("testimonialQuote")}&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 overflow-hidden shrink-0 ring-2 ring-white/30">
                  <Image
                    alt="Indian farmer testimonial"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXv7LHCtr6XB6c2GZ7r38EPPKgQPHbvxNjJ8-qMTA8GUukHSIp2jn0IjH0pC5aIt5Fsog9C5h0M72YVLeqSKKqLtSYFA2fxx8xrFlAB2D6hculusnIN3LKujjcWIHdW3cd27kuWzh2VhabporUVpiuuxTPVH6dsCKO5tiyOsawZs5_L6IT_nGdmIV3uKDczMeQy5bGq9y4gvAV_hBCbhob9ziLbQnyNBe-5i0n7JCcDNm4TfYOWeuYTDyoUZOomjvcWK7_u4JGCKY5"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h5 className="text-base sm:text-lg md:text-xl font-bold">{t("testimonialName")}</h5>
                  <p className="text-white/80 text-sm sm:text-base">{t("testimonialRole")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}