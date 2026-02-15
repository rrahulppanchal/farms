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
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-white/70 text-[#2E7D32] font-semibold text-sm mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32]/70 opacity-70"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]/80"></span>
            </span>
            {t("badge")}
          </div>
          <h1 className="font-[family-name:var(--font-merriweather)] text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
            {t("title")}
            <br />
            <span className="text-white">{t("titleLine2")}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/diagnosis">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                {t("ctaAnalysis")}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-[#2E7D32] border-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              {t("ctaDemo")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#1A2E1A] mb-4">{t("featuresHeading")}</h2>
            <p className="text-[#4B634B] text-lg max-w-2xl mx-auto">{t("featuresSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="relative p-6 sm:p-8 rounded-3xl border border-gray-100 bg-[#FDFDFB] hover:border-[#2E7D32]/30 hover:shadow-[0_10px_40px_-10px_rgba(46,125,50,0.15)] transition-all duration-500 ease-out group cursor-pointer overflow-hidden">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-[#2E7D32] mb-6 group-hover:bg-[#2E7D32] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-[#2E7D32] transition-colors duration-300">
                    Multi-Factor Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-[#4B634B] leading-relaxed mb-4 group-hover:text-[#1A2E1A] transition-colors duration-300">
                    Combine crop imaging, soil analysis, and local weather patterns for high-precision diagnostic accuracy.
                  </CardDescription>
                  <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#4B634B]">
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D32] group-hover:scale-110 transition-transform duration-300" />
                      <span>Satellite imagery analysis</span>
                    </li>
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D32] group-hover:scale-110 transition-transform duration-300 delay-75" />
                      <span>Real-time soil metrics</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            <Card className="relative p-6 sm:p-8 rounded-3xl border border-gray-100 bg-[#FDFDFB] hover:border-orange-300/50 hover:shadow-[0_10px_40px_-10px_rgba(192,86,33,0.15)] transition-all duration-500 ease-out group cursor-pointer overflow-hidden">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  <Calculator className="w-8 h-8 group-hover:animate-pulse" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    Actionable Treatment Plans
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-[#4B634B] leading-relaxed mb-4 group-hover:text-[#1A2E1A] transition-colors duration-300">
                    Step-by-step recovery plans including localized cost estimations for fertilizers, pesticides, and labor.
                  </CardDescription>
                  <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#4B634B]">
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                      <span>Cost transparency</span>
                    </li>
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-300 delay-75" />
                      <span>Inventory management</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            <Card className="relative p-6 sm:p-8 rounded-3xl border border-gray-100 bg-[#FDFDFB] hover:border-blue-300/50 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.15)] transition-all duration-500 ease-out group cursor-pointer overflow-hidden">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  <Bot className="w-8 h-8 group-hover:animate-pulse" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    24/7 AI Agronomist Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-[#4B634B] leading-relaxed mb-4 group-hover:text-[#1A2E1A] transition-colors duration-300">
                    Instant answers to any agricultural questions. Our AI is trained on decades of agronomic research.
                  </CardDescription>
                  <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#4B634B]">
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                      <span>Localized advice</span>
                    </li>
                    <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300 delay-75" />
                      <span>Multi-language support</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Three Steps Section */}
      <section className="py-24 bg-[#FDFDFB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#1A2E1A]">{t("threeStepsHeading")}</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[#2E7D32]/30 -z-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-[#2E7D32] shadow-lg flex items-center justify-center text-2xl font-bold text-[#2E7D32] mx-auto mb-6 relative">1</div>
                <h4 className="text-lg font-bold mb-2">{t("step1Title")}</h4>
                <p className="text-[#4B634B] text-sm">{t("step1Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-[#2E7D32] shadow-lg flex items-center justify-center text-2xl font-bold text-[#2E7D32] mx-auto mb-6">2</div>
                <h4 className="text-lg font-bold mb-2">{t("step2Title")}</h4>
                <p className="text-[#4B634B] text-sm">{t("step2Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-[#2E7D32] shadow-lg flex items-center justify-center text-2xl font-bold text-[#2E7D32] mx-auto mb-6">3</div>
                <h4 className="text-lg font-bold mb-2">{t("step3Title")}</h4>
                <p className="text-[#4B634B] text-sm">{t("step3Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border-2 border-[#2E7D32] shadow-[0_10px_30px_-5px_rgba(46,125,50,0.2)] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-[#2E7D32]/10 text-[#2E7D32] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Community Sponsored
              </div>
            </div>
            <div className="relative z-10 text-center">
              <h2 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-bold text-[#1A2E1A] mb-4">{t("pricingHeading")}</h2>
              <p className="text-[#4B634B] text-lg mb-12 max-w-2xl mx-auto">{t("pricingSubtitle")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDFDFB]">
                  <CheckCircle2 className="w-8 h-8 text-[#2E7D32] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A2E1A]">Unlimited Diagnosis</h4>
                    <p className="text-sm text-[#4B634B]">Analyze as many crops as you need, whenever you need.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDFDFB]">
                  <CheckCircle2 className="w-8 h-8 text-[#2E7D32] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A2E1A]">Expert Chat</h4>
                    <p className="text-sm text-[#4B634B]">Direct 24/7 access to our AI-powered agronomist network.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDFDFB]">
                  <CheckCircle2 className="w-8 h-8 text-[#2E7D32] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1A2E1A]">Cost Estimator</h4>
                    <p className="text-sm text-[#4B634B]">Get precise budget plans for all recommended treatments.</p>
                  </div>
                </div>
              </div>
              <Link href="/diagnosis">
                <Button
                  size="lg"
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-lg transform hover:-translate-y-1"
                >
                  {t("getStartedForFree")}
                </Button>
              </Link>
              <p className="mt-6 text-sm text-[#4B634B]">{t("farmersCount")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#FDFDFB]" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#1A2E1A] mb-4">{t("faqHeading")}</h2>
            <p className="text-[#4B634B] text-lg">{t("faqSubtitle")}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#1A2E1A]">
                How accurate is the AI?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[#4B634B] leading-relaxed">
                Our AI models are trained on over 50 million labeled agricultural datasets and verified by certified agronomists. We maintain a 98.4% accuracy rate for major crop diseases and nutritional deficiencies when provided with clear images and local data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#1A2E1A]">
                What crops are supported?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[#4B634B] leading-relaxed">
                AgroAI currently supports over 120 different crops including major cereals (corn, wheat, rice), legumes, fruits, vegetables, and specialized cash crops like coffee and cocoa. We are constantly adding new varieties based on user feedback and regional needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#1A2E1A]">
                Is my data secure?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[#4B634B] leading-relaxed">
                Your data privacy is our top priority. All uploaded information is encrypted and stored securely. We do not sell individual farmer data to third parties. Agronomic data is only used in an aggregated, anonymous format to improve the AI models for the benefit of the entire farming community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 transition-all duration-300">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#1A2E1A]">
                How can it be free?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[#4B634B] leading-relaxed">
                AgroAI is supported by a consortium of international agricultural NGOs and philanthropic foundations committed to global food security. Their sponsorship allows us to provide professional-grade tools to every farmer regardless of their operation's size.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-[#2E7D32] rounded-[3rem] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400" />
                ))}
              </div>
              <p className="text-2xl md:text-3xl font-[family-name:var(--font-merriweather)] italic leading-relaxed mb-8">
                "AgroAI helped us save 30% of our tomato crop during a blight outbreak. The diagnosis was instant, and the fact that it's completely free has been a game-changer for our cooperative."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
                  <Image
                    alt="Farmer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXv7LHCtr6XB6c2GZ7r38EPPKgQPHbvxNjJ8-qMTA8GUukHSIp2jn0IjH0pC5aIt5Fsog9C5h0M72YVLeqSKKqLtSYFA2fxx8xrFlAB2D6hculusnIN3LKujjcWIHdW3cd27kuWzh2VhabporUVpiuuxTPVH6dsCKO5tiyOsawZs5_L6IT_nGdmIV3uKDczMeQy5bGq9y4gvAV_hBCbhob9ziLbQnyNBe-5i0n7JCcDNm4TfYOWeuYTDyoUZOomjvcWK7_u4JGCKY5"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-xl font-bold">John Stevenson</h5>
                  <p className="text-white/70">Heritage Organic Farms, Ohio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}