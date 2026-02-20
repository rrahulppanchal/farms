import { NextRequest, NextResponse } from "next/server"
import { getGeminiLanguageInstruction } from "@/lib/i18n-locales"

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  return `data:${file.type};base64,${base64}`
}

// Helper function to extract location components
function parseLocation(location: string): { city?: string; state?: string; country?: string; region?: string } {
  const parts = location.split(',').map(p => p.trim())
  const result: { city?: string; state?: string; country?: string; region?: string } = {}
  
  if (parts.length >= 1) result.city = parts[0]
  if (parts.length >= 2) result.state = parts[1]
  if (parts.length >= 3) result.country = parts[2]
  
  // Determine region based on state/country
  if (result.state) {
    result.region = result.state
  } else if (result.country) {
    result.region = result.country
  }
  
  return result
}

// Helper function to get regional soil characteristics
function getRegionalSoilData(location: string): string {
  const loc = parseLocation(location)
  const region = loc.state || loc.country || location.toLowerCase()
  
  // Common regional soil characteristics database
  const regionalSoilData: Record<string, string> = {
    // US States
    'iowa': 'Iowa soils are predominantly Mollisols (prairie soils) with high organic matter (3-5%), well-drained, pH 6.0-7.5. Common soil types: Clarion-Nicollet-Webster series (loamy), Tama series (silty clay loam). Typical nutrient levels: N 120-180 ppm, P 15-30 ppm, K 150-250 ppm. High cation exchange capacity (CEC) 15-25 meq/100g.',
    'illinois': 'Illinois soils are primarily Mollisols with high fertility, organic matter 3-6%, pH 6.2-7.2. Common types: Drummer silty clay loam, Flanagan silt loam. Typical nutrients: N 100-200 ppm, P 20-40 ppm, K 180-300 ppm. CEC 18-28 meq/100g.',
    'indiana': 'Indiana soils are mostly Alfisols and Mollisols, well-drained, organic matter 2-5%, pH 6.0-7.0. Common: Miami silt loam, Crosby silt loam. Nutrients: N 110-170 ppm, P 18-35 ppm, K 160-280 ppm. CEC 16-24 meq/100g.',
    'ohio': 'Ohio soils are primarily Alfisols, well-drained, organic matter 2-4%, pH 6.2-7.0. Common: Hoytville clay loam, Canfield silt loam. Nutrients: N 100-160 ppm, P 15-30 ppm, K 150-250 ppm. CEC 14-22 meq/100g.',
    'minnesota': 'Minnesota soils are Mollisols with high organic matter (4-8%), pH 6.0-7.5. Common: Barnes loam, Bearden silty clay loam. Nutrients: N 120-200 ppm, P 20-45 ppm, K 200-350 ppm. CEC 20-30 meq/100g.',
    'nebraska': 'Nebraska soils are Mollisols, well-drained, organic matter 2-4%, pH 6.5-7.8. Common: Holdrege silt loam, Sharpsburg silty clay loam. Nutrients: N 90-150 ppm, P 12-25 ppm, K 180-300 ppm. CEC 16-26 meq/100g.',
    'missouri': 'Missouri soils are Alfisols and Mollisols, variable drainage, organic matter 2-5%, pH 5.5-7.0. Common: Mexico silt loam, Putnam silt loam. Nutrients: N 80-140 ppm, P 10-25 ppm, K 120-220 ppm. CEC 12-20 meq/100g.',
    'kansas': 'Kansas soils are Mollisols, well-drained, organic matter 2-4%, pH 6.5-7.5. Common: Harney silt loam, Crete silt loam. Nutrients: N 85-145 ppm, P 12-28 ppm, K 160-280 ppm. CEC 15-25 meq/100g.',
    'wisconsin': 'Wisconsin soils are Alfisols and Mollisols, well-drained, organic matter 3-6%, pH 6.0-7.2. Common: Miami silt loam, Fayette silt loam. Nutrients: N 100-170 ppm, P 15-32 ppm, K 150-270 ppm. CEC 16-24 meq/100g.',
    'michigan': 'Michigan soils are Alfisols, well-drained, organic matter 2-5%, pH 6.0-7.0. Common: Capac loam, Coloma sandy loam. Nutrients: N 90-150 ppm, P 12-28 ppm, K 140-250 ppm. CEC 14-22 meq/100g.',
    
    // Other regions (can be expanded)
    'california': 'California soils vary widely: Central Valley has alluvial soils (pH 7.0-8.5), coastal areas have loamy soils (pH 6.5-7.5). Organic matter 1-3%. Nutrients vary by region.',
    'texas': 'Texas soils are diverse: Blackland Prairie has Vertisols (pH 7.5-8.5), East Texas has Alfisols (pH 5.5-7.0). Organic matter 1-4%.',
    'florida': 'Florida soils are primarily Spodosols and Entisols, sandy, well-drained, pH 5.5-7.5, low organic matter (1-3%).',
    
    // Countries
    'usa': 'US agricultural soils are primarily Mollisols and Alfisols, well-drained, organic matter 2-6%, pH 6.0-7.5. Typical nutrients: N 100-200 ppm, P 15-40 ppm, K 150-300 ppm.',
    'canada': 'Canadian prairie soils are Chernozems (Mollisols), high organic matter (4-8%), pH 6.5-7.5. Eastern Canada has Podzols, acidic (pH 5.0-6.5).',
    'india': 'Indian soils vary: Alluvial soils (pH 6.5-8.5), Black soils (pH 7.5-8.5), Red soils (pH 5.5-7.0). Organic matter 0.5-2%.',

    // India - state-wise (practical field baselines)
    'uttar pradesh': 'Uttar Pradesh soils are mainly alluvial loam to clay loam, pH 7.0-8.5, organic matter 0.5-1.2%. Typical nutrients: N low-medium, P low-medium, K medium-high. Common issues: micronutrient deficiencies (Zn, Fe), salinity in pockets.',
    'bihar': 'Bihar soils are predominantly alluvial (new and old), pH 6.8-8.2, organic matter 0.6-1.3%. Typical nutrients: N low-medium, P low-medium, K medium. Flood-prone areas may show nutrient leaching.',
    'west bengal': 'West Bengal soils vary from alluvial in plains to lateritic in uplands, pH 5.5-7.8, organic matter 0.8-2.0%. Typical nutrients: N medium, P low-medium, K medium. Acidic pockets and drainage issues are common.',
    'odisha': 'Odisha soils are largely red and lateritic, pH 5.0-6.8, organic matter 0.7-1.8%. Typical nutrients: N low-medium, P low, K low-medium. Acidity and low phosphorus availability are frequent constraints.',
    'jharkhand': 'Jharkhand soils are mostly red, yellow and lateritic, pH 5.0-6.5, organic matter 0.6-1.5%. Typical nutrients: N low-medium, P low, K low-medium. Soil acidity and low water retention are common.',
    'chhattisgarh': 'Chhattisgarh soils include red-yellow and medium black soils, pH 5.5-7.5, organic matter 0.6-1.4%. Typical nutrients: N low-medium, P low, K medium. Rice belts often face drainage and iron toxicity pockets.',
    'madhya pradesh': 'Madhya Pradesh soils range from deep black cotton soils to red-yellow soils, pH 6.5-8.5, organic matter 0.5-1.2%. Typical nutrients: N low-medium, P low-medium, K medium-high.',
    'rajasthan': 'Rajasthan soils are sandy to loamy sand in arid zones and loam in irrigated belts, pH 7.5-9.0, organic matter 0.2-0.8%. Typical nutrients: N low, P low-medium, K medium. Salinity/sodicity and moisture stress are common.',
    'gujarat': 'Gujarat soils include medium black, alluvial, and coastal saline soils, pH 7.0-8.8, organic matter 0.4-1.0%. Typical nutrients: N low-medium, P low-medium, K medium-high. Salinity and boron issues occur in coastal belts.',
    'maharashtra': 'Maharashtra soils are largely black cotton soils with some red/lateritic zones, pH 6.8-8.5, organic matter 0.5-1.2%. Typical nutrients: N low-medium, P low-medium, K high in black soils.',
    'goa': 'Goa soils are predominantly lateritic, acidic (pH 4.8-6.5), organic matter 1.0-2.5%. Typical nutrients: N medium, P low, K medium. Acidity management and liming are often required.',
    'karnataka': 'Karnataka soils include red, lateritic, and black soils, pH 5.5-8.3, organic matter 0.5-1.5%. Typical nutrients: N low-medium, P low-medium, K medium. In rainfed areas moisture stress is common.',
    'kerala': 'Kerala soils are lateritic and coastal alluvial, generally acidic pH 4.5-6.5, organic matter 1.0-3.0%. Typical nutrients: N medium, P low, K low-medium. Acidity and leaching due to high rainfall are common.',
    'tamil nadu': 'Tamil Nadu soils include red loam, black cotton and coastal alluvial soils, pH 6.0-8.5, organic matter 0.4-1.2%. Typical nutrients: N low-medium, P low-medium, K medium-high. Salinity in delta/coastal pockets.',
    'andhra pradesh': 'Andhra Pradesh soils include red sandy loam, black and deltaic alluvial soils, pH 6.2-8.4, organic matter 0.4-1.1%. Typical nutrients: N low-medium, P low-medium, K medium.',
    'telangana': 'Telangana soils are mainly red sandy loam with black soils in pockets, pH 6.5-8.3, organic matter 0.4-1.0%. Typical nutrients: N low-medium, P low-medium, K medium. Moisture stress is common in rainfed systems.',
    'punjab': 'Punjab soils are fertile alluvial loam to clay loam, pH 7.2-8.5, organic matter 0.4-1.0%. Typical nutrients: N low-medium, P medium, K medium-high. Micronutrient deficiencies (Zn) and groundwater salinity patches occur.',
    'haryana': 'Haryana soils are alluvial, pH 7.5-8.8, organic matter 0.3-0.9%. Typical nutrients: N low-medium, P medium, K medium-high. Sodicity/salinity and micronutrient deficiencies are common in some districts.',
    'himachal pradesh': 'Himachal Pradesh soils are mountain soils, generally loamy to sandy loam, pH 5.0-7.0, organic matter 1.0-3.0%. Typical nutrients: N medium, P low-medium, K medium. Erosion and acidity are key concerns.',
    'uttarakhand': 'Uttarakhand soils are hill alluvial and forest-derived loams, pH 5.5-7.2, organic matter 1.0-2.5%. Typical nutrients: N medium, P low-medium, K medium. Soil erosion and shallow depth in hills are common.',
    'jammu and kashmir': 'Jammu and Kashmir soils range from alluvial valley soils to mountain loams, pH 5.8-7.8, organic matter 1.0-2.5%. Typical nutrients: N medium, P low-medium, K medium.',
    'ladakh': 'Ladakh soils are coarse-textured, low organic matter, alkaline in many places (pH 7.5-8.8). Nutrient availability is low due to cold arid conditions; irrigation and organic amendments are important.',
    'assam': 'Assam soils are alluvial and acidic in many areas, pH 4.8-6.8, organic matter 1.0-2.5%. Typical nutrients: N medium, P low, K medium. Waterlogging and acidity are major constraints.',
    'arunachal pradesh': 'Arunachal Pradesh soils are acidic hill soils, pH 4.5-6.5, organic matter 1.0-3.0%. Typical nutrients: N medium, P low, K low-medium. Erosion and nutrient leaching are common.',
    'manipur': 'Manipur soils are acidic valley and hill soils, pH 4.8-6.8, organic matter 1.0-2.5%. Typical nutrients: N medium, P low, K low-medium.',
    'meghalaya': 'Meghalaya soils are strongly acidic and high rainfall leached soils, pH 4.3-6.0, organic matter 1.5-3.5%. Typical nutrients: N medium, P low, K low-medium.',
    'mizoram': 'Mizoram soils are acidic hill soils, pH 4.5-6.2, organic matter 1.2-3.0%. Typical nutrients: N medium, P low, K low-medium. Erosion in sloping lands is common.',
    'nagaland': 'Nagaland soils are acidic hill soils, pH 4.7-6.5, organic matter 1.0-2.8%. Typical nutrients: N medium, P low, K low-medium. Soil conservation is critical in uplands.',
    'tripura': 'Tripura soils are acidic red and lateritic loams, pH 4.8-6.5, organic matter 1.0-2.5%. Typical nutrients: N medium, P low, K low-medium.',
    'sikkim': 'Sikkim soils are acidic mountain loams rich in organic matter, pH 4.8-6.5, organic matter 1.5-4.0%. Typical nutrients: N medium-high, P low-medium, K medium.',
  }
  
  // Try to find matching region (case-insensitive)
  const regionLower = region.toLowerCase()
  for (const [key, value] of Object.entries(regionalSoilData)) {
    if (regionLower.includes(key) || key.includes(regionLower)) {
      return value
    }
  }
  
  // Default regional soil information
  return `Regional soil characteristics for ${location}: Agricultural soils typically have organic matter 2-5%, pH 6.0-7.5, with moderate to high fertility. Common nutrients: N 100-180 ppm, P 15-30 ppm, K 150-250 ppm. Consider local soil testing for specific nutrient levels.`
}

function getLocalizedFallback(locale: string) {
  const key = (locale || "en").toLowerCase()
  const messages: Record<string, Record<string, string>> = {
    en: {
      analysisErrorTitle: "Analysis Error",
      analysisErrorDescription: "The analysis could not be parsed. Please try again with different images or try again later.",
      unknown: "Unknown",
      unableToAssess: "Unable to assess",
      unableToAssessImpact: "Unable to assess impact",
      expertAdvice: "Please consult with an agricultural expert.",
      cropMismatchTitle: "Crop Mismatch",
      cropMismatchDescription: 'You selected "{selected}" but the uploaded image appears to be "{detected}". Please upload a correct {selected} image to generate an accurate diagnosis.',
      mismatchImpact: "Diagnosis was skipped because selected crop and uploaded image do not match.",
      mismatchPruning: "Upload a clear image of the selected crop from leaves and affected area.",
      mismatchWatering: "Retake image in daylight and avoid blurred frames.",
      mismatchFertilization: "Not available until crop-image match is confirmed.",
      mismatchMonitoring: "Re-run analysis after uploading matching crop images.",
    },
    hi: {
      analysisErrorTitle: "विश्लेषण त्रुटि",
      analysisErrorDescription: "विश्लेषण पार्स नहीं हो सका। कृपया अलग छवियों के साथ दोबारा प्रयास करें या बाद में फिर प्रयास करें।",
      unknown: "अज्ञात",
      unableToAssess: "आकलन नहीं हो सका",
      unableToAssessImpact: "प्रभाव का आकलन नहीं हो सका",
      expertAdvice: "कृपया कृषि विशेषज्ञ से सलाह लें।",
      cropMismatchTitle: "फसल मेल नहीं खा रही",
      cropMismatchDescription: 'आपने "{selected}" चुना है, लेकिन अपलोड की गई छवि "{detected}" जैसी लगती है। सटीक निदान के लिए कृपया {selected} की सही छवि अपलोड करें।',
      mismatchImpact: "चयनित फसल और अपलोड की गई छवि मेल न खाने के कारण निदान रोका गया।",
      mismatchPruning: "पत्तियों और प्रभावित हिस्से की स्पष्ट तस्वीर अपलोड करें।",
      mismatchWatering: "दिन के उजाले में दोबारा फोटो लें और धुंधली तस्वीरों से बचें।",
      mismatchFertilization: "फसल-छवि मिलान की पुष्टि होने तक उपलब्ध नहीं।",
      mismatchMonitoring: "मिलती-जुलती फसल छवियों के साथ फिर से विश्लेषण चलाएँ।",
    },
    gu: {
      analysisErrorTitle: "વિશ્લેષણ ભૂલ",
      analysisErrorDescription: "વિશ્લેષણ પાર્સ થઈ શક્યું નથી. કૃપા કરીને અલગ ચિત્રો સાથે ફરી પ્રયત્ન કરો અથવા થોડા સમય પછી પ્રયત્ન કરો.",
      unknown: "અજ્ઞાત",
      unableToAssess: "આંકલન શક્ય નથી",
      unableToAssessImpact: "અસરનું આંકલન શક્ય નથી",
      expertAdvice: "કૃપા કરીને કૃષિ નિષ્ણાતની સલાહ લો.",
      cropMismatchTitle: "પાક મેળ ખાતો નથી",
      cropMismatchDescription: 'તમે "{selected}" પસંદ કર્યો છે, પરંતુ અપલોડ કરાયેલ ચિત્ર "{detected}" જેવું લાગે છે. યોગ્ય નિદાન માટે કૃપા કરીને {selected} નું સાચું ચિત્ર અપલોડ કરો.',
      mismatchImpact: "પસંદ કરેલ પાક અને અપલોડ કરેલ ચિત્ર ન મેળ ખાતાં નિદાન અટકાવવામાં આવ્યું.",
      mismatchPruning: "પાંદડા અને અસરગ્રસ્ત ભાગનું સ્પષ્ટ ચિત્ર અપલોડ કરો.",
      mismatchWatering: "દિવસના પ્રકાશમાં ફરી ચિત્ર લો અને ધૂંધળા ફોટોથી બચો.",
      mismatchFertilization: "પાક-ચિત્ર મેચ પુષ્ટિ થાય ત્યાં સુધી ઉપલબ્ધ નથી.",
      mismatchMonitoring: "મેળ ખાતાં પાકના ચિત્રો સાથે ફરી વિશ્લેષણ ચલાવો.",
    },
    bn: {
      analysisErrorTitle: "বিশ্লেষণ ত্রুটি",
      analysisErrorDescription: "বিশ্লেষণ পার্স করা যায়নি। অনুগ্রহ করে ভিন্ন ছবি দিয়ে আবার চেষ্টা করুন বা পরে চেষ্টা করুন।",
      unknown: "অজানা",
      unableToAssess: "মূল্যায়ন করা যায়নি",
      unableToAssessImpact: "প্রভাব মূল্যায়ন করা যায়নি",
      expertAdvice: "অনুগ্রহ করে কৃষি বিশেষজ্ঞের সাথে পরামর্শ করুন।",
      cropMismatchTitle: "ফসল মেলেনি",
      cropMismatchDescription: 'আপনি "{selected}" নির্বাচন করেছেন, কিন্তু আপলোড করা ছবি "{detected}" বলে মনে হচ্ছে। সঠিক বিশ্লেষণের জন্য {selected} এর সঠিক ছবি আপলোড করুন।',
      mismatchImpact: "নির্বাচিত ফসল ও আপলোডকৃত ছবির অমিলের কারণে বিশ্লেষণ বন্ধ করা হয়েছে।",
      mismatchPruning: "পাতা ও আক্রান্ত অংশের পরিষ্কার ছবি আপলোড করুন।",
      mismatchWatering: "দিনের আলোতে ছবি তুলুন এবং ঝাপসা ছবি এড়িয়ে চলুন।",
      mismatchFertilization: "ফসল-ছবি মিল নিশ্চিত না হওয়া পর্যন্ত উপলব্ধ নয়।",
      mismatchMonitoring: "মিল থাকা ফসলের ছবি দিয়ে পুনরায় বিশ্লেষণ চালান।",
    },
    te: {
      analysisErrorTitle: "విశ్లేషణ లోపం",
      analysisErrorDescription: "విశ్లేషణను పార్స్ చేయలేకపోయాము. దయచేసి వేరే చిత్రాలతో మళ్లీ ప్రయత్నించండి లేదా తర్వాత ప్రయత్నించండి.",
      unknown: "తెలియదు",
      unableToAssess: "అంచనా వేయలేకపోయాం",
      unableToAssessImpact: "ప్రభావాన్ని అంచనా వేయలేకపోయాం",
      expertAdvice: "దయచేసి వ్యవసాయ నిపుణుడిని సంప్రదించండి.",
      cropMismatchTitle: "పంట సరిపోలలేదు",
      cropMismatchDescription: 'మీరు "{selected}" ఎంచుకున్నారు, కానీ అప్లోడ్ చేసిన చిత్రం "{detected}"లా కనిపిస్తోంది. సరైన విశ్లేషణ కోసం దయచేసి {selected} యొక్క సరైన చిత్రాన్ని అప్లోడ్ చేయండి.',
      mismatchImpact: "ఎంచుకున్న పంట మరియు అప్లోడ్ చేసిన చిత్రం సరిపోలకపోవడంతో విశ్లేషణ నిలిపివేయబడింది.",
      mismatchPruning: "ఆకు మరియు ప్రభావిత భాగం స్పష్టమైన చిత్రం అప్లోడ్ చేయండి.",
      mismatchWatering: "పగటి వెలుతురులో మళ్లీ ఫోటో తీసి, బ్లర్ అయిన చిత్రాలను తప్పించండి.",
      mismatchFertilization: "పంట-చిత్ర సరిపోలిక నిర్ధారించేవరకు అందుబాటులో లేదు.",
      mismatchMonitoring: "సరిపోయే పంట చిత్రాలతో మళ్లీ విశ్లేషణ నడపండి.",
    },
    mr: {
      analysisErrorTitle: "विश्लेषण त्रुटी",
      analysisErrorDescription: "विश्लेषण पार्स करता आले नाही. कृपया वेगळ्या चित्रांसह पुन्हा प्रयत्न करा किंवा नंतर प्रयत्न करा.",
      unknown: "अज्ञात",
      unableToAssess: "मूल्यांकन करता आले नाही",
      unableToAssessImpact: "परिणामाचे मूल्यांकन करता आले नाही",
      expertAdvice: "कृपया कृषी तज्ञांचा सल्ला घ्या.",
      cropMismatchTitle: "पीक जुळत नाही",
      cropMismatchDescription: 'तुम्ही "{selected}" निवडले आहे, पण अपलोड केलेले चित्र "{detected}" सारखे दिसते. अचूक निदानासाठी कृपया {selected} चे योग्य चित्र अपलोड करा.',
      mismatchImpact: "निवडलेले पीक आणि अपलोड केलेले चित्र जुळत नसल्यामुळे निदान थांबवले गेले.",
      mismatchPruning: "पाने आणि प्रभावित भागाचे स्पष्ट चित्र अपलोड करा.",
      mismatchWatering: "दिवसा पुन्हा फोटो घ्या आणि धूसर फोटो टाळा.",
      mismatchFertilization: "पीक-चित्र जुळणीची पुष्टी होईपर्यंत उपलब्ध नाही.",
      mismatchMonitoring: "जुळणाऱ्या पीक चित्रांसह पुन्हा विश्लेषण चालवा.",
    },
    ta: {
      analysisErrorTitle: "பகுப்பாய்வு பிழை",
      analysisErrorDescription: "பகுப்பாய்வை வாசிக்க முடியவில்லை. வேறு படங்களுடன் மீண்டும் முயற்சிக்கவும் அல்லது பின்னர் முயற்சிக்கவும்.",
      unknown: "தெரியாது",
      unableToAssess: "மதிப்பிட முடியவில்லை",
      unableToAssessImpact: "பாதிப்பை மதிப்பிட முடியவில்லை",
      expertAdvice: "விவசாய நிபுணரிடம் ஆலோசிக்கவும்.",
      cropMismatchTitle: "பயிர் பொருந்தவில்லை",
      cropMismatchDescription: 'நீங்கள் "{selected}" என்பதைத் தேர்ந்தெடுத்துள்ளீர்கள், ஆனால் பதிவேற்றப்பட்ட படம் "{detected}" போல உள்ளது. துல்லியமான பகுப்பாய்வுக்கு {selected} பயிரின் சரியான படத்தை பதிவேற்றவும்.',
      mismatchImpact: "தேர்ந்தெடுக்கப்பட்ட பயிரும் பதிவேற்றப்பட்ட படமும் பொருந்தாததால் பகுப்பாய்வு நிறுத்தப்பட்டது.",
      mismatchPruning: "இலைகள் மற்றும் பாதிக்கப்பட்ட பகுதியின் தெளிவான படத்தை பதிவேற்றவும்.",
      mismatchWatering: "பகல் வெளிச்சத்தில் மீண்டும் படம் எடுத்து மங்கலான படங்களைத் தவிர்க்கவும்.",
      mismatchFertilization: "பயிர்-பட பொருத்தம் உறுதிப்படுத்தும் வரை கிடைக்காது.",
      mismatchMonitoring: "பொருந்தும் பயிர் படங்களுடன் மீண்டும் பகுப்பாய்வு இயக்கவும்.",
    },
    kn: {
      analysisErrorTitle: "ವಿಶ್ಲೇಷಣೆ ದೋಷ",
      analysisErrorDescription: "ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಾರ್ಸ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಚಿತ್ರಗಳೊಂದಿಗೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.",
      unknown: "ಅಜ್ಞಾತ",
      unableToAssess: "ಅಂದಾಜಿಸಲು ಆಗಲಿಲ್ಲ",
      unableToAssessImpact: "ಪ್ರಭಾವವನ್ನು ಅಂದಾಜಿಸಲು ಆಗಲಿಲ್ಲ",
      expertAdvice: "ದಯವಿಟ್ಟು ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      cropMismatchTitle: "ಬೆಳೆ ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ",
      cropMismatchDescription: 'ನೀವು "{selected}" ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ, ಆದರೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರವು "{detected}" ಎಂದು ಕಾಣುತ್ತಿದೆ. ಸರಿಯಾದ ವಿಶ್ಲೇಷಣೆಗೆ {selected} ಬೆಳೆಗಿನ ಸರಿಯಾದ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      mismatchImpact: "ಆಯ್ಕೆ ಮಾಡಿದ ಬೆಳೆ ಮತ್ತು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರ ಹೊಂದಿಕೆಯಾಗದ ಕಾರಣ ವಿಶ್ಲೇಷಣೆ ನಿಲ್ಲಿಸಲಾಯಿತು.",
      mismatchPruning: "ಇಲೆಗಳು ಮತ್ತು ബാധಿತ ಭಾಗದ ಸ್ಪಷ್ಟ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      mismatchWatering: "ಹಗಲಿನಲ್ಲಿ ಮತ್ತೆ ಚಿತ್ರ ತೆಗೆದು ಮಸುಕಾದ ಚಿತ್ರಗಳನ್ನು ತಪ್ಪಿಸಿ.",
      mismatchFertilization: "ಬೆಳೆ-ಚಿತ್ರ ಹೊಂದಾಣಿಕೆ ದೃಢೀಕರಿಸುವವರೆಗೆ ಲಭ್ಯವಿಲ್ಲ.",
      mismatchMonitoring: "ಹೊಂದುವ ಬೆಳೆ ಚಿತ್ರಗಳೊಂದಿಗೆ ಮತ್ತೆ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ.",
    },
    ml: {
      analysisErrorTitle: "വിശകലന പിശക്",
      analysisErrorDescription: "വിശകലനം പാഴ്സ് ചെയ്യാനായില്ല. ദയവായി വേറെ ചിത്രങ്ങളുമായി വീണ്ടും ശ്രമിക്കൂ അല്ലെങ്കിൽ പിന്നീട് ശ്രമിക്കൂ.",
      unknown: "അജ്ഞാതം",
      unableToAssess: "മൂല്യനിർണ്ണയം സാധിച്ചില്ല",
      unableToAssessImpact: "പ്രഭാവം വിലയിരുത്താനായില്ല",
      expertAdvice: "ദയവായി കാർഷിക വിദഗ്ധനുമായി ആശയവിനിമയം നടത്തുക.",
      cropMismatchTitle: "വിള പൊരുത്തപ്പെടുന്നില്ല",
      cropMismatchDescription: 'നിങ്ങൾ "{selected}" തിരഞ്ഞെടുത്തു, എന്നാൽ അപ്‌ലോഡ് ചെയ്ത ചിത്രം "{detected}" ആയി തോന്നുന്നു. കൃത്യമായ വിശകലനത്തിന് {selected} വിളയുടെ ശരിയായ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.',
      mismatchImpact: "തിരഞ്ഞെടുത്ത വിളയും അപ്‌ലോഡ് ചെയ്ത ചിത്രവും പൊരുത്തപ്പെടാത്തതിനാൽ വിശകലനം നിർത്തി.",
      mismatchPruning: "ഇലകളും ബാധിത ഭാഗവും വ്യക്തമായി കാണുന്ന ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.",
      mismatchWatering: "പകൽ വെളിച്ചത്തിൽ ചിത്രം വീണ്ടും എടുക്കുക; മങ്ങിയ ചിത്രങ്ങൾ ഒഴിവാക്കുക.",
      mismatchFertilization: "വിള-ചിത്ര പൊരുത്തം സ്ഥിരീകരിക്കുംവരെ ലഭ്യമല്ല.",
      mismatchMonitoring: "പൊരുത്തപ്പെടുന്ന വിള ചിത്രങ്ങളുമായി വീണ്ടും വിശകലനം നടത്തുക.",
    },
    pa: {
      analysisErrorTitle: "ਵਿਸ਼ਲੇਸ਼ਣ ਗਲਤੀ",
      analysisErrorDescription: "ਵਿਸ਼ਲੇਸ਼ਣ ਪਾਰਸ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਵੱਖਰੀਆਂ ਤਸਵੀਰਾਂ ਨਾਲ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਬਾਅਦ ਵਿੱਚ ਕਰੋ।",
      unknown: "ਅਣਜਾਣ",
      unableToAssess: "ਮੁਲਾਂਕਣ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      unableToAssessImpact: "ਅਸਰ ਦਾ ਮੁਲਾਂਕਣ ਨਹੀਂ ਹੋ ਸਕਿਆ",
      expertAdvice: "ਕਿਰਪਾ ਕਰਕੇ ਖੇਤੀ ਮਾਹਿਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
      cropMismatchTitle: "ਫਸਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ",
      cropMismatchDescription: 'ਤੁਸੀਂ "{selected}" ਚੁਣਿਆ ਹੈ, ਪਰ ਅੱਪਲੋਡ ਕੀਤੀ ਤਸਵੀਰ "{detected}" ਵਰਗੀ ਲੱਗਦੀ ਹੈ। ਸਹੀ ਨਤੀਜੇ ਲਈ {selected} ਦੀ ਠੀਕ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ।',
      mismatchImpact: "ਚੁਣੀ ਫਸਲ ਅਤੇ ਅੱਪਲੋਡ ਤਸਵੀਰ ਨਾ ਮਿਲਣ ਕਾਰਨ ਵਿਸ਼ਲੇਸ਼ਣ ਰੋਕਿਆ ਗਿਆ।",
      mismatchPruning: "ਪੱਤਿਆਂ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਹਿੱਸੇ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ।",
      mismatchWatering: "ਦਿਨ ਦੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਦੁਬਾਰਾ ਫੋਟੋ ਲਵੋ ਅਤੇ ਧੁੰਦਲੀਆਂ ਤਸਵੀਰਾਂ ਤੋਂ ਬਚੋ।",
      mismatchFertilization: "ਫਸਲ-ਤਸਵੀਰ ਮਿਲਾਪ ਪੱਕਾ ਹੋਣ ਤੱਕ ਉਪਲਬਧ ਨਹੀਂ।",
      mismatchMonitoring: "ਮਿਲਦੀਆਂ ਫਸਲ ਤਸਵੀਰਾਂ ਨਾਲ ਮੁੜ ਵਿਸ਼ਲੇਸ਼ਣ ਚਲਾਓ।",
    },
    or: {
      analysisErrorTitle: "ବିଶ୍ଳେଷଣ ତ୍ରୁଟି",
      analysisErrorDescription: "ବିଶ୍ଳେଷଣ ପାର୍ସ ହୋଇନଥିଲା। ଦୟାକରି ଭିନ୍ନ ଛବି ସହ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ କିମ୍ବା ପରେ ଚେଷ୍ଟା କରନ୍ତୁ।",
      unknown: "ଅଜ୍ଞାତ",
      unableToAssess: "ମୂଲ୍ୟାୟନ ସମ୍ଭବ ହୋଇନି",
      unableToAssessImpact: "ପ୍ରଭାବ ମୂଲ୍ୟାୟନ ସମ୍ଭବ ହୋଇନି",
      expertAdvice: "ଦୟାକରି କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ସଲାହ ନିଅନ୍ତୁ।",
      cropMismatchTitle: "ଫସଲ ମେଳ ହେଉନି",
      cropMismatchDescription: 'ଆପଣ "{selected}" ବାଛିଛନ୍ତି, କିନ୍ତୁ ଅପଲୋଡ ହୋଇଥିବା ଛବି "{detected}" ପରି ଲାଗୁଛି। ଠିକ୍ ବିଶ୍ଳେଷଣ ପାଇଁ {selected} ର ସଠିକ୍ ଛବି ଅପଲୋଡ କରନ୍ତୁ।',
      mismatchImpact: "ଚୟନିତ ଫସଲ ଏବଂ ଅପଲୋଡ ଛବି ମେଳ ନ ହେବାରୁ ବିଶ୍ଳେଷଣ ବନ୍ଦ କରାଗଲା।",
      mismatchPruning: "ପତ୍ର ଏବଂ ପ୍ରଭାବିତ ଅଂଶର ସ୍ପଷ୍ଟ ଛବି ଅପଲୋଡ କରନ୍ତୁ।",
      mismatchWatering: "ଦିନ ଆଲୋକରେ ପୁଣି ଛବି ନିଅନ୍ତୁ ଏବଂ ଧୁମିଳ ଛବି ଏଡ଼ାନ୍ତୁ।",
      mismatchFertilization: "ଫସଲ-ଛବି ମେଳ ନିଶ୍ଚିତ ହେଉଅ ପର୍ଯ୍ୟନ୍ତ ଉପଲବ୍ଧ ନୁହେଁ।",
      mismatchMonitoring: "ମେଳ ହୋଇଥିବା ଫସଲ ଛବି ସହ ପୁଣି ବିଶ୍ଳେଷଣ କରନ୍ତୁ।",
    },
    as: {
      analysisErrorTitle: "বিশ্লেষণ ত্ৰুটি",
      analysisErrorDescription: "বিশ্লেষণ পাৰ্ছ কৰিব পৰা নগ’ল। অনুগ্ৰহ কৰি ভিন্ন ছবি দি পুনৰ চেষ্টা কৰক অথবা পিছত চেষ্টা কৰক।",
      unknown: "অজ্ঞাত",
      unableToAssess: "মূল্যায়ন কৰিব পৰা নগ’ল",
      unableToAssessImpact: "প্ৰভাৱ মূল্যায়ন কৰিব পৰা নগ’ল",
      expertAdvice: "অনুগ্ৰহ কৰি কৃষি বিশেষজ্ঞৰ পৰামৰ্শ লওক।",
      cropMismatchTitle: "শস্য মিল নাপায়",
      cropMismatchDescription: 'আপুনি "{selected}" বাছনি কৰিছে, কিন্তু আপলোড কৰা ছবিখন "{detected}" যেন দেখা যায়। সঠিক বিশ্লেষণৰ বাবে {selected} ৰ সঠিক ছবি আপলোড কৰক।',
      mismatchImpact: "বাছনি কৰা শস্য আৰু আপলোড কৰা ছবিখন নমিলাৰ বাবে বিশ্লেষণ বন্ধ কৰা হৈছে।",
      mismatchPruning: "পাত আৰু প্ৰভাৱিত অংশৰ স্পষ্ট ছবি আপলোড কৰক।",
      mismatchWatering: "দিনৰ পোহৰত পুনৰ ছবি তুলক আৰু ধোঁৱাশা ছবি এৰক।",
      mismatchFertilization: "শস্য-ছবি মিল নিশ্চিত নোহোৱালৈ উপলব্ধ নহয়।",
      mismatchMonitoring: "মিল থকা শস্যৰ ছবিসমূহেৰে পুনৰ বিশ্লেষণ চলাওক।",
    },
    ur: {
      analysisErrorTitle: "تجزیہ کی خرابی",
      analysisErrorDescription: "تجزیہ پارس نہیں ہو سکا۔ براہ کرم مختلف تصاویر کے ساتھ دوبارہ کوشش کریں یا بعد میں کوشش کریں۔",
      unknown: "نامعلوم",
      unableToAssess: "اندازہ ممکن نہیں",
      unableToAssessImpact: "اثر کا اندازہ ممکن نہیں",
      expertAdvice: "براہ کرم زرعی ماہر سے مشورہ کریں۔",
      cropMismatchTitle: "فصل میچ نہیں کرتی",
      cropMismatchDescription: 'آپ نے "{selected}" منتخب کیا ہے لیکن اپ لوڈ کی گئی تصویر "{detected}" لگتی ہے۔ درست تشخیص کے لیے {selected} کی صحیح تصویر اپ لوڈ کریں۔',
      mismatchImpact: "منتخب فصل اور اپ لوڈ شدہ تصویر کے عدم مطابقت کی وجہ سے تشخیص روک دی گئی۔",
      mismatchPruning: "پتوں اور متاثرہ حصے کی واضح تصویر اپ لوڈ کریں۔",
      mismatchWatering: "دن کی روشنی میں دوبارہ تصویر لیں اور دھندلی تصاویر سے بچیں۔",
      mismatchFertilization: "فصل-تصویر مطابقت کی تصدیق تک دستیاب نہیں۔",
      mismatchMonitoring: "مطابق فصل کی تصاویر کے ساتھ دوبارہ تجزیہ چلائیں۔",
    },
  }

  return messages[key] || messages.en
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      )
    }

    // Extract form data
    const cropType = formData.get("cropType") as string
    const customCropType = formData.get("customCropType") as string
    const growthStage = formData.get("growthStage") as string
    const customGrowthStage = formData.get("customGrowthStage") as string
    const location = formData.get("location") as string
    const soilCondition = formData.get("soilCondition") as string
    const customSoilCondition = formData.get("customSoilCondition") as string
    const weatherCondition = formData.get("weatherCondition") as string
    const customWeatherCondition = formData.get("customWeatherCondition") as string
    const description = formData.get("description") as string || ""
    const locale = (formData.get("locale") as string) || "en"
    const fallback = getLocalizedFallback(locale)

    // Get crop images
    const cropImages = formData.getAll("cropImages") as File[]
    const soilReport = formData.get("soilReport") as File | null
    const weatherImage = formData.get("weatherImage") as File | null

    // Convert images to base64 for Gemini
    const imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = []
    
    for (const image of cropImages) {
      if (image && image.size > 0) {
        const base64 = await fileToBase64(image)
        imageParts.push({
          inlineData: {
            data: base64.split(",")[1], // Remove data:image/...;base64, prefix
            mimeType: image.type,
          },
        })
      }
    }

    if (weatherImage && weatherImage.size > 0) {
      const base64 = await fileToBase64(weatherImage)
      imageParts.push({
        inlineData: {
          data: base64.split(",")[1],
          mimeType: weatherImage.type,
        },
      })
    }

    // Build comprehensive prompt for Gemini
    const finalCropType = cropType === "Other" ? customCropType : cropType
    const finalGrowthStage = growthStage === "Other" ? customGrowthStage : growthStage
    const finalSoilCondition = soilCondition === "Other" ? customSoilCondition : soilCondition
    const finalWeatherCondition = weatherCondition === "Other" ? customWeatherCondition : weatherCondition

    // Get regional soil data based on location
    const regionalSoilInfo = getRegionalSoilData(location)
    const locationInfo = parseLocation(location)

    const languageInstruction = getGeminiLanguageInstruction(locale)

    const prompt = `You are an expert AI agronomist with deep knowledge of crop diseases, plant pathology, and agricultural best practices. You MUST provide location-specific analysis and recommendations based strictly on the provided location.

CRITICAL LANGUAGE REQUIREMENT:
${languageInstruction}
The ENTIRE JSON response (all field values: diseaseName, description, impact text, treatment titles and descriptions, recommendations, etc.) MUST be in that language and script. No English in the response unless the language is English.

CRITICAL JSON FORMAT (required for all languages):
- Return ONLY valid JSON. Do not add any text, prefix (e.g. "json"), or markdown before or after the JSON.
- Use standard ASCII for all JSON keys exactly as shown (diagnosis, diseaseName, description, etc.). Only the values may be in the requested language/script.
- This ensures the response can be parsed correctly regardless of language.

CRITICAL LOCATION REQUIREMENT:
The location "${location}" is the PRIMARY factor for your analysis. ALL recommendations, treatment plans, and environmental assessments MUST be specific to this location. Consider:
- Regional climate patterns and typical weather conditions for this location
- Common diseases and pests in this region
- Local agricultural practices and available products
- Regional soil characteristics (provided below)
- Seasonal timing appropriate for this location

CROP INFORMATION:
- Crop Type: ${finalCropType}
- Growth Stage: ${finalGrowthStage}
- Location: ${location}${locationInfo.city ? ` (City: ${locationInfo.city})` : ''}${locationInfo.state ? ` (State/Region: ${locationInfo.state})` : ''}${locationInfo.country ? ` (Country: ${locationInfo.country})` : ''}
- Soil Condition: ${finalSoilCondition}
- Recent Weather: ${finalWeatherCondition}
${description ? `- Additional Notes: ${description}` : ""}

REGIONAL SOIL CHARACTERISTICS FOR ${location.toUpperCase()}:
${regionalSoilInfo}

IMPORTANT: Use the above regional soil data to inform your recommendations. If the user-provided soil condition differs from regional norms, consider both in your analysis.

TASK:
Analyze the crop images provided and create a detailed diagnosis report in the following JSON format. Be thorough, accurate, and provide actionable recommendations that are SPECIFIC TO THE LOCATION PROVIDED.

REQUIRED JSON FORMAT:
{
  "diagnosis": {
    "diseaseName": "Name of the disease or issue identified",
    "severity": "Low" | "Moderate" | "High" | "Critical",
    "confidence": "percentage as number (0-100)",
    "description": "Detailed description of the disease/issue, its causes, and symptoms visible in the images",
    "scientificName": "Scientific name of pathogen if applicable"
  },
  "environmentalFactors": {
    "humidity": {
      "value": "percentage or description",
      "riskLevel": "LOW" | "MODERATE" | "HIGH",
      "impact": "How this affects the disease"
    },
    "temperature": {
      "value": "temperature range or description",
      "riskLevel": "LOW" | "MODERATE" | "HIGH",
      "impact": "How this affects the disease"
    },
    "overallRisk": "percentage (0-100)"
  },
  "impact": {
    "yieldLoss": "estimated percentage range (e.g., '20-40%')",
    "timeframe": "timeframe for impact (e.g., 'within 7 days')",
    "description": "Detailed explanation of potential impact without intervention"
  },
  "treatmentPlan": {
    "immediate": [
      {
        "title": "Action title",
        "description": "Detailed action description",
        "timeline": "WITHIN 24 HOURS",
        "type": "organic" | "chemical" | "cultural",
        "products": ["Product recommendations if applicable"]
      }
    ],
    "followUp": [
      {
        "title": "Action title",
        "description": "Detailed action description",
        "timeline": "DAY 3-7",
        "type": "organic" | "chemical" | "cultural"
      }
    ],
    "prevention": [
      {
        "title": "Action title",
        "description": "Detailed action description",
        "timeline": "POST-SEASON",
        "type": "organic" | "chemical" | "cultural"
      }
    ]
  },
  "recommendations": {
    "pruning": "Specific pruning recommendations",
    "watering": "Watering schedule and method recommendations",
    "fertilization": "Fertilization recommendations if applicable",
    "monitoring": "What to monitor and how often"
  }
}

CRITICAL REQUIREMENTS:
1. LOCATION-SPECIFIC ANALYSIS (MANDATORY):
   - ALL recommendations MUST be tailored to "${location}"
   - Consider regional climate, typical weather patterns, and seasonal conditions for this location
   - Reference common diseases and pests that occur in this region
   - Recommend products and treatments available/effective in this location
   - Consider local agricultural extension recommendations for this region

2. REGIONAL SOIL CONSIDERATION (MANDATORY):
   - Use the regional soil characteristics provided above as the baseline
   - If user-provided soil condition differs, explain how it affects the diagnosis
   - Adjust treatment recommendations based on regional soil pH, nutrient levels, and soil type
   - Consider common soil issues in this region

3. ENVIRONMENTAL FACTORS:
   - Base humidity and temperature assessments on typical conditions for "${location}"
   - Consider seasonal weather patterns for this location
   - Factor in regional climate risks (drought, flooding, frost, etc.)

4. TREATMENT RECOMMENDATIONS:
   - Recommend products and treatments that are available and effective in "${location}"
   - Consider local regulations and agricultural practices
   - Provide location-specific application timing based on regional growing seasons
   - Include both organic and chemical options when applicable, but prioritize what works best in this region

5. GENERAL REQUIREMENTS:
   - Base your analysis on the actual images provided
   - Be realistic about timelines and expected outcomes
   - If multiple issues are detected, prioritize the most critical
   - Keep the response concise: descriptions should be 1-2 sentences each
   - Keep treatment actions brief and practical (max 2 immediate, 2 follow-up, 2 prevention items)
   - Return ONLY valid JSON, no additional text before or after. No "json" prefix or code fences.

Now analyze the images and provide the diagnosis report in the exact JSON format specified above, ensuring ALL recommendations are specific to "${location}".`

    // Prepare content parts (text + images)
    const contentParts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [
      { text: prompt },
      ...imageParts,
    ]

    const extractJsonText = (raw: string): string => {
      let toParse = (raw || "").trim()
      while (toParse.startsWith('"')) {
        toParse = toParse.slice(1).trim()
      }
      if (toParse.toLowerCase().startsWith("json ")) {
        toParse = toParse.slice(5).trim()
      }
      const codeFenceMatch = toParse.match(/^```(?:json)?\s*([\s\S]*?)```/i)
      if (codeFenceMatch) {
        toParse = codeFenceMatch[1].trim()
      }
      const jsonMatch = toParse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in model response")
      }
      return jsonMatch[0]
    }

    const parseJsonFromModel = (raw: string) => JSON.parse(extractJsonText(raw))

    // Step 1: validate that uploaded crop images match selected crop
    const cropValidationPrompt = `You are a strict crop identity validator.
Selected crop: "${finalCropType}".
Task: determine if the uploaded crop images primarily belong to this selected crop.

Return ONLY valid JSON:
{
  "matches": true,
  "detectedCrop": "name of crop detected in image",
  "confidence": 0,
  "reason": "short reason"
}

Rules:
- Use boolean true/false for matches.
- confidence must be a number from 0-100.
- If uncertain, set matches=true unless strong visual mismatch exists.
- No markdown, no extra text.`

    const validationResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: cropValidationPrompt }, ...imageParts],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 20,
            topP: 0.9,
            maxOutputTokens: 512,
            responseMimeType: "application/json",
          },
        }),
      }
    )

    if (!validationResponse.ok) {
      return NextResponse.json(
        { error: fallback.analysisErrorDescription },
        { status: 422 }
      )
    }

    try {
      const validationData = await validationResponse.json()
      const validationText =
        validationData.candidates?.[0]?.content?.parts?.[0]?.text || ""
      const validation = parseJsonFromModel(validationText) as {
        matches?: boolean
        detectedCrop?: string
        confidence?: number
        reason?: string
      }

      const mismatchConfidence = typeof validation.confidence === "number" ? validation.confidence : 0
      const detectedCrop = validation.detectedCrop || fallback.unknown

      // Strict mode: if validation is inconclusive or mismatch, do not proceed to report generation.
      if (typeof validation.matches !== "boolean") {
        return NextResponse.json(
          { error: fallback.analysisErrorDescription },
          { status: 422 }
        )
      }

      if (validation.matches === false) {
        return NextResponse.json(
          {
            error: fallback.cropMismatchDescription
              .replace(/\{selected\}/g, finalCropType)
              .replace(/\{detected\}/g, detectedCrop),
          },
          { status: 422 }
        )
      }

      // Image is likely unclear/poor quality for reliable crop verification.
      if (validation.matches === true && mismatchConfidence < 50) {
        return NextResponse.json(
          { error: fallback.mismatchPruning },
          { status: 422 }
        )
      }
    } catch (validationParseError) {
      console.error("Error parsing crop validation response:", validationParseError)
      return NextResponse.json(
        { error: fallback.analysisErrorDescription },
        { status: 422 }
      )
    }

    // Call Gemini Flash API for full diagnosis
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: contentParts,
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      return NextResponse.json(
        { error: "Failed to get response from Gemini API", details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract the text from Gemini's response
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I couldn't generate a response. Please try again."

    const parseAnalysis = (raw: string) => {
      const parsed = parseJsonFromModel(raw)
      if (parsed?.diagnosis && typeof parsed.diagnosis === "object") {
        return parsed
      }
      if (parsed?.diagnosis && typeof parsed.diagnosis === "string") {
        try {
          const inner = JSON.parse(parsed.diagnosis)
          return inner && typeof inner.diagnosis === "object" ? inner : parsed
        } catch {
          return parsed
        }
      }
      return parsed
    }

    // Try to parse JSON from the response, with one repair attempt if malformed/truncated
    let analysisResult
    try {
      analysisResult = parseAnalysis(responseText)
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.error("Response text:", responseText)

      try {
        const repairPrompt = `You are a strict JSON repair assistant.
Fix the following malformed or truncated crop diagnosis JSON and return ONLY valid JSON matching this shape:
{
  "diagnosis": {"diseaseName": string, "severity": "Low"|"Moderate"|"High"|"Critical", "confidence": number, "description": string, "scientificName": string},
  "environmentalFactors": {"humidity": {"value": string, "riskLevel": "LOW"|"MODERATE"|"HIGH", "impact": string}, "temperature": {"value": string, "riskLevel": "LOW"|"MODERATE"|"HIGH", "impact": string}, "overallRisk": number},
  "impact": {"yieldLoss": string, "timeframe": string, "description": string},
  "treatmentPlan": {"immediate": Array, "followUp": Array, "prevention": Array},
  "recommendations": {"pruning": string, "watering": string, "fertilization": string, "monitoring": string}
}
Rules:
- Preserve the original language for textual values.
- Keep the values concise (1-2 sentences per description).
- If part is missing, fill with best-effort sensible placeholders.
- Keep enum fields strictly in allowed English values.

Malformed JSON:
${responseText}`

        const repairResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: repairPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                topK: 20,
                topP: 0.9,
                maxOutputTokens: 4096,
                responseMimeType: "application/json",
              },
            }),
          }
        )

        if (repairResponse.ok) {
          const repairData = await repairResponse.json()
          const repairedText =
            repairData.candidates?.[0]?.content?.parts?.[0]?.text || ""
          analysisResult = parseAnalysis(repairedText)
        } else {
          throw new Error("Repair API call failed")
        }
      } catch (repairError) {
        console.error("Error repairing malformed diagnosis JSON:", repairError)

        // Fallback: do not put raw response (often JSON) into description
        analysisResult = {
        diagnosis: {
          diseaseName: fallback.analysisErrorTitle,
          severity: "Moderate",
          confidence: 50,
          description: fallback.analysisErrorDescription,
          scientificName: fallback.unknown,
        },
        environmentalFactors: {
          humidity: {
            value: fallback.unknown,
            riskLevel: "MODERATE",
            impact: fallback.unableToAssess,
          },
          temperature: {
            value: fallback.unknown,
            riskLevel: "MODERATE",
            impact: fallback.unableToAssess,
          },
          overallRisk: 50,
        },
        impact: {
          yieldLoss: fallback.unknown,
          timeframe: fallback.unknown,
          description: fallback.unableToAssessImpact,
        },
        treatmentPlan: {
          immediate: [],
          followUp: [],
          prevention: [],
        },
        recommendations: {
          pruning: fallback.expertAdvice,
          watering: fallback.expertAdvice,
          fertilization: fallback.expertAdvice,
          monitoring: fallback.expertAdvice,
        },
      }
      }
    }

    // Generate report ID
    const reportId = `AG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`

    // Return comprehensive report
    return NextResponse.json({
      reportId,
      timestamp: new Date().toISOString(),
      cropInfo: {
        cropType: finalCropType,
        growthStage: finalGrowthStage,
        location,
        soilCondition: finalSoilCondition,
        weatherCondition: finalWeatherCondition,
        description,
      },
      analysis: analysisResult,
      imageCount: cropImages.length,
    })
  } catch (error) {
    console.error("Error in diagnosis analysis:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
