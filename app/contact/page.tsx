"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  MapPin,
  Clock,
  Share2,
  Globe,
  Rss,
  Send,
  Info,
  MessageCircle,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "general", message: "" })

    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1A2E1A]">
      <main className="min-h-screen">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-bold text-[#1A2E1A] mb-4">
                Contact Us
              </h1>
              <p className="text-[#4B634B] text-lg max-w-2xl mx-auto">
                Have questions about our AI tools or expert consultation? Our team is here to support your farm's
                success.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Contact Info */}
              <div className="space-y-12">
                {/* Get in Touch */}
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Info className="w-6 h-6 text-[#2E7D32]" />
                    Get in Touch
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-[#2E7D32] shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A2E1A]">Support Email</p>
                        <a
                          href="mailto:support@agroailtd.com"
                          className="text-[#4B634B] hover:text-[#2E7D32] transition-colors"
                        >
                          support@agroailtd.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#795548] shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A2E1A]">Headquarters</p>
                        <p className="text-[#4B634B] leading-relaxed">
                          HSR Layout, Ahmedabad, Gujarat, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Hours */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#2E7D32]" />
                    Support Hours
                  </h2>
                  <Card className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-[#4B634B]">Monday - Friday</span>
                          <span className="font-medium text-[#1A2E1A]">8:00 AM - 8:00 PM EST</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-[#4B634B]">Saturday</span>
                          <span className="font-medium text-[#1A2E1A]">9:00 AM - 5:00 PM EST</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-[#4B634B]">Sunday</span>
                          <span className="font-medium text-[#1A2E1A]">AI Assistant Only (24/7)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Social Links */}
                <div>
                  <h2 className="text-xl font-bold mb-6">Follow Our Community</h2>
                  <div className="flex gap-4">
                    <Link
                      href="#"
                      className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4B634B] hover:bg-[#2E7D32] hover:text-white transition-all shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                    >
                      <Share2 className="w-5 h-5" />
                    </Link>
                    <Link
                      href="#"
                      className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4B634B] hover:bg-[#2E7D32] hover:text-white transition-all shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                    >
                      <Globe className="w-5 h-5" />
                    </Link>
                    <Link
                      href="#"
                      className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#4B634B] hover:bg-[#2E7D32] hover:text-white transition-all shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
                    >
                      <Rss className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <Card className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                {submitted ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                    <p className="text-lg font-semibold text-[#2E7D32]">Thank you for your message!</p>
                    <p className="text-sm text-[#4B634B] mt-2">We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="block text-sm font-semibold text-[#1A2E1A] mb-2">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="block text-sm font-semibold text-[#1A2E1A] mb-2">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="block text-sm font-semibold text-[#1A2E1A] mb-2">
                        Subject
                      </Label>
                      <Select value={formData.subject} onValueChange={handleSubjectChange}>
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all outline-none bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="expert">Expert Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="block text-sm font-semibold text-[#1A2E1A] mb-2">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you today?"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all outline-none resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_10px_30px_-5px_rgba(46,125,50,0.2)] flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Other Ways to Connect */}
            <div className="mt-20 pt-12 border-t border-gray-100">
              <div className="text-center mb-10">
                <h3 className="text-xl font-bold text-[#1A2E1A]">Other Ways to Connect</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                <Link
                  href="#"
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-2xl hover:border-[#2E7D32]/30 transition-all shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] group"
                >
                  <MessageCircle className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs text-[#4B634B] font-semibold uppercase">WhatsApp Support</p>
                    <p className="text-[#1A2E1A] font-bold">+91 812 712 9312</p>
                  </div>
                </Link>
                <Link
                  href="tel:+918127129312"
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-2xl hover:border-[#2E7D32]/30 transition-all shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] group"
                >
                  <Phone className="w-8 h-8 text-[#2E7D32] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs text-[#4B634B] font-semibold uppercase">Phone</p>
                    <p className="text-[#1A2E1A] font-bold">+91 812 712 9312</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}