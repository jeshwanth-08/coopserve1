// Master Internationalization Dictionary for CoopServe (SIH 2026)
// Supports English (en), Hindi (hi), Tamil (ta), Telugu (te), and Kannada (kn)

export type SupportedLanguage = "en" | "hi" | "ta" | "te" | "kn";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav & Common
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.packages": "Curated Packages",
    "nav.ai_diagnosis": "AI Problem Diagnosis",
    "nav.society_pools": "Society Pools",
    "nav.admin": "Admin HQ",
    "nav.provider": "Specialist Hub",
    "nav.member": "Member Dashboard",
    "nav.login": "Sign In",
    "nav.register": "Join as Pro / Member",
    "nav.welfare": "Welfare & e-Shram",
    "nav.download_app": "Download App (.APK)",
    "nav.book_service": "Book a Service",
    "nav.support": "Support",

    // Hero & Tagline
    "hero.badge": "Verified Labour Cooperative Federation Network",
    "hero.title_prefix": "Household Services Owned by",
    "hero.title_highlight": "The Skilled Workers",
    "hero.title_suffix": "Who Serve You",
    "hero.subtitle": "Connecting urban households with verified local electricians, plumbers, carpenters, and technicians—transforming gig workers into dignified member co-owners with fair wages and social security.",
    "hero.cta_book": "Book a Verified Pro",
    "hero.cta_ai": "📸 Diagnose with AI",
    "hero.search_placeholder": "Search 'AC gas leak', 'sink repair', 'switch sparking'...",
    "hero.stat_workers": "Certified Co-op Pros",
    "hero.stat_commission": "Direct to Worker",
    "hero.stat_rating": "Average Rating",
    "hero.stat_cities": "Active Districts",

    // Quick Booking Modal
    "book.title": "Quick Service Booking",
    "book.subtitle": "Standardized cooperative rates with zero surge pricing.",
    "book.select_category": "Select Primary Discipline",
    "book.select_date": "Choose Date",
    "book.today": "Today",
    "book.tomorrow": "Tomorrow",
    "book.select_slot": "Select Convenient Slot",
    "book.emergency_badge": "⚡ 45-Min Emergency ASAP",
    "book.emergency_desc": "Immediate emergency dispatch for water leaks, sparking, or lockouts.",
    "book.proceed": "Proceed to Booking",
    "book.sign_in_required": "Please sign in to confirm your booking.",

    // Packages
    "pkg.section_title": "Curated Bundled Service Packages",
    "pkg.section_subtitle": "Popular multi-room and seasonal household packages bundled with guaranteed cooperative savings.",
    "pkg.save": "Save ₹",
    "pkg.book_package": "Book Package",
    "pkg.includes": "Included in this bundle",

    // AI Diagnosis
    "ai.title": "AI Visual Problem Detection",
    "ai.subtitle": "Upload a photo of your damaged appliance or fixture. Google Gemini AI identifies root causes, repair scopes, and fair cooperative pricing.",
    "ai.upload_prompt": "Drag & drop your photo here, or click to browse",
    "ai.analyzing": "AI analyzing damage with multimodal vision...",
    "ai.possible_problem": "Detected Problem",
    "ai.recommended_service": "Recommended Trade",
    "ai.estimated_cost": "Estimated Cost",
    "ai.find_provider": "Book This Service",

    // Worker Welfare
    "welfare.title": "Worker Welfare & Social Security",
    "welfare.balance_card": "Cooperative Welfare Fund Balance",
    "welfare.eshram_title": "e-Shram National Database Integration",
    "welfare.eshram_verified": "Ministry of Labour & Employment Verified",
    "welfare.insurance_title": "Active Group Insurance Policy",
    "welfare.file_claim": "File an On-Duty Injury / Tool Damage Claim",

    // Parallel Status Updates
    "status.on_the_way": "Specialist On The Way",
    "status.arrived": "Specialist Arrived",
    "status.in_progress": "Work In Progress",
    "status.completed": "Service Completed",
    "status.call_pro": "Call Specialist",
  },

  hi: {
    // Nav & Common
    "nav.home": "होम",
    "nav.services": "सेवाएं",
    "nav.packages": "विशेष पैकेज",
    "nav.ai_diagnosis": "एआई समस्या निदान",
    "nav.society_pools": "सोसायटी पूल्स",
    "nav.admin": "प्रशासन मुख्यालय",
    "nav.provider": "कारीगर केंद्र",
    "nav.member": "सदस्य डैशबोर्ड",
    "nav.login": "साइन इन करें",
    "nav.register": "कारीगर / सदस्य बनें",
    "nav.welfare": "कल्याण एवं ई-श्रम",
    "nav.download_app": "ऐप डाउनलोड (.APK)",
    "nav.book_service": "सेवा बुक करें",
    "nav.support": "सहायता",

    // Hero & Tagline
    "hero.badge": "सत्यापित श्रम सहकारी महासंघ नेटवर्क",
    "hero.title_prefix": "घरेलू सेवाएं, जिनका स्वामित्व",
    "hero.title_highlight": "कुशल कारीगरों",
    "hero.title_suffix": "के पास है",
    "hero.subtitle": "शहरी परिवारों को सत्यापित स्थानीय इलेक्ट्रीशियन, प्लंबर, बढ़ई और तकनीशियनों से जोड़ना—गिग श्रमिकों को निष्पक्ष वेतन और सामाजिक सुरक्षा के साथ सम्मानित सह-मालिक बनाना।",
    "hero.cta_book": "सत्यापित कारीगर बुक करें",
    "hero.cta_ai": "📸 एआई से जांचें",
    "hero.search_placeholder": "खोजें 'एसी गैस लीक', 'नल रिपेयर', 'स्विच स्पार्किंग'...",
    "hero.stat_workers": "प्रमाणित सहकारी कारीगर",
    "hero.stat_commission": "सीधे कारीगर को",
    "hero.stat_rating": "औसत रेटिंग",
    "hero.stat_cities": "सक्रिय जिले",

    // Quick Booking Modal
    "book.title": "त्वरित सेवा बुकिंग",
    "book.subtitle": "शून्य सर्ज मूल्य निर्धारण के साथ मानकीकृत सहकारी दरें।",
    "book.select_category": "प्राथमिक सेवा चुनें",
    "book.select_date": "तारीख चुनें",
    "book.today": "आज",
    "book.tomorrow": "कल",
    "book.select_slot": "सुविधाजनक समय चुनें",
    "book.emergency_badge": "⚡ 45-मिनट आपातकालीन सेवा",
    "book.emergency_desc": "पानी के रिसाव, स्पार्किंग या लॉकआउट के लिए तत्काल आपातकालीन सेवा।",
    "book.proceed": "बुकिंग आगे बढ़ाएं",
    "book.sign_in_required": "बुकिंग की पुष्टि करने के लिए कृपया साइन इन करें।",

    // Packages
    "pkg.section_title": "विशेष बंडल सेवा पैकेज",
    "pkg.section_subtitle": "गारंटीशुदा सहकारी बचत के साथ लोकप्रिय बहु-कमरा और मौसमी घरेलू पैकेज।",
    "pkg.save": "बचत ₹",
    "pkg.book_package": "पैकेज बुक करें",
    "pkg.includes": "इस पैकेज में शामिल",

    // AI Diagnosis
    "ai.title": "एआई विजुअल समस्या पहचान",
    "ai.subtitle": "अपने खराब उपकरण की फोटो अपलोड करें। गूगल जेमिनी एआई खराबी के कारण और निष्पक्ष सहकारी लागत की तुरंत पहचान करता है।",
    "ai.upload_prompt": "अपनी फोटो यहाँ खींचें या ब्राउज़ करने के लिए क्लिक करें",
    "ai.analyzing": "एआई विज़न द्वारा खराबी का विश्लेषण हो रहा है...",
    "ai.possible_problem": "पहचानी गई समस्या",
    "ai.recommended_service": "अनुशंसित विशेषज्ञ",
    "ai.estimated_cost": "अनुमानित लागत",
    "ai.find_provider": "यह सेवा बुक करें",

    // Worker Welfare
    "welfare.title": "कारीगर कल्याण एवं सामाजिक सुरक्षा",
    "welfare.balance_card": "सहकारी कल्याण कोष शेष",
    "welfare.eshram_title": "ई-श्रम राष्ट्रीय डेटाबेस एकीकरण",
    "welfare.eshram_verified": "श्रम एवं रोजगार मंत्रालय द्वारा सत्यापित",
    "welfare.insurance_title": "सक्रिय समूह बीमा पॉलिसी",
    "welfare.file_claim": "ड्यूटी चोट / उपकरण क्षति दावा दर्ज करें",

    // Parallel Status Updates
    "status.on_the_way": "कारीगर रास्ते में है",
    "status.arrived": "कारीगर पहुंच गया है",
    "status.in_progress": "काम जारी है",
    "status.completed": "सेवा पूरी हुई",
    "status.call_pro": "कारीगर को कॉल करें",
  },

  ta: {
    // Nav & Common
    "nav.home": "முகப்பு",
    "nav.services": "சேவைகள்",
    "nav.packages": "சிறப்பு தொகுப்புகள்",
    "nav.ai_diagnosis": "AI பிரச்சனை கண்டறிதல்",
    "nav.society_pools": "குடியிருப்பு பூல்",
    "nav.admin": "நிர்வாக மையம்",
    "nav.provider": "தொழிலாளர் மையம்",
    "nav.member": "உறுப்பினர் பலகை",
    "nav.login": "உள்நுழைக",
    "nav.register": "இணையுங்கள்",
    "nav.welfare": "நலன்புரி & இ-ஷ்ரம்",
    "nav.download_app": "செயலி பதிவிறக்கம் (.APK)",
    "nav.book_service": "சேவையை முன்பதிவு செய்க",
    "nav.support": "ஆதரவு",

    // Hero & Tagline
    "hero.badge": "சரிபார்க்கப்பட்ட தொழிலாளர் கூட்டுறவு கூட்டமைப்பு",
    "hero.title_prefix": "திறமையான தொழிலாளர்களின்",
    "hero.title_highlight": "சொந்த வீட்டு சேவைகள்",
    "hero.title_suffix": "உங்கள் கைகளில்",
    "hero.subtitle": "நகர்ப்புற குடும்பங்களை சரிபார்க்கப்பட்ட உள்ளூர் எலக்ட்ரீஷியன்கள், பிளம்பர்கள் மற்றும் தச்சர்களுடன் இணைக்கிறது—கூட்டுறவு இணை உரிமையாளர்களாக மாற்றுகிறது.",
    "hero.cta_book": "தொழிலாளரை முன்பதிவு செய்க",
    "hero.cta_ai": "📸 AI மூலம் கண்டறிக",
    "hero.search_placeholder": "தேடுக 'ஏசி பழுது', 'குழாய் கசிவு'...",
    "hero.stat_workers": "சான்றளிக்கப்பட்ட கூட்டுறவு வீரர்கள்",
    "hero.stat_commission": "நேரடி தொழிலாளர் வருவாய்",
    "hero.stat_rating": "மதிப்பீடு",
    "hero.stat_cities": "செயலில் உள்ள மாவட்டங்கள்",

    // Quick Booking Modal
    "book.title": "விரைவு சேவை முன்பதிவு",
    "book.subtitle": "எவ்வித கூடுதல் கட்டணமும் இல்லாத தரமான கூட்டுறவு விலைகள்.",
    "book.select_category": "முதன்மை சேவையைத் தேர்வுசெய்க",
    "book.select_date": "தேதியைத் தேர்வுசெய்க",
    "book.today": "இன்று",
    "book.tomorrow": "நாளை",
    "book.select_slot": "நேரத்தைத் தேர்ந்தெடுக்கவும்",
    "book.emergency_badge": "⚡ 45-நிமிட அவசர சேவை",
    "book.emergency_desc": "நீர் கசிவு, தீப்பொறி அல்லது பூட்டு கோளாறுகளுக்கு உடனடி அவசர உதவி.",
    "book.proceed": "முன்பதிவைத் தொடரவும்",
    "book.sign_in_required": "முன்பதிவு செய்ய உள்நுழைக.",

    // Packages
    "pkg.section_title": "சிறப்பு கூட்டுறவு தொகுப்புகள்",
    "pkg.section_subtitle": "உறுதிசெய்யப்பட்ட கூட்டுறவு சேமிப்புடன் பிரபலமான வீட்டுப் பராமரிப்பு தொகுப்புகள்.",
    "pkg.save": "சேமிப்பு ₹",
    "pkg.book_package": "தொகுப்பை முன்பதிவு செய்க",
    "pkg.includes": "இதில் அடங்கியவை",

    // AI Diagnosis
    "ai.title": "AI காட்சிப் பிரச்சனை கண்டறிதல்",
    "ai.subtitle": "சேதமடைந்த பொருளின் புகைப்படத்தைப் பதிவேற்றவும். AI மூல காரணத்தை துல்லியமாக கண்டறியும்.",
    "ai.upload_prompt": "புகைப்படத்தை இழுத்து விடவும் அல்லது தேர்வு செய்க",
    "ai.analyzing": "AI ஆய்வு செய்கிறது...",
    "ai.possible_problem": "கண்டறியப்பட்ட பிரச்சனை",
    "ai.recommended_service": "பரிந்துரைக்கப்பட்ட சேவை",
    "ai.estimated_cost": "மதிப்பீட்டுத் தொகை",
    "ai.find_provider": "சேவையை முன்பதிவு செய்க",

    // Worker Welfare
    "welfare.title": "தொழிலாளர் நலன் மற்றும் சமூகப் பாதுகாப்பு",
    "welfare.balance_card": "கூட்டுறவு நல நிதி இருப்பு",
    "welfare.eshram_title": "இ-ஷ்ரம் தேசிய தரவுத்தள இணைப்பு",
    "welfare.eshram_verified": "மத்திய தொழிலாளர் அமைச்சகத்தால் சரிபார்க்கப்பட்டது",
    "welfare.insurance_title": "செயலில் உள்ள காப்பீடு",
    "welfare.file_claim": "பணி காய / சேத உரிமைகோரல் சமர்ப்பிக்கவும்",

    // Parallel Status Updates
    "status.on_the_way": "தொழிலாளர் வழியில் உள்ளார்",
    "status.arrived": "தொழிலாளர் வந்துவிட்டார்",
    "status.in_progress": "வேலை நடைபெறுகிறது",
    "status.completed": "வேலை முடிந்தது",
    "status.call_pro": "தொழிலாளரை அழைக்கவும்",
  },

  te: {
    // Nav & Common
    "nav.home": "హోమ్",
    "nav.services": "సేవలు",
    "nav.packages": "ప్యాకేజీలు",
    "nav.ai_diagnosis": "AI సమస్య నిర్ధారణ",
    "nav.society_pools": "సొసైటీ పూల్స్",
    "nav.admin": "అడ్మిన్ హెచ్‌క్యూ",
    "nav.provider": "కార్మికుల కేంద్రం",
    "nav.member": "మెంబర్ డాష్‌బోర్డ్",
    "nav.login": "సైన్ ఇన్",
    "nav.register": "చేరండి",
    "nav.welfare": "సంక్షేమం & ఈ-శ్రమ్",
    "nav.download_app": "యాప్ డౌన్‌లోడ్ (.APK)",
    "nav.book_service": "సేవను బుక్ చేయండి",
    "nav.support": "సహాయం",

    // Hero & Tagline
    "hero.badge": "ధృవీకరించబడిన లేబర్ కోఆపరేటివ్ ఫెడరేషన్ నెట్‌వర్క్",
    "hero.title_prefix": "నైపుణ్యం కలిగిన కార్మికుల స్వంత",
    "hero.title_highlight": "గృహ సేవలు",
    "hero.title_suffix": "మీ చేతుల్లో",
    "hero.subtitle": "నగర గృహాలను స్థానిక ధృవీకరించబడిన ఎలక్ట్రీషియన్లు, ప్లంబర్లు, వడ్రంగులతో అనుసంధానం చేస్తుంది—కార్మికులను గౌరవప్రదమైన సహ-యజమానులుగా మారుస్తుంది.",
    "hero.cta_book": "కార్మికుడిని బుక్ చేయండి",
    "hero.cta_ai": "📸 AI తో పరీక్షించండి",
    "hero.search_placeholder": "వెతకండి 'ఏసీ గ్యాస్ లీక్', 'పైప్ మరమ్మతు'...",
    "hero.stat_workers": "ధృవీకరించబడిన కార్మికులు",
    "hero.stat_commission": "నేరుగా కార్మికుడికి",
    "hero.stat_rating": "సగటు రేటింగ్",
    "hero.stat_cities": "యాక్టివ్ జిల్లాలు",

    // Quick Booking Modal
    "book.title": "త్వరిత సేవా బుకింగ్",
    "book.subtitle": "ఎలాంటి సర్జ్ ఛార్జీలు లేని ప్రామాణిక సహకార ధరలు.",
    "book.select_category": "సేవను ఎంచుకోండి",
    "book.select_date": "తేదీని ఎంచుకోండి",
    "book.today": "ఈరోజు",
    "book.tomorrow": "రేపు",
    "book.select_slot": "సమయాన్ని ఎంచుకోండి",
    "book.emergency_badge": "⚡ 45-నిమిషాల అత్యవసర సేవ",
    "book.emergency_desc": "నీటి లీకేజీలు, షార్ట్ సర్క్యూట్‌ల కోసం తక్షణ అత్యవసర సేవ.",
    "book.proceed": "బుకింగ్‌తో కొనసాగండి",
    "book.sign_in_required": "బుకింగ్ నిర్ధారించడానికి సైన్ ఇన్ చేయండి.",

    // Packages
    "pkg.section_title": "ప్రత్యేక కోఆపరేటివ్ ప్యాకేజీలు",
    "pkg.section_subtitle": "హామీ ఇవ్వబడిన పొదుపులతో ప్రముఖ గృహ సేవా ప్యాకేజీలు.",
    "pkg.save": "పొదుపు ₹",
    "pkg.book_package": "ప్యాకేజ్ బుక్ చేయండి",
    "pkg.includes": "ఇందులో ఉన్నవి",

    // AI Diagnosis
    "ai.title": "AI విజువల్ సమస్య గుర్తింపు",
    "ai.subtitle": "పాడైన పరికరం ఫోటోను అప్‌లోడ్ చేయండి. AI అసలు సమస్యను మరియు న్యాయమైన ధరను గుర్తిస్తుంది.",
    "ai.upload_prompt": "ఫోటోను ఇక్కడ వేయండి లేదా ఎంచుకోండి",
    "ai.analyzing": "AI విశ్లేషిస్తోంది...",
    "ai.possible_problem": "గుర్తించిన సమస్య",
    "ai.recommended_service": "సిఫార్సు చేసిన సేవ",
    "ai.estimated_cost": "అంచనా వేసిన ఖర్చు",
    "ai.find_provider": "సేవను బుక్ చేయండి",

    // Worker Welfare
    "welfare.title": "కార్మికుల సంక్షేమం మరియు భద్రత",
    "welfare.balance_card": "కోఆపరేటివ్ సంక్షేమ నిధి నిల్వ",
    "welfare.eshram_title": "ఈ-శ్రమ్ జాతీయ డేటాబేస్ అనుసంధానం",
    "welfare.eshram_verified": "కార్మిక మంత్రిత్వ శాఖచే ధృవీకరించబడింది",
    "welfare.insurance_title": "యాక్టివ్ గ్రూప్ బీమా పాలసీ",
    "welfare.file_claim": "ప్రమాద / టూల్ నష్ట క్లెయిమ్ సమర్పించండి",

    // Parallel Status Updates
    "status.on_the_way": "కార్మికుడు దారిలో ఉన్నారు",
    "status.arrived": "కార్మికుడు చేరుకున్నారు",
    "status.in_progress": "పని జరుగుతోంది",
    "status.completed": "సేవ పూర్తయింది",
    "status.call_pro": "కార్మికుడికి కాల్ చేయండి",
  },

  kn: {
    // Nav & Common
    "nav.home": "ಮುಖಪುಟ",
    "nav.services": "ಸೇವೆಗಳು",
    "nav.packages": "ಪ್ಯಾಕೇಜುಗಳು",
    "nav.ai_diagnosis": "AI ಸಮಸ್ಯೆ ಪತ್ತೆ",
    "nav.society_pools": "ಸೊಸೈಟಿ ಪೂಲ್ಸ್",
    "nav.admin": "ಆಡಳಿತ ಕೇಂದ್ರ",
    "nav.provider": "ಕಾರ್ಮಿಕರ ಕೇಂದ್ರ",
    "nav.member": "ಸದಸ್ಯರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.login": "ಸೈನ್ ಇನ್",
    "nav.register": "ಸದಸ್ಯರಾಗಿ ನೋಂದಾಯಿಸಿ",
    "nav.welfare": "ಕಲ್ಯಾಣ & ಇ-ಶ್ರಮ್",
    "nav.download_app": "ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ (.APK)",
    "nav.book_service": "ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ",
    "nav.support": "ಬೆಂಬಲ",

    // Hero & Tagline
    "hero.badge": "ಪರಿಶೀಲಿತ ಕಾರ್ಮಿಕ ಸಹಕಾರಿ ಮಹಾಮಂಡಳ ನೆಟ್‌ವರ್ಕ್",
    "hero.title_prefix": "ಕುಶಲ ಕಾರ್ಮಿಕರ ಒಡೆತನದ",
    "hero.title_highlight": "ಗೃಹ ಸೇವೆಗಳು",
    "hero.title_suffix": "ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ",
    "hero.subtitle": "ನಗರದ ಕುಟುಂಬಗಳನ್ನು ಪರಿಶೀಲಿತ ಸ್ಥಳೀಯ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಪ್ಲಂಬರ್, ಬಡಗಿಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ—ಕಾರ್ಮಿಕರಿಗೆ ನ್ಯಾಯಯುತ ವೇತನ ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆ ನೀಡುವ ಸಹ-ಮಾಲೀಕ ವೇದಿಕೆ.",
    "hero.cta_book": "ಪರಿಶೀಲಿತ ವೃತ್ತಿಪರರನ್ನು ಕಾಯ್ದಿರಿಸಿ",
    "hero.cta_ai": "📸 AI ನಿಂದ ಪರೀಕ್ಷಿಸಿ",
    "hero.search_placeholder": "ಹುಡುಕಿ 'ಎಸಿ ಗ್ಯಾಸ್ ಸೋರಿಕೆ', 'ಪೈಪ್ ರಿಪೇರಿ'...",
    "hero.stat_workers": "ಪ್ರಮಾಣೀಕೃತ ಸಹಕಾರಿ ಕಾರ್ಮಿಕರು",
    "hero.stat_commission": "ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ",
    "hero.stat_rating": "ಸರಾಸರಿ ರೇಟಿಂಗ್",
    "hero.stat_cities": "ಕಾರ್ಯನಿರತ ಜಿಲ್ಲೆಗಳು",

    // Quick Booking Modal
    "book.title": "ತ್ವರಿತ ಸೇವಾ ಬುಕಿಂಗ್",
    "book.subtitle": "ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವಿಲ್ಲದ ಪ್ರಮಾಣಿತ ಸಹಕಾರಿ ದರಗಳು.",
    "book.select_category": "ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "book.select_date": "ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "book.today": "ಇಂದು",
    "book.tomorrow": "ನಾಳೆ",
    "book.select_slot": "ಸಮಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "book.emergency_badge": "⚡ 45-ನಿಮಿಷಗಳ ತುರ್ತು ಸೇವೆ",
    "book.emergency_desc": "ನೀರು ಸೋರಿಕೆ, ಶಾರ್ಟ್ ಸರ್ಕ್ಯೂಟ್‌ಗಳಿಗೆ ತಕ್ಷಣದ ತುರ್ತು ಸೇವೆ.",
    "book.proceed": "ಬುಕಿಂಗ್ ಮುಂದುವರಿಸಿ",
    "book.sign_in_required": "ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಲು ದಯವಿಟ್ಟು ಸೈನ್ ಇನ್ ಮಾಡಿ.",

    // Packages
    "pkg.section_title": "ವಿಶೇಷ ಸಹಕಾರಿ ಪ್ಯಾಕೇಜುಗಳು",
    "pkg.section_subtitle": "ಖಾತರಿಯ ಸಹಕಾರಿ ಉಳಿತಾಯದೊಂದಿಗೆ ಜನಪ್ರಿಯ ಗೃಹ ಸೇವಾ ಪ್ಯಾಕೇಜುಗಳು.",
    "pkg.save": "ಉಳಿತಾಯ ₹",
    "pkg.book_package": "ಪ್ಯಾಕೇಜ್ ಕಾಯ್ದಿರಿಸಿ",
    "pkg.includes": "ಇದರಲ್ಲಿ ಒಳಗೊಂಡಿರುವ ಸೇವೆಗಳು",

    // AI Diagnosis
    "ai.title": "AI ದೃಶ್ಯ ಸಮಸ್ಯೆ ಪತ್ತೆ",
    "ai.subtitle": "ಹಾಳಾದ ಉಪಕರಣದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. AI ಸಮಸ್ಯೆಯ ಮೂಲ ಕಾರಣ ಮತ್ತು ನ್ಯಾಯಯುತ ವೆಚ್ಚವನ್ನು ಗುರುತಿಸುತ್ತದೆ.",
    "ai.upload_prompt": "ಫೋಟೋವನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ",
    "ai.analyzing": "AI ವಿಶ್ಲೇಷಣೆ ಮಾಡುತ್ತಿದೆ...",
    "ai.possible_problem": "ಪತ್ತೆಯಾದ ಸಮಸ್ಯೆ",
    "ai.recommended_service": "ಶಿಫಾರಸು ಮಾಡಿದ ಸೇವೆ",
    "ai.estimated_cost": "ಅಂದಾಜು ವೆಚ್ಚ",
    "ai.find_provider": "ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ",

    // Worker Welfare
    "welfare.title": "ಕಾರ್ಮಿಕರ ಕಲ್ಯಾಣ ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆ",
    "welfare.balance_card": "ಸಹಕಾರಿ ಕಲ್ಯಾಣ ನಿಧಿ ಬಾಕಿ",
    "welfare.eshram_title": "ಇ-ಶ್ರಮ್ ರಾಷ್ಟ್ರೀಯ ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ",
    "welfare.eshram_verified": "ಕಾರ್ಮಿಕ ಸಚಿವಾಲಯದಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "welfare.insurance_title": "ಸಕ್ರಿಯ ಗುಂಪು ವಿಮಾ ಪಾಲಿಸಿ",
    "welfare.file_claim": "ಕಾರ್ಯನಿರತ ಗಾಯ / ಉಪಕರಣ ಹಾನಿ ಕ್ಲೈಮ್ ಸಲ್ಲಿಸಿ",

    // Parallel Status Updates
    "status.on_the_way": "ಕಾರ್ಮಿಕರು ದಾರಿಯಲ್ಲಿದ್ದಾರೆ",
    "status.arrived": "ಕಾರ್ಮಿಕರು ತಲುಪಿದ್ದಾರೆ",
    "status.in_progress": "ಕೆಲಸ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    "status.completed": "ಸೇವೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    "status.call_pro": "ಕಾರ್ಮಿಕರಿಗೆ ಕರೆ ಮಾಡಿ",
  },
};
