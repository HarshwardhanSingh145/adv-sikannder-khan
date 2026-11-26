export type Language = "en" | "hi";

export interface TranslationDict {
  // Navigation & Header
  navHome: string;
  navAbout: string;
  navPractice: string;
  navExperience: string;
  navCases: string;
  navBlog: string;
  navContact: string;
  navCallNow: string;
  advocateTitle: string;
  courtSubtitle: string;

  // Hero Section
  heroSubtitle: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTagline: string;
  heroDesc: string;
  heroCtaConsult: string;
  heroCtaPractices: string;
  heroStatYears: string;
  heroStatExp: string;
  heroStatClients: string;
  heroStatTrust: string;

  // Section 1: About
  aboutTitle: string;
  aboutBadge: string;
  aboutHeading: string;
  aboutDesc1: string;
  aboutDesc2: string;
  aboutCard1: string;
  aboutCard1Sub: string;
  aboutCard2: string;
  aboutCard2Sub: string;
  aboutCard3: string;
  aboutCard3Sub: string;
  aboutCard4: string;
  aboutCard4Sub: string;

  // Section 2: Practice Areas
  practiceBadge: string;
  practiceTitle: string;
  practiceDesc: string;
  paCivilTitle: string;
  paCivilDesc: string;
  paPropertyTitle: string;
  paPropertyDesc: string;
  paFamilyTitle: string;
  paFamilyDesc: string;
  paLandTitle: string;
  paLandDesc: string;
  paDocTitle: string;
  paDocDesc: string;
  paConsultTitle: string;
  paConsultDesc: string;

  // Section 3: Why Choose Us
  whyBadge: string;
  whyTitle: string;
  whyDesc: string;
  wcAdviceTitle: string;
  wcAdviceDesc: string;
  wcCourtTitle: string;
  wcCourtDesc: string;
  wcProcessTitle: string;
  wcProcessDesc: string;
  wcConfTitle: string;
  wcConfDesc: string;

  // Section 4: Case Results / Stats
  statsBadge: string;
  statsTitle: string;
  statsDesc: string;
  statYearsVal: string;
  statYearsLbl: string;
  statClientsVal: string;
  statClientsLbl: string;
  statCasesVal: string;
  statCasesLbl: string;
  statSuccessVal: string;
  statSuccessLbl: string;

  // Section 5: Legal Process
  processBadge: string;
  processTitle: string;
  processDesc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;

  // Section 6: Testimonials
  testiBadge: string;
  testiTitle: string;
  testiDesc: string;
  client1Name: string;
  client1Case: string;
  client1Quote: string;
  client2Name: string;
  client2Case: string;
  client2Quote: string;
  client3Name: string;
  client3Case: string;
  client3Quote: string;

  // Section 7: FAQ
  faqBadge: string;
  faqTitle: string;
  faqDesc: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;
  faqQ5: string;
  faqA5: string;

  // Section 8: Blog
  blogBadge: string;
  blogTitle: string;
  blogDesc: string;
  blogReadMore: string;
  blogCategory1: string;
  blogDate1: string;
  blogH1: string;
  blogCategory2: string;
  blogDate2: string;
  blogH2: string;
  blogCategory3: string;
  blogDate3: string;
  blogH3: string;

  // Section 9: Consultation Form
  consultBadge: string;
  consultTitle: string;
  consultDesc: string;
  formName: string;
  formNamePlh: string;
  formPhone: string;
  formPhonePlh: string;
  formEmail: string;
  formEmailPlh: string;
  formSubject: string;
  formSubjectPlh: string;
  formMsg: string;
  formMsgPlh: string;
  formSubmit: string;
  contactHours: string;
  contactHoursVal: string;
  contactAddress: string;
  contactAddressVal: string;
  contactPhone: string;
  contactEmail: string;
  formSuccessMsg: string;

  // Section 10: Final CTA
  ctaTitle: string;
  ctaDesc: string;
  ctaBtnCall: string;
  ctaBtnBook: string;

  // Section 11: Footer
  footerAboutDesc: string;
  footerQuickLinks: string;
  footerPracticeAreas: string;
  footerContact: string;
  footerCopy: string;
  footerPrivacy: string;
  footerTerms: string;
  backToTop: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    navHome: "HOME",
    navAbout: "ABOUT",
    navPractice: "PRACTICE AREAS",
    navExperience: "EXPERIENCE",
    navCases: "CASES",
    navBlog: "BLOG",
    navContact: "CONTACT",
    navCallNow: "CALL NOW",
    advocateTitle: "SIKANDAR KHAN",
    courtSubtitle: "CIVIL COURT, MAKRANA",

    heroSubtitle: "26+ YEARS OF LEGAL EXCELLENCE",
    heroTitle1: "Your Rights.",
    heroTitle2: "Our Commitment.",
    heroTagline: "Trusted Legal Representation Since 1998",
    heroDesc: "Advocate Sikandar Khan provides strategic legal solutions with integrity, dedication, and a client-first approach at the Civil Court, Makrana.",
    heroCtaConsult: "CONSULT NOW",
    heroCtaPractices: "OUR PRACTICE AREAS",
    heroStatYears: "YEARS",
    heroStatExp: "OF EXPERIENCE",
    heroStatClients: "1000+",
    heroStatTrust: "CLIENTS TRUST",

    aboutTitle: "ABOUT THE ADVOCATE",
    aboutBadge: "LEGAL LEGACY",
    aboutHeading: "26+ Years of Proven Courtroom Excellence",
    aboutDesc1: "Advocate Sikandar Khan has been a cornerstone of legal integrity and professional dedication at the Civil Court of Makrana since 1998. Specialized in intricate civil litigations, property disputes, and land revenue cases, his practice is built on the pillars of absolute honesty and client transparency.",
    aboutDesc2: "We understand that legal battles can be overwhelming. That is why our counsel goes beyond mere representation; we provide strategic guidance, realistic assessments, and robust defense to protect your rights at every step of the judicial process.",
    aboutCard1: "26+ Years",
    aboutCard1Sub: "Of Active Practice",
    aboutCard2: "1000+",
    aboutCard2Sub: "Satisfied Clients",
    aboutCard3: "Makrana Court",
    aboutCard3Sub: "Primary Jurisdiction",
    aboutCard4: "Honest Advice",
    aboutCard4Sub: "No False Promises",

    practiceBadge: "OUR PRACTICE AREAS",
    practiceTitle: "Specialized Legal Expertise",
    practiceDesc: "Providing comprehensive legal solutions across multiple legal domains with meticulous research and courtroom expertise.",
    paCivilTitle: "Civil Cases",
    paCivilDesc: "Expert litigation in property recovery, injunctions, declarations, contract disputes, and money recovery suits.",
    paPropertyTitle: "Property Disputes",
    paPropertyDesc: "Strategic legal advice on partition suits, easement rights, title disputes, and ancestral property inheritance.",
    paFamilyTitle: "Family Law",
    paFamilyDesc: "Compassionate counsel in matrimonial suits, family settlements, guardianship, and succession certificates.",
    paLandTitle: "Land Matters",
    paLandDesc: "Comprehensive handling of agricultural land disputes, revenue appeals, mutation, and tenancy rights.",
    paDocTitle: "Documentation",
    paDocDesc: "Drafting premium deeds, legal notices, sale agreements, wills, power of attorney, and title verification reports.",
    paConsultTitle: "Legal Consultation",
    paConsultDesc: "Detailed case evaluation, legal risk analysis, and strategic advisory before initiating judicial proceedings.",

    whyBadge: "WHY CHOOSE ADVOCATE SIKANDAR KHAN",
    whyTitle: "Defending Your Legal Rights with Distinction",
    whyDesc: "Our practice is built on a legacy of trust, legal acumen, and absolute devotion to securing the best outcome for our clients.",
    wcAdviceTitle: "Transparent & Honest Advice",
    wcAdviceDesc: "We provide realistic case analysis and transparent legal advice without any misleading promises or hidden paths.",
    wcCourtTitle: "Strong Courtroom Representation",
    wcCourtDesc: "Meticulous legal research and assertive arguments backed by over two decades of successful courtroom litigation.",
    wcProcessTitle: "Fast & Strategic Legal Process",
    wcProcessDesc: "Every file is processed systematically to minimize court delays, ensuring speedy drafting and proactive follow-ups.",
    wcConfTitle: "Absolute Client Confidentiality",
    wcConfDesc: "Your privacy is our utmost priority. All client records and conversations are protected under privileged attorney-client trust.",

    statsBadge: "PROVEN RECORD",
    statsTitle: "Our Accomplishments in Numbers",
    statsDesc: "A testament to our dedication, consistency, and professional standards over the past 26 years.",
    statYearsVal: "26+",
    statYearsLbl: "Years in Practice",
    statClientsVal: "1000+",
    statClientsLbl: "Satisfied Clients",
    statCasesVal: "500+",
    statCasesLbl: "Cases Handled Successfully",
    statSuccessVal: "95%",
    statSuccessLbl: "Courtroom Success Rate",

    processBadge: "WORKING METHODOLOGY",
    processTitle: "Our Structured Legal Process",
    processDesc: "A transparent, systematic five-step approach that guarantees absolute clarity and readiness at every stage.",
    step1Title: "Initial Consultation",
    step1Desc: "We sit down to listen to your matter, review preliminary facts, and understand your ultimate goals.",
    step2Title: "Case Evaluation",
    step2Desc: "Deep analysis of available papers, land registry records, or contracts to evaluate strengths and weaknesses.",
    step3Title: "Legal Strategy",
    step3Desc: "Formulating a tailored strategic plan, choosing correct legal remedies, and preparing robust drafts.",
    step4Title: "Court Representation",
    step4Desc: "Assertive advocacy, systematic filing of evidence, and professional presentation before the judge.",
    step5Title: "Successful Resolution",
    step5Desc: "Achieving the optimum result, ensuring order execution, and protecting your interests permanently.",

    testiBadge: "CLIENT TESTIMONIALS",
    testiTitle: "Hear From Our Trusted Clients",
    testiDesc: "True stories of relief and justice from individuals and families we have represented over the decades.",
    client1Name: "Rameshwar Gehlot",
    client1Case: "Property Partition Suit",
    client1Quote: "Advocate Sikandar Khan resolved our ancestral property partition dispute which was stuck for 12 years. His honest guidance and deep knowledge of land laws got us justice.",
    client2Name: "Mohammad Yusuf",
    client2Case: "Land Revenue Matter",
    client2Quote: "I was highly impressed by the strategic approach taken in my agricultural land mutation appeal. He explained everything transparently and defended us aggressively.",
    client3Name: "Sohan Lal Sharma",
    client3Case: "Civil Recovery Suit",
    client3Quote: "Professional, accessible, and extremely ethical. He recovered my hard-earned commercial dues with highly strategic civil litigation. Truly the most reliable lawyer in Makrana.",

    faqBadge: "FREQUENTLY ASKED QUESTIONS",
    faqTitle: "Clarifying Your Legal Doubts",
    faqDesc: "Common queries regarding our legal practice, consultations, and how we handle civil disputes.",
    faqQ1: "How do I schedule an appointment for consultation?",
    faqA1: "You can schedule an appointment by calling us directly at our phone number or by filling out the online Book Consultation form below. We will confirm your timing within 2 hours.",
    faqQ2: "What documents should I bring for my first meeting?",
    faqA2: "Please bring all documents relevant to your dispute: property registry, sale deeds, agreements, previous court orders, land mutation (Jamabandi) records, or any legal notices received.",
    faqQ3: "Which legal matters do you handle primarily?",
    faqA3: "Our primary expertise is in Civil Law, including property partition, land disputes, injunction suits, family settlement, contract drafting, and revenue appeals in Makrana and surrounding areas.",
    faqQ4: "What are your consultation charges?",
    faqA4: "Consultation charges vary depending on the complexity of the case files and documentation. We discuss fees transparently during our first call—no hidden costs or surprises.",
    faqQ5: "How long does a typical civil case take in India?",
    faqA5: "Civil cases vary widely in timeline based on evidence and counter-arguments. However, with our proactive drafting and structured courtroom follow-ups, we aim for the speediest resolution possible.",

    blogBadge: "LEGAL KNOWLEDGE",
    blogTitle: "Latest Legal Insights & Articles",
    blogDesc: "Educating citizens on civil rights, property laws, and court procedures in India.",
    blogReadMore: "READ FULL ARTICLE",
    blogCategory1: "Land Laws",
    blogDate1: "June 12, 2026",
    blogH1: "Understanding Property Partition & Inheritance Laws in Rajasthan",
    blogCategory2: "Civil Procedure",
    blogDate2: "May 28, 2026",
    blogH2: "What is an Injunction Suit? Protecting Your Land from Encroachment",
    blogCategory3: "Documentation",
    blogDate3: "May 10, 2026",
    blogH3: "Key Elements to Check Before Signing a Land Sale Agreement",

    consultBadge: "GET IN TOUCH",
    consultTitle: "Book a Professional Consultation",
    consultDesc: "Fill out the secure form below to share your matter. Our office will review and connect with you immediately.",
    formName: "Full Name",
    formNamePlh: "Enter your full name",
    formPhone: "Phone Number",
    formPhonePlh: "Enter your 10-digit phone number",
    formEmail: "Email Address (Optional)",
    formEmailPlh: "Enter your email address",
    formSubject: "Legal Subject / Case Type",
    formSubjectPlh: "e.g., Property Dispute, Family Law, Land Mutation",
    formMsg: "Describe Your Legal Matter",
    formMsgPlh: "Provide a brief description of your case or legal query...",
    formSubmit: "BOOK CONSULTATION",
    contactHours: "Working Hours",
    contactHoursVal: "Monday - Saturday: 09:00 AM - 07:00 PM (Sunday Closed)",
    contactAddress: "Office Address",
    contactAddressVal: "Advocate Chambers, Civil Court Campus, Makrana, Rajasthan - 341502",
    contactPhone: "Phone",
    contactEmail: "Email",
    formSuccessMsg: "Thank you! Your request has been sent successfully. We will call you shortly.",

    ctaTitle: "Protect Your Rights Today",
    ctaDesc: "Do not let delay weaken your legal standing. Secure professional, honest, and expert legal counsel now.",
    ctaBtnCall: "CALL ADVOCATE NOW",
    ctaBtnBook: "BOOK APPOINTMENT",

    footerAboutDesc: "Providing top-tier legal advocacy and strategic representation with a legacy of absolute integrity and courtroom excellence since 1998.",
    footerQuickLinks: "Quick Links",
    footerPracticeAreas: "Practice Areas",
    footerContact: "Contact Office",
    footerCopy: "© 2026 Advocate Sikandar Khan • Civil Court, Makrana • All Rights Reserved",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms & Conditions",
    backToTop: "BACK TO TOP",
  },
  hi: {
    navHome: "मुख्य पृष्ठ",
    navAbout: "अधिवक्ता के बारे में",
    navPractice: "कार्य क्षेत्र",
    navExperience: "अनुभव",
    navCases: "मामले",
    navBlog: "ब्लॉग",
    navContact: "संपर्क करें",
    navCallNow: "अभी कॉल करें",
    advocateTitle: "सिकंदर खान",
    courtSubtitle: "सिविल कोर्ट, मकराना",

    heroSubtitle: "26+ वर्षों का उत्कृष्ट कानूनी अनुभव",
    heroTitle1: "आपके अधिकार।",
    heroTitle2: "हमारी प्रतिबद्धता।",
    heroTagline: "1998 से विश्वसनीय कानूनी प्रतिनिधित्व",
    heroDesc: "अधिवक्ता सिकंदर खान मकराना सिविल कोर्ट में पूर्ण ईमानदारी, निष्ठा और मुवक्किल-प्रथम दृष्टिकोण के साथ रणनीतिक कानूनी समाधान प्रदान करते हैं।",
    heroCtaConsult: "परामर्श लें",
    heroCtaPractices: "हमारे कार्य क्षेत्र",
    heroStatYears: "वर्ष",
    heroStatExp: "सफल वकालत के",
    heroStatClients: "1000+",
    heroStatTrust: "मुवक्किलों का भरोसा",

    aboutTitle: "अधिवक्ता के बारे में",
    aboutBadge: "कानूनी विरासत",
    aboutHeading: "26+ वर्षों का सफल अदालती अनुभव",
    aboutDesc1: "अधिवक्ता सिकंदर खान वर्ष 1998 से मकराना के सिविल न्यायालय में कानूनी सत्यनिष्ठा और व्यावसायिक समर्पण के एक मजबूत स्तंभ रहे हैं। जटिल नागरिक मुकदमों (सिविल केस), संपत्ति विवादों और भूमि राजस्व मामलों में विशेषज्ञता के साथ, उनकी वकालत पूर्ण ईमानदारी और मुवक्किल के प्रति पारदर्शिता पर आधारित है।",
    aboutDesc2: "हम जानते हैं कि अदालती मामले तनावपूर्ण हो सकते हैं। इसीलिए हमारा परामर्श केवल अदालत तक सीमित नहीं है; हम आपको न्यायिक प्रक्रिया के हर चरण में आपके अधिकारों की सुरक्षा के लिए रणनीतिक मार्गदर्शन, सटीक समीक्षा और मजबूत पैरवी प्रदान करते हैं।",
    aboutCard1: "26+ वर्ष",
    aboutCard1Sub: "सक्रिय वकालत का अनुभव",
    aboutCard2: "1000+",
    aboutCard2Sub: "संतुष्ट मुवक्किल",
    aboutCard3: "मकराना कोर्ट",
    aboutCard3Sub: "मुख्य कार्यक्षेत्र",
    aboutCard4: "सच्ची सलाह",
    aboutCard4Sub: "कोई झूठे वादे नहीं",

    practiceBadge: "हमारे कार्य क्षेत्र",
    practiceTitle: "विशेषज्ञ कानूनी सेवाएं",
    practiceDesc: "गहन कानूनी शोध और अदालती विशेषज्ञता के साथ कई विधिक क्षेत्रों में व्यापक कानूनी समाधान प्रदान करना।",
    paCivilTitle: "सिविल मामले",
    paCivilDesc: "संपत्ति की वसूली, निषेधाज्ञा (Injunction), घोषणा (Declaration), अनुबंध विवाद और धन वसूली के मामलों में विशेषज्ञ पैरवी।",
    paPropertyTitle: "संपत्ति विवाद",
    paPropertyDesc: "पारिवारिक संपत्ति का बंटवारा, सुखाधिकार (Easement), मालिकाना हक विवाद और पैतृक संपत्ति उत्तराधिकार पर रणनीतिक सलाह।",
    paFamilyTitle: "पारिवारिक कानून",
    paFamilyDesc: "वैवाहिक विवादों, पारिवारिक समझौतों, बच्चों की कस्टडी और उत्तराधिकार प्रमाण पत्र में संवेदनशील व मजबूत पैरवी।",
    paLandTitle: "भूमि मामले",
    paLandDesc: "कृषि भूमि विवाद, राजस्व अपील, दाखिल-खारिज (म्युटेशन), और काश्तकारी अधिकारों का संपूर्ण समाधान.",
    paDocTitle: "दस्तावेजीकरण",
    paDocDesc: "रजिस्ट्री विलेख (Deed), कानूनी नोटिस, बिक्री समझौता (Agreement), वसीयत, मुख्तारनामा (GPA) का प्रारूप तैयार करना।",
    paConsultTitle: "कानूनी परामर्श",
    paConsultDesc: "अदालती कार्यवाही शुरू करने से पहले मामले की गहन समीक्षा, कानूनी जोखिम विश्लेषण और सटीक रणनीतिक सलाह।",

    whyBadge: "अधिवक्ता सिकंदर खान ही क्यों?",
    whyTitle: "सम्मान और दृढ़ता के साथ आपके अधिकारों की रक्षा",
    whyDesc: "हमारी वकालत भरोसे, विधिक कौशल और अपने मुवक्किलों को सर्वश्रेष्ठ परिणाम दिलाने के प्रति पूर्ण समर्पण पर टिकी है।",
    wcAdviceTitle: "पारदर्शी और सच्ची सलाह",
    wcAdviceDesc: "हम बिना किसी झूठे वादे या भ्रामक रास्तों के आपके मामले का वास्तविक विश्लेषण और पारदर्शी सलाह प्रदान करते हैं।",
    wcCourtTitle: "मजबूत अदालती पैरवी",
    wcCourtDesc: "दो दशकों से अधिक के अदालती अनुभव के साथ गहन कानूनी शोध और न्यायाधीश के समक्ष अकाट्य तर्कपूर्ण पैरवी।",
    wcProcessTitle: "त्वरित कानूनी प्रक्रिया",
    wcProcessDesc: "अदालती देरी को कम करने, शीघ्र ड्राफ्टिंग और सक्रिय पैरवी सुनिश्चित करने के लिए हर फाइल पर व्यवस्थित काम।",
    wcConfTitle: "पूर्ण गोपनीयता की गारंटी",
    wcConfDesc: "आपकी गोपनीयता हमारी सर्वोच्च प्राथमिकता है। अधिवक्ता और मुवक्किल के बीच के सभी दस्तावेज और बातचीत पूरी तरह सुरक्षित हैं।",

    statsBadge: "सफल रिकॉर्ड",
    statsTitle: "आंकड़ों में हमारी सफलता",
    statsDesc: "पिछले 26 वर्षों में हमारे समर्पण, निरंतरता और व्यावसायिक उच्च मानकों का एक प्रमाण।",
    statYearsVal: "26+",
    statYearsLbl: "सक्रिय वकालत वर्ष",
    statClientsVal: "1000+",
    statClientsLbl: "संतुष्ट मुवक्किल",
    statCasesVal: "500+",
    statCasesLbl: "सफलतापूर्वक निपटाए गए मामले",
    statSuccessVal: "95%",
    statSuccessLbl: "अदालती सफलता दर",

    processBadge: "कार्यप्रणाली",
    processTitle: "हमारी व्यवस्थित कानूनी प्रक्रिया",
    processDesc: "एक पारदर्शी और व्यवस्थित पांच-चरण का दृष्टिकोण जो हर स्तर पर पूर्ण स्पष्टता और तैयारी की गारंटी देता है।",
    step1Title: "प्रारंभिक परामर्श",
    step1Desc: "हम आपके मामले को ध्यान से सुनते हैं, प्रारंभिक तथ्यों की समीक्षा करते हैं और आपके अंतिम उद्देश्यों को समझते हैं।",
    step2Title: "मामले का मूल्यांकन",
    step2Desc: "दस्तावेजों, भूमि रिकॉर्ड या समझौतों का गहन विश्लेषण ताकि मामले की मजबूती और कमजोरियों को आंका जा सके।",
    step3Title: "रणनीति का निर्माण",
    step3Desc: "एक विशेष रणनीतिक योजना तैयार करना, सही कानूनी उपचार चुनना और मजबूत कानूनी मसौदा तैयार करना।",
    step4Title: "अदालती प्रतिनिधित्व",
    step4Desc: "अदालत में साक्ष्य व्यवस्थित रूप से प्रस्तुत करना और न्यायाधीश के समक्ष अत्यंत पेशेवर तरीके से पैरवी करना।",
    step5Title: "सफल समाधान",
    step5Desc: "सर्वश्रेष्ठ परिणाम प्राप्त करना, अदालत के आदेशों का क्रियान्वयन सुनिश्चित करना और आपके हितों की रक्षा करना।",

    testiBadge: "मुवक्किलों की राय",
    testiTitle: "हमारे सम्मानित मुवक्किलों के अनुभव",
    testiDesc: "न्याय और राहत की सच्ची कहानियां उन परिवारों की जिनका हमने दशकों से प्रतिनिधित्व किया है।",
    client1Name: "रामेश्वर गहलोत",
    client1Case: "संपत्ति विभाजन वाद",
    client1Quote: "अधिवक्ता सिकंदर खान ने हमारी पैतृक संपत्ति के बंटवारे का विवाद सुलझाया जो 12 वर्षों से अटका था। उनकी सच्ची सलाह और राजस्व कानूनों के ज्ञान से हमें न्याय मिला।",
    client2Name: "मोहम्मद युसूफ",
    client2Case: "भूमि राजस्व मामला",
    client2Quote: "मेरी कृषि भूमि के दाखिल-खारिज (नामांतरण) की अपील में उनके रणनीतिक रवैये से मैं बहुत प्रभावित हुआ। उन्होंने हर बात पारदर्शी ढंग से समझाई और हमारा मजबूत बचाव किया।",
    client3Name: "सोहन लाल शर्मा",
    client3Case: "नागरिक वसूली वाद",
    client3Quote: "पेशेवर, सुलभ और अत्यंत नैतिक। उन्होंने रणनीतिक सिविल मुकदमेबाजी के जरिए मेरी मेहनत की व्यावसायिक बकाया राशि वसूल करवाई। मकराना के सबसे विश्वसनीय वकील।",

    faqBadge: "अक्सर पूछे जाने वाले प्रश्न",
    faqTitle: "आपकी कानूनी शंकाओं का समाधान",
    faqDesc: "हमारी कानूनी सेवाओं, परामर्श प्रक्रिया और नागरिक विवादों के निपटारे के बारे में सामान्य प्रश्न।",
    faqQ1: "मैं परामर्श के लिए समय (अपॉइंटमेंट) कैसे तय करूँ?",
    faqA1: "आप सीधे हमारे फोन नंबर पर कॉल करके या नीचे दिए गए 'परामर्श बुक करें' फॉर्म को भरकर अपॉइंटमेंट ले सकते हैं। हम 2 घंटे के भीतर आपके समय की पुष्टि करेंगे।",
    faqQ2: "पहली मुलाकात के दौरान मुझे कौन से दस्तावेज लाने चाहिए?",
    faqA2: "कृपया अपने विवाद से संबंधित सभी दस्तावेज लाएं: संपत्ति की रजिस्ट्री, बिक्री विलेख, समझौते, पुराने अदालती आदेश, जमाबंदी या प्राप्त कोई भी कानूनी नोटिस।",
    faqQ3: "आप मुख्य रूप से किन कानूनी मामलों को संभालते हैं?",
    faqA3: "हमारी मुख्य विशेषज्ञता सिविल कानून में है, जिसमें संपत्ति का बंटवारा, भूमि विवाद, निषेधाज्ञा वाद, पारिवारिक समझौते, डीड ड्राफ्टिंग और मकराना क्षेत्र में राजस्व अपील शामिल हैं।",
    faqQ4: "आपके परामर्श का शुल्क क्या है?",
    faqA4: "परामर्श शुल्क मामले की जटिलता और दस्तावेजों के अध्ययन पर निर्भर करता है। हम पहली बातचीत के दौरान ही स्पष्ट और पारदर्शी चर्चा करते हैं—कोई गुप्त शुल्क नहीं।",
    faqQ5: "भारत में एक सिविल मामले में आमतौर पर कितना समय लगता है?",
    faqA5: "सिविल मामलों की अवधि सबूतों और विपक्षी तर्कों पर निर्भर करती है। हालांकि, हमारी त्वरित ड्राफ्टिंग और सक्रिय अदालती पैरवी के कारण हम जल्द से जल्द समाधान का प्रयास करते हैं।",

    blogBadge: "कानूनी ज्ञान",
    blogTitle: "नवीनतम विधिक जानकारियां एवं लेख",
    blogDesc: "नागरिक अधिकारों, संपत्ति कानूनों और अदालती प्रक्रियाओं के बारे में आम नागरिकों को जागरूक करना।",
    blogReadMore: "पूरा लेख पढ़ें",
    blogCategory1: "भूमि कानून",
    blogDate1: "12 जून, 2026",
    blogH1: "राजस्थान में पैतृक संपत्ति के विभाजन और उत्तराधिकार कानूनों को समझें",
    blogCategory2: "दीवानी प्रक्रिया",
    blogDate2: "28 मई, 2026",
    blogH2: "निषेधाज्ञा वाद (स्टे ऑर्डर) क्या है? अपनी भूमि को अवैध कब्जे से कैसे बचाएं",
    blogCategory3: "दस्तावेजीकरण",
    blogDate3: "10 मई, 2026",
    blogH3: "भूमि खरीद समझौते (एग्रीमेंट) पर हस्ताक्षर करने से पहले ध्यान देने योग्य मुख्य बातें",

    consultBadge: "संपर्क सूत्र",
    consultTitle: "विशेषज्ञ कानूनी परामर्श बुक करें",
    consultDesc: "अपना मामला साझा करने के लिए नीचे दिए गए सुरक्षित फॉर्म को भरें। हमारा कार्यालय जल्द ही आपसे संपर्क करेगा।",
    formName: "पूरा नाम",
    formNamePlh: "अपना पूरा नाम दर्ज करें",
    formPhone: "मोबाइल नंबर",
    formPhonePlh: "अपना 10 अंकों का मोबाइल नंबर दर्ज करें",
    formEmail: "ईमेल आईडी (वैकल्पिक)",
    formEmailPlh: "अपना ईमेल पता दर्ज करें",
    formSubject: "कानूनी विषय / मामले का प्रकार",
    formSubjectPlh: "जैसे: संपत्ति विवाद, पारिवारिक विवाद, दाखिल-खारिज",
    formMsg: "अपने मामले का विवरण दें",
    formMsgPlh: "अपने मामले या कानूनी शंका के बारे में संक्षेप में लिखें...",
    formSubmit: "परामर्श बुक करें",
    contactHours: "कार्यालय का समय",
    contactHoursVal: "सोमवार - शनिवार: सुबह 09:00 बजे से शाम 07:00 बजे तक (रविवार अवकाश)",
    contactAddress: "कार्यालय का पता",
    contactAddressVal: "एडवोकेट चैंबर, सिविल कोर्ट परिसर, मकराना, राजस्थान - 341502",
    contactPhone: "फ़ोन",
    contactEmail: "ईमेल",
    formSuccessMsg: "धन्यवाद! आपका अनुरोध सफलतापूर्वक प्राप्त हो गया है। हम जल्द ही आपसे संपर्क करेंगे।",

    ctaTitle: "आज ही अपने अधिकारों की रक्षा करें",
    ctaDesc: "देरी से आपकी कानूनी स्थिति कमजोर हो सकती है। अभी पेशेवर, ईमानदार और विशेषज्ञ कानूनी सलाह सुरक्षित करें।",
    ctaBtnCall: "अभी अधिवक्ता को कॉल करें",
    ctaBtnBook: "अपॉइंटमेंट बुक करें",

    footerAboutDesc: "1998 से पूर्ण सत्यनिष्ठा और उत्कृष्ट अदालती पैरवी के साथ सर्वोच्च कानूनी सलाह और रणनीतिक प्रतिनिधित्व प्रदान करना।",
    footerQuickLinks: "त्वरित लिंक्स",
    footerPracticeAreas: "कार्य क्षेत्र",
    footerContact: "संपर्क कार्यालय",
    footerCopy: "© 2026 अधिवक्ता सिकंदर खान • सिविल कोर्ट, मकराना • सर्वाधिकार सुरक्षित",
    footerPrivacy: "गोपनीयता नीति",
    footerTerms: "नियम और शर्तें",
    backToTop: "शीर्ष पर जाएं",
  },
};
