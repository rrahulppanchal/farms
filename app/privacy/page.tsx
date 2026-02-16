"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Leaf, Shield, Database, Lock, Mail } from "lucide-react"

export default function PrivacyPage() {
  const t = useTranslations("footer")

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1A2E1A]">
      <main>
        <section className="relative py-20 bg-[#E8F5E9] overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <Leaf className="w-[400px] h-[400px] text-[#2E7D32] select-none" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-[#2E7D32]" />
              <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-bold text-[#1A2E1A]">
                {t("privacy")}
              </h1>
            </div>
            <p className="text-lg text-[#4B634B]">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div>
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-[#1A2E1A] mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#2E7D32]" />
                Information We Collect
              </h2>
              <p className="text-[#4B634B] leading-relaxed mb-4">
                AgroAI collects information you provide when using our services, including crop images, location data,
                soil and weather details, and any descriptions you submit for diagnosis. We use this data solely to
                provide AI-powered agricultural analysis and to improve our models and service quality.
              </p>
              <p className="text-[#4B634B] leading-relaxed">
                We may collect technical information such as IP address, browser type, and device information for
                security, analytics, and to ensure the service works correctly across devices.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-[#1A2E1A] mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#2E7D32]" />
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-[#4B634B] space-y-2 leading-relaxed">
                <li>To generate and display diagnosis reports and treatment recommendations</li>
                <li>To improve our AI models and agricultural insights (aggregated and anonymized where applicable)</li>
                <li>To respond to your requests and provide customer support</li>
                <li>To send service-related communications (e.g., report availability)</li>
                <li>To comply with legal obligations and protect our rights and users’ safety</li>
              </ul>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-[#1A2E1A] mb-4">
                Data Retention & Security
              </h2>
              <p className="text-[#4B634B] leading-relaxed mb-4">
                We retain your diagnosis data only as long as needed to provide the service and as required by law. We
                implement appropriate technical and organizational measures to protect your data against unauthorized
                access, loss, or alteration.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-[#1A2E1A] mb-4">
                Third-Party Services
              </h2>
              <p className="text-[#4B634B] leading-relaxed">
                We may use third-party services (e.g., cloud hosting, analytics) that process data on our behalf. These
                providers are bound by agreements that require them to protect your information and use it only for the
                purposes we specify.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-[#1A2E1A] mb-4">
                Your Rights
              </h2>
              <p className="text-[#4B634B] leading-relaxed mb-4">
                Depending on your location, you may have the right to access, correct, delete, or restrict processing of
                your personal data, or to object to certain processing. To exercise these rights or ask questions about
                our privacy practices, please contact us.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-[#1A2E1A] mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#2E7D32]" />
                Contact Us
              </h2>
              <p className="text-[#4B634B] leading-relaxed">
                For privacy-related questions or requests, contact us at{" "}
                <a href="mailto:privacy@agroai.example.com" className="text-[#2E7D32] hover:underline font-medium">
                  privacy@agroai.example.com
                </a>
                .
              </p>
            </div>

            <div className="flex justify-start">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#2E7D32] hover:text-[#1B5E20] font-semibold transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
