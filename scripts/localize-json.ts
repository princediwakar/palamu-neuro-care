/**
 * Script to fill Hindi (hi) values in all SEO page JSON data files.
 * Each JSON file has the { en, hi } structure with hi values empty.
 * This script fills hi values using a comprehensive dictionary of translations.
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(__dirname, "../lib/seo-pages/data");

// Comprehensive English → Hindi (Hinglish/Devanagari) dictionary
const dict: Record<string, string> = {
  // === Cities & Locations ===
  "Palamu": "पलामू",
  "Jamshedpur": "जमशेदपुर",
  "Dhanbad": "धनबाद",
  "Bokaro": "बोकारो",
  "Patna": "पटना",
  "Gaya": "गया",
  "Hazaribagh": "हज़ारीबाग़",
  "Ramgarh": "रामगढ़",
  "Gumla": "गुमला",
  "Simdega": "सिमडेगा",
  "Lohardaga": "लोहरदग्गा",
  "Khunti": "खूंटी",
  "Latehar": "लातेहार",
  "Seraikela": "सरायकेला",
  "Chaibasa": "चाईबासा",
  "Chatra": "चतरा",
  "Koderma": "कोडरमा",
  "Jharia": "झरिया",
  "Sindri": "सिंदरी",
  "Chas": "चास",
  "Giridih": "गिरिडीह",
  "Bariatu": "बरियातू",
  "Morabadi": "मोरहाबादी",
  "Kanke": "कांके",
  "Lalpur": "लालपुर",
  "Doranda": "डोरंडा",
  "Mesra": "मेसरा",
  "Hinoo": "हिनू",
  "Dhurwa": "धुर्वा",
  "Harmu": "हरमू",
  "Argora": "अरगोड़ा",
  "Ashok Nagar": "अशोक नगर",
  "Ratu": "रातू",
  "Namkum": "नामकुम",
  "Hatia": "हटिया",
  "Neori": "नेओरी",
  "Upper Bazar": "अपर बाज़ार",
  "Bokaro Steel City": "बोकारो स्टील सिटी",
  "Adityapur": "आदित्यपुर",
  "Gamharia": "गम्हरिया",
  "Ghatshila": "घाटशिला",
  "Chandrapura": "चंद्रपुरा",
  "Gomia": "गोमिया",
  "Tenughat": "तेनुघाट",
  "Phusro": "फुसरो",
  "Mango": "मानगो",
  "Muzaffarpur": "मुज़फ़्फ़रपुर",
  "Bhagalpur": "भागलपुर",
  "Purnia": "पूर्णिया",
  "Darbhanga": "दरभंगा",
  "Hajipur": "हाजीपुर",
  "Katras": "कतरास",

  // === Medical Specialties & Roles ===
  "Neurologist": "न्यूरोलॉजिस्ट",
  "neurologist": "न्यूरोलॉजिस्ट",
  "Ophthalmologist": "ऑफ़्थैल्मोलॉजिस्ट",
  "ophthalmologist": "ऑफ़्थैल्मोलॉजिस्ट",
  "Neurosurgeon": "न्यूरोसर्जन",
  "Retina Specialist": "रेटिना स्पेशलिस्ट",
  "retina specialist": "रेटिना स्पेशलिस्ट",
  "Retina & Vitreous Surgeon": "रेटिना और विट्रियस सर्जन",
  "Retina Surgeon": "रेटिना सर्जन",
  "Retina & Vitreous Specialist": "रेटिना और विट्रियस स्पेशलिस्ट",
  "Retina Fellow": "रेटिना फ़ेलो",
  "Fellowship-trained Retina Specialist": "फ़ेलोशिप-ट्रेंड रेटिना स्पेशलिस्ट",
  "Neurology": "न्यूरोलॉजी",
  "Ophthalmology": "ऑफ़्थैल्मोलॉजी",

  // === Conditions & Diseases ===
  "Migraine": "माइग्रेन",
  "Epilepsy": "मिर्गी",
  "Stroke": "स्ट्रोक",
  "Parkinson's Disease": "पार्किंसंस डिज़ीज़",
  "parkinson's disease": "पार्किंसंस डिज़ीज़",
  "Cataract": "मोतियाबिंद",
  "cataract": "मोतियाबिंद",
  "Glaucoma": "ग्लूकोमा",
  "Diabetic Retinopathy": "डायबिटिक रेटिनोपैथी",
  "Retinal Detachment": "रेटिनल डिटैचमेंट",
  "Macular Degeneration": "मैक्युलर डिजनरेशन",
  "Age-Related Macular Degeneration": "एज-रिलेटेड मैक्युलर डिजनरेशन",
  "Neuropathy": "न्यूरोपैथी",
  "Peripheral Neuropathy": "पेरिफेरल न्यूरोपैथी",
  "Carpal Tunnel Syndrome": "कार्पल टनल सिंड्रोम",
  "Carpal tunnel syndrome": "कार्पल टनल सिंड्रोम",
  "Macular Hole": "मैक्युलर होल",
  "macular hole": "मैक्युलर होल",
  "Trigeminal Neuralgia": "ट्राइजेमिनल न्यूराल्जिया",
  "Essential Tremor": "एसेंशियल ट्रेमर",
  "Myasthenia Gravis": "मायस्थीनिया ग्रेविस",
  "Multiple Sclerosis": "मल्टीपल स्क्लेरोसिस",
  "Dementia": "डिमेंशिया",
  "Alzheimer's": "अल्ज़ाइमर्स",
  "Vertigo": "वर्टिगो",
  "Bell's Palsy": "बेल्स पाल्सी",
  "Spine Disorders": "स्पाइन डिसऑर्डर्स",
  "Endophthalmitis": "एंडोफ़्थालमाइटिस",
  "Dry Eye Syndrome": "ड्राई आई सिंड्रोम",
  "Refractive Error": "रिफ्रैक्टिव एरर",
  "Conjunctivitis": "कंजंक्टिवाइटिस",
  "Keratoconus": "केराटोकोनस",
  "Sleep Disorders": "स्लीप डिसऑर्डर्स",
  "Ocular Tumors": "ऑक्युलर ट्यूमर्स",
  "Corneal Ulcer": "कॉर्नियल अल्सर",
  "Squint": "भेंगापन",
  "Strabismus": "स्ट्रैबिस्मस",
  "Uveitis": "यूवाइटिस",

  // === Treatment-related ===
  "Treatment": "इलाज",
  "treatment": "इलाज",
  "Surgery": "सर्जरी",
  "surgery": "सर्जरी",
  "Diagnosis": "डायग्नोसिस",
  "diagnosis": "डायग्नोसिस",
  "Management": "मैनेजमेंट",
  "management": "मैनेजमेंट",
  "Care": "केयर",
  "care": "केयर",
  "Consultation": "कंसल्टेशन",
  "consultation": "कंसल्टेशन",
  "Specialist": "स्पेशलिस्ट",
  "specialist": "स्पेशलिस्ट",
  "Doctor": "डॉक्टर",
  "doctor": "डॉक्टर",
  "Expert": "एक्सपर्ट",
  "expert": "एक्सपर्ट",
  "Best": "बेस्ट",
  "best": "बेस्ट",
  "Clinic": "क्लिनिक",
  "clinic": "क्लिनिक",
  "Hospital": "हॉस्पिटल",
  "hospital": "हॉस्पिटल",
  "Rehabilitation": "रिहैबिलिटेशन",
  "rehabilitation": "रिहैबिलिटेशन",
  "Therapy": "थेरेपी",
  "therapy": "थेरेपी",
  "Medicine": "मेडिसिन",
  "medicine": "दवाई",
  "Medication": "मेडिकेशन",
  "medication": "दवाई",
  "Test": "टेस्ट",
  "test": "टेस्ट",
  "Scan": "स्कैन",
  "scan": "स्कैन",
  "Examination": "एग्ज़ामिनेशन",
  "examination": "एग्ज़ामिनेशन",
  "Evaluation": "इवैल्यूएशन",
  "evaluation": "इवैल्यूएशन",
  "Headache": "सिरदर्द",
  "headache": "सिरदर्द",
  "Pain": "दर्द",
  "pain": "दर्द",
  "Seizure": "दौरा",
  "seizure": "दौरा",
  "Tremor": "ट्रेमर",
  "tremor": "कंपन",
  "Paralysis": "पैरालिसिस",
  "paralysis": "लकवा",
  "Weakness": "कमज़ोरी",
  "weakness": "कमज़ोरी",
  "Dizziness": "चक्कर",
  "dizziness": "चक्कर",
  "Numbness": "सुन्नपन",
  "numbness": "सुन्नपन",
  "Vision": "विज़न",
  "Nerve": "नर्व",
  "Brain": "ब्रेन",
  "Spine": "स्पाइन",
  "Eye": "आंख",
  "Retina": "रेटिना",

  // === Common Medical Terms ===
  "MRI Scan": "एमआरआई स्कैन",
  "MRI": "एमआरआई",
  "CT Scan": "सीटी स्कैन",
  "CT": "सीटी",
  "EEG": "ईईजी",
  "OCT Scan": "OCT स्कैन",
  "OCT": "OCT",
  "OCTA": "OCTA",
  "Fundus Photography": "फंडस फोटोग्राफी",
  "ECG": "ईसीजी",
  "X-Ray": "एक्स-रे",
  "Nerve Conduction Study": "नर्व कंडक्शन स्टडी",
  "Nerve Conduction Studies": "नर्व कंडक्शन स्टडीज़",
  "Blood Test": "ब्लड टेस्ट",
  "Visual Field Testing": "विज़ुअल फ़ील्ड टेस्टिंग",

  // === Departments ===
  "neurology": "न्यूरोलॉजी",
  "ophthalmology": "ऑफ़्थैल्मोलॉजी",

  // === Common Phrases ===
  "in Palamu": "पलामू में",
  "in Jharkhand": "झारखंड में",
  "near Palamu": "पलामू के पास",
  "at Palamu Neuro & Eye Care": "पलामू न्यूरो एंड आई केयर क्लिनिक में",
  "Palamu Neuro & Eye Care": "पलामू न्यूरो एंड आई केयर",

  // === State/City Labels ===
  "Jharkhand": "झारखंड",
  "Bihar": "बिहार",
  "West Bengal": "पश्चिम बंगाल",
  "Odisha": "ओडिशा",
  "Chhattisgarh": "छत्तीसगढ़",
  "India": "इंडिया",

  // === Common Service Words ===
  "Dr.": "डॉ.",
  "Gold Medalist": "गोल्ड मेडलिस्ट",
  "DM Neurology": "DM न्यूरोलॉजी",
  "MS Ophthalmology": "MS ऑफ़्थैल्मोलॉजी",
  "AIIMS": "AIIMS",
  "RIMS": "RIMS",
  "FICO": "FICO",
  "LV Prasad Eye Institute": "LV Prasad आई इंस्टीट्यूट",
  "Hyderabad": "हैदराबाद",
  "Bhubaneswar": "भुवनेश्वर",
};

// Function to check if a string is a user-facing text (not a slug, enum, etc.)
function isLocalizedValue(val: unknown): val is { en: string; hi: string } {
  return (
    typeof val === "object" &&
    val !== null &&
    "en" in val &&
    "hi" in val &&
    typeof (val as any).en === "string" &&
    typeof (val as any).hi === "string"
  );
}

function isLocalizedStringArray(val: unknown): val is { en: string[]; hi: string[] } {
  return (
    typeof val === "object" &&
    val !== null &&
    "en" in val &&
    "hi" in val &&
    Array.isArray((val as any).en) &&
    Array.isArray((val as any).hi)
  );
}

// Translate an English string to Hindi (Hinglish) using dictionary + fallback
function translateString(en: string): string {
  // If it's a known term, use the dictionary
  if (dict[en]) return dict[en];

  // Try common patterns
  let result = en
    // Replace common medical terms
    .replace(/Treatment/g, "इलाज")
    .replace(/treatment/g, "इलाज")
    .replace(/Surgery/g, "सर्जरी")
    .replace(/surgery/g, "सर्जरी")
    .replace(/Specialist/g, "स्पेशलिस्ट")
    .replace(/specialist/g, "स्पेशलिस्ट")
    .replace(/Doctor/g, "डॉक्टर")
    .replace(/doctor/g, "डॉक्टर")
    .replace(/Neurologist/g, "न्यूरोलॉजिस्ट")
    .replace(/neurologist/g, "न्यूरोलॉजिस्ट")
    .replace(/Ophthalmologist/g, "ऑफ़्थैल्मोलॉजिस्ट")
    .replace(/ophthalmologist/g, "ऑफ़्थैल्मोलॉजिस्ट")
    .replace(/Clinic/g, "क्लिनिक")
    .replace(/clinic/g, "क्लिनिक")
    .replace(/Hospital/g, "हॉस्पिटल")
    .replace(/hospital/g, "हॉस्पिटल")
    .replace(/Palamu/g, "पलामू")
    .replace(/Jharkhand/g, "झारखंड")
    .replace(/Care/g, "केयर")
    .replace(/care/g, "केयर")
    .replace(/Diagnosis/g, "डायग्नोसिस")
    .replace(/diagnosis/g, "डायग्नोसिस")
    .replace(/Management/g, "मैनेजमेंट")
    .replace(/management/g, "मैनेजमेंट")
    .replace(/Therapy/g, "थेरेपी")
    .replace(/therapy/g, "थेरेपी")
    .replace(/Rehabilitation/g, "रिहैबिलिटेशन")
    .replace(/rehabilitation/g, "रिहैबिलिटेशन")
    .replace(/Pain/g, "दर्द")
    .replace(/pain/g, "दर्द")
    .replace(/Headache/g, "सिरदर्द")
    .replace(/headache/g, "सिरदर्द")
    .replace(/Migraine/g, "माइग्रेन")
    .replace(/migraine/g, "माइग्रेन")
    .replace(/Epilepsy/g, "मिर्गी")
    .replace(/epilepsy/g, "मिर्गी")
    .replace(/Stroke/g, "स्ट्रोक")
    .replace(/stroke/g, "स्ट्रोक")
    .replace(/Dementia/g, "डिमेंशिया")
    .replace(/dementia/g, "डिमेंशिया")
    .replace(/Neuropathy/g, "न्यूरोपैथी")
    .replace(/neuropathy/g, "न्यूरोपैथी")
    .replace(/Evaluation/g, "इवैल्यूएशन")
    .replace(/evaluation/g, "इवैल्यूएशन")
    .replace(/Consultation/g, "कंसल्टेशन")
    .replace(/consultation/g, "कंसल्टेशन")
    .replace(/Examination/g, "एग्ज़ामिनेशन")
    .replace(/examination/g, "एग्ज़ामिनेशन")
    .replace(/Best/g, "बेस्ट")
    .replace(/best/g, "बेस्ट")
    .replace(/Expert/g, "एक्सपर्ट")
    .replace(/expert/g, "एक्सपर्ट")
    .replace(/Advanced/g, "एडवांस्ड")
    .replace(/advanced/g, "एडवांस्ड")
    .replace(/Comprehensive/g, "कम्प्रीहेंसिव")
    .replace(/comprehensive/g, "कम्प्रीहेंसिव")
    .replace(/Trusted/g, "ट्रस्टेड")
    .replace(/trusted/g, "ट्रस्टेड")
    .replace(/Center/g, "सेंटर")
    .replace(/center/g, "सेंटर")
    .replace(/Centre/g, "सेंटर")
    .replace(/centre/g, "सेंटर")
    .replace(/Vision/g, "विज़न")
    .replace(/vision/g, "विज़न")
    .replace(/Nerve/g, "नर्व")
    .replace(/nerve/g, "नर्व")
    .replace(/Brain/g, "ब्रेन")
    .replace(/brain/g, "ब्रेन")
    .replace(/Spine/g, "स्पाइन")
    .replace(/spine/g, "स्पाइन")
    .replace(/Retina/g, "रेटिना")
    .replace(/retina/g, "रेटिना")
    .replace(/Eye/g, "आई")
    .replace(/Cataract/g, "मोतियाबिंद")
    .replace(/cataract/g, "मोतियाबिंद")
    .replace(/Glaucoma/g, "ग्लूकोमा")
    .replace(/glaucoma/g, "ग्लूकोमा")
    .replace(/Squint/g, "भेंगापन")
    .replace(/squint/g, "भेंगापन")
    .replace(/Corneal/g, "कॉर्नियल")
    .replace(/corneal/g, "कॉर्नियल")
    .replace(/Uveitis/g, "यूवाइटिस")
    .replace(/uveitis/g, "यूवाइटिस")
    .replace(/Tumor/g, "ट्यूमर")
    .replace(/tumor/g, "ट्यूमर")
    .replace(/Cancer/g, "कैंसर")
    .replace(/cancer/g, "कैंसर")
    .replace(/Oncology/g, "ऑन्कोलॉजी")
    .replace(/oncology/g, "ऑन्कोलॉजी")
    .replace(/Infection/g, "इन्फेक्शन")
    .replace(/infection/g, "इन्फेक्शन")
    .replace(/Inflammation/g, "इन्फ्लेमेशन")
    .replace(/inflammation/g, "इन्फ्लेमेशन")
    .replace(/Test/g, "टेस्ट")
    .replace(/Scan/g, "स्कैन")
    .replace(/Study/g, "स्टडी")
    .replace(/Sleep/g, "स्लीप")
    .replace(/Disorder/g, "डिसऑर्डर")
    .replace(/disorder/g, "डिसऑर्डर")
    .replace(/Disease/g, "डिज़ीज़")
    .replace(/disease/g, "डिज़ीज़")
    .replace(/Movement/g, "मूवमेंट")
    .replace(/movement/g, "मूवमेंट")
    .replace(/Emergency/g, "इमरजेंसी")
    .replace(/emergency/g, "इमरजेंसी")
    .replace(/Urgent/g, "अर्जेंट")
    .replace(/urgent/g, "अर्जेंट")
    .replace(/Facial/g, "फ़ेशियल")
    .replace(/facial/g, "फ़ेशियल")
    .replace(/Neck/g, "गर्दन")
    .replace(/neck/g, "गर्दन")
    .replace(/Back/g, "बैक")
    .replace(/back/g, "बैक")
    .replace(/Hand/g, "हाथ")
    .replace(/hand/g, "हाथ")
    .replace(/Leg/g, "पैर")
    .replace(/foot/g, "पैर")
    .replace(/Feet/g, "पैर")
    .replace(/Wrist/g, "कलाई")
    .replace(/wrist/g, "कलाई")
    .replace(/Shoulder/g, "कंधा")
    .replace(/shoulder/g, "कंधा")
    .replace(/Remember/g, "याद रखें")
    .replace(/FAST:/g, "FAST:")
    .replace(/Patient/g, "पेशेंट")
    .replace(/patient/g, "पेशेंट")
    .replace(/Pediatric/g, "पीडियाट्रिक")
    .replace(/pediatric/g, "पीडियाट्रिक")
    .replace(/Child/g, "बच्चा")
    .replace(/child/g, "बच्चा")
    .replace(/Adult/g, "एडल्ट")
    .replace(/adult/g, "एडल्ट")
    .replace(/Women/g, "महिलाएं")
    .replace(/Men/g, "पुरुष")
    .replace(/Pregnancy/g, "प्रेगनेंसी")
    .replace(/Pregnant/g, "प्रेग्नेंट")
    .replace(/Diabetes/g, "डायबिटीज़")
    .replace(/diabetes/g, "डायबिटीज़")
    .replace(/Diabetic/g, "डायबिटिक")
    .replace(/diabetic/g, "डायबिटिक")
    .replace(/Blood pressure/g, "ब्लड प्रेशर")
    .replace(/Blood Pressure/g, "ब्लड प्रेशर")
    .replace(/Hypertension/g, "हाइपरटेंशन")
    .replace(/hypertension/g, "हाइपरटेंशन")
    .replace(/Cholesterol/g, "कोलेस्ट्रॉल")
    .replace(/cholesterol/g, "कोलेस्ट्रॉल")
    .replace(/Heart/g, "हार्ट")
    .replace(/heart/g, "हार्ट")
    .replace(/Smoking/g, "स्मोकिंग")
    .replace(/smoking/g, "स्मोकिंग")
    .replace(/Alcohol/g, "एल्कोहॉल")
    .replace(/alcohol/g, "एल्कोहॉल")
    .replace(/Obesity/g, "मोटापा")
    .replace(/obesity/g, "मोटापा")
    .replace(/Exercise/g, "एक्सरसाइज़")
    .replace(/exercise/g, "एक्सरसाइज़")
    .replace(/Diet/g, "डाइट")
    .replace(/diet/g, "डाइट")
    .replace(/Lifestyle/g, "लाइफ़स्टाइल")
    .replace(/lifestyle/g, "लाइफ़स्टाइल")
    .replace(/Stress/g, "स्ट्रेस")
    .replace(/stress/g, "स्ट्रेस")
    .replace(/Anxiety/g, "एंग्ज़ाइटी")
    .replace(/anxiety/g, "एंग्ज़ाइटी")
    .replace(/Depression/g, "डिप्रेशन")
    .replace(/depression/g, "डिप्रेशन")
    .replace(/Fatigue/g, "थकान")
    .replace(/fatigue/g, "थकान")
    .replace(/Nausea/g, "मतली")
    .replace(/nause/g, "मतली")
    .replace(/Vomiting/g, "उल्टी")
    .replace(/vomiting/g, "उल्टी")
    .replace(/Fever/g, "बुखार")
    .replace(/fever/g, "बुखार")
    .replace(/Cough/g, "खांसी")
    .replace(/cough/g, "खांसी")
    .replace(/Breathing/g, "सांस")
    .replace(/breathing/g, "सांस")
    .replace(/Speech/g, "बोल")
    .replace(/speech/g, "बोल")
    .replace(/Memory/g, "याददाश्त")
    .replace(/memory/g, "याददाश्त")
    .replace(/Balance/g, "बैलेंस")
    .replace(/balance/g, "बैलेंस")
    .replace(/Walking/g, "चलना")
    .replace(/walking/g, "चलना")
    .replace(/Fall/g, "गिरना")
    .replace(/fall/g, "गिरना")
    .replace(/Injury/g, "चोट")
    .replace(/injury/g, "चोट")
    .replace(/Trauma/g, "ट्रॉमा")
    .replace(/trauma/g, "ट्रॉमा")
    .replace(/Accident/g, "एक्सीडेंट")
    .replace(/accident/g, "एक्सीडेंट")
    .replace(/Genetic/g, "जेनेटिक")
    .replace(/genetic/g, "जेनेटिक")
    .replace(/Hereditary/g, "अनुवांशिक")
    .replace(/hereditary/g, "अनुवांशिक")
    .replace(/Immune/g, "इम्यून")
    .replace(/immune/g, "इम्यून")
    .replace(/Autoimmune/g, "ऑटोइम्यून")
    .replace(/autoimmune/g, "ऑटोइम्यून")
    .replace(/Viral/g, "वायरल")
    .replace(/viral/g, "वायरल")
    .replace(/Bacterial/g, "बैक्टीरियल")
    .replace(/bacterial/g, "बैक्टीरियल")
    .replace(/Fungal/g, "फंगल")
    .replace(/fungal/g, "फंगल")
    .replace(/Chronic/g, "क्रॉनिक")
    .replace(/chronic/g, "क्रॉनिक")
    .replace(/Acute/g, "एक्यूट")
    .replace(/acute/g, "एक्यूट")
    .replace(/Severe/g, "सीवियर")
    .replace(/severe/g, "सीवियर")
    .replace(/Moderate/g, "मॉडरेट")
    .replace(/Mild/g, "माइल्ड")
    .replace(/Normal/g, "नॉर्मल")
    .replace(/Abnormal/g, "एब्नॉर्मल")
    .replace(/Risk/g, "रिस्क")
    .replace(/risk/g, "रिस्क")
    .replace(/Factor/g, "फ़ैक्टर")
    .replace(/factor/g, "फ़ैक्टर")
    .replace(/Prevention/g, "प्रिवेंशन")
    .replace(/prevention/g, "प्रिवेंशन")
    .replace(/Recovery/g, "रिकवरी")
    .replace(/recovery/g, "रिकवरी")
    .replace(/Essential/g, "एसेंशियल")
    .replace(/Important/g, "ज़रूरी")
    .replace(/Critical/g, "क्रिटिकल")
    .replace(/Sensitive/g, "सेंसिटिव")
    .replace(/sensitive/g, "सेंसिटिव")
    .replace(/Sensitivity/g, "सेंसिटिविटी")
    .replace(/sensitivity/g, "सेंसिटिविटी")
    .replace(/Difficulty/g, "दिक्कत")
    .replace(/difficulty/g, "दिक्कत")
    .replace(/Problem/g, "प्रॉब्लम")
    .replace(/problem/g, "प्रॉब्लम")
    .replace(/Symptoms/g, "लक्षण")
    .replace(/symptoms/g, "लक्षण")
    .replace(/Signs/g, "संकेत")
    .replace(/signs/g, "संकेत")
    .replace(/Warning/g, "चेतावनी")
    .replace(/warning/g, "चेतावनी")
    .replace(/Complications/g, "कॉम्प्लिकेशंस")
    .replace(/complication/g, "कॉम्प्लिकेशन")
    .replace(/Side effects/g, "साइड इफ़ेक्ट्स")
    .replace(/Side Effects/g, "साइड इफ़ेक्ट्स")
    .replace(/side effect/g, "साइड इफ़ेक्ट")
    .replace(/Prognosis/g, "प्रोग्नोसिस")
    .replace(/Outcome/g, "आउटकम")
    .replace(/Quality of life/g, "क्वालिटी ऑफ़ लाइफ़")
    .replace(/Quality of Life/g, "क्वालिटी ऑफ़ लाइफ़")
    .replace(/Appointment/g, "अपॉइंटमेंट")
    .replace(/appointment/g, "अपॉइंटमेंट")
    .replace(/Follow-up/g, "फ़ॉलो-अप")
    .replace(/Visit/g, "विज़िट")
    .replace(/Checkup/g, "चेकअप")
    .replace(/Regular/g, "रेगुलर")
    .replace(/Annual/g, "एनुअल")
    .replace(/Monthly/g, "मंथली")
    .replace(/Weekly/g, "वीकली")
    .replace(/Daily/g, "डेली")
    .replace(/Hourly/g, "घंटे के हिसाब से")
    .replace(/Immediately/g, "तुरंत")
    .replace(/immediately/g, "तुरंत")
    .replace(/Early/g, "जल्दी")
    .replace(/earlier/g, "जल्दी")
    .replace(/Late/g, "देर")
    .replace(/Quickly/g, "जल्दी से")
    .replace(/Slow/g, "धीमा")
    .replace(/Fast/g, "तेज़")
    .replace(/Good/g, "अच्छा")
    .replace(/Better/g, "बेहतर")
    .replace(/Poor/g, "खराब")
    .replace(/High/g, "हाई")
    .replace(/Low/g, "लो")
    .replace(/Large/g, "बड़ा")
    .replace(/Small/g, "छोटा")
    .replace(/New/g, "नया")
    .replace(/Old/g, "पुराना")
    .replace(/Young/g, "युवा")
    .replace(/First/g, "पहला")
    .replace(/Second/g, "दूसरा")
    .replace(/Third/g, "तीसरा")
    .replace(/Common/g, "आम")
    .replace(/common/g, "आम")
    .replace(/Rare/g, "रेयर")
    .replace(/rare/g, "रेयर")
    .replace(/Major/g, "मेजर")
    .replace(/Minor/g, "माइनर")
    .replace(/Home/g, "घर")
    .replace(/Work/g, "काम")
    .replace(/School/g, "स्कूल")
    .replace(/Driving/g, "ड्राइविंग")
    .replace(/Reading/g, "पढ़ना")
    .replace(/Writing/g, "लिखना")
    .replace(/Eating/g, "खाना")
    .replace(/Sleeping/g, "सोना")
    .replace(/at night/g, "रात में")
    .replace(/in the morning/g, "सुबह में")
    .replace(/in the evening/g, "शाम में")
    .replace(/during the day/g, "दिन में")
    .replace(/for patients/g, "पेशेंट्स के लिए")
    .replace(/for patient/g, "पेशेंट के लिए")
    .replace(/Monday to Saturday/g, "सोमवार से शनिवार")
    .replace(/Mon–Sat/g, "सोम-शनि")
    .replace(/9 AM to 8 PM/g, "सुबह 9 से रात 8 बजे")
    .replace(/9 AM – 8 PM/g, "सुबह 9 – रात 8 बजे")
    .replace(/Call/g, "कॉल करें")
    .replace(/WhatsApp/g, "WhatsApp")
    .replace(/Book/g, "बुक करें")
    .replace(/Schedule/g, "शेड्यूल करें")
    .replace(/Contact/g, "संपर्क")
    .replace(/Address/g, "पता")
    .replace(/Phone/g, "फ़ोन")
    .replace(/Email/g, "ईमेल")
    .replace(/Website/g, "वेबसाइट")
    .replace(/Online/g, "ऑनलाइन")
    .replace(/Offline/g, "ऑफ़लाइन")
    .replace(/Available/g, "उपलब्ध")
    .replace(/available/g, "उपलब्ध")
    .replace(/Not available/g, "उपलब्ध नहीं")
    .replace(/Required/g, "ज़रूरी")
    .replace(/Recommended/g, "सिफ़ारिश")
    .replace(/recommended/g, "रिकमेंडेड")
    .replace(/Optional/g, "वैकल्पिक")
    .replace(/Minimum/g, "मिनिमम")
    .replace(/Maximum/g, "मैक्सिमम")
    .replace(/Average/g, "औसत")
    .replace(/Approximately/g, "लगभग")
    .replace(/approximately/g, "लगभग")
    .replace(/~130 km/g, "~130 किमी")
    .replace(/~160 km/g, "~160 किमी")
    .replace(/~110 km/g, "~110 किमी")
    .replace(/~330 km/g, "~330 किमी")
    .replace(/~90 km/g, "~90 किमी")
    .replace(/Located in Palamu/g, "पलामू में स्थित")
    .replace(/years/g, "साल")
    .replace(/months/g, "महीने")
    .replace(/weeks/g, "हफ़्ते")
    .replace(/days/g, "दिन")
    .replace(/hours/g, "घंटे")
    .replace(/minutes/g, "मिनट")
    .replace(/seconds/g, "सेकंड")
    .replace(/percent/g, "प्रतिशत")
    .replace(/percentage/g, "प्रतिशत")
    .replace(/ratio/g, "अनुपात")
    .replace(/number/g, "संख्या")
    .replace(/amount/g, "मात्रा")
    .replace(/level/g, "लेवल")
    .replace(/dose/g, "डोज़")
    .replace(/dosage/g, "डोज़ेज")
    .replace(/frequency/g, "फ़्रीक्वेंसी")
    .replace(/duration/g, "अवधि")
    .replace(/intensity/g, "इंटेंसिटी")
    .replace(/severity/g, "गंभीरता")
    .replace(/quality/g, "क्वालिटी")
    .replace(/function/g, "फंक्शन")
    .replace(/structure/g, "स्ट्रक्चर")
    .replace(/tissue/g, "टिश्यू")
    .replace(/cell/g, "सेल")
    .replace(/cells/g, "सेल्स")
    .replace(/blood/g, "ब्लड")
    .replace(/fluid/g, "फ़्लूइड")
    .replace(/swelling/g, "सूजन")
    .replace(/edema/g, "एडिमा")
    .replace(/oedema/g, "एडिमा")
    .replace(/redness/g, "लालिमा")
    .replace(/rash/g, "रैश")
    .replace(/discharge/g, "डिस्चार्ज")
    .replace(/bleeding/g, "ब्लीडिंग")
    .replace(/hemorrhage/g, "हेमरेज")
    .replace(/haemorrhage/g, "हेमरेज")
    .replace(/clot/g, "क्लॉट")
    .replace(/clots/g, "क्लॉट्स")
    .replace(/artery/g, "आर्टरी")
    .replace(/vein/g, "वेन")
    .replace(/vessel/g, "वेसल")
    .replace(/vessels/g, "वेसल्स")
    .replace(/bone/g, "हड्डी")
    .replace(/bones/g, "हड्डियां")
    .replace(/joint/g, "जॉइंट")
    .replace(/joints/g, "जॉइंट्स")
    .replace(/muscle/g, "मसल")
    .replace(/muscles/g, "मसल्स")
    .replace(/ligament/g, "लिगामेंट")
    .replace(/tendon/g, "टेंडन")
    .replace(/disc/g, "डिस्क")
    .replace(/discs/g, "डिस्क्स")
    .replace(/spinal cord/g, "स्पाइनल कॉर्ड")
    .replace(/Spinal Cord/g, "स्पाइनल कॉर्ड")
    .replace(/brainstem/g, "ब्रेनस्टेम")
    .replace(/cerebellum/g, "सेरेबेलम")
    .replace(/cortex/g, "कॉर्टेक्स")
    .replace(/hippocampus/g, "हिप्पोकैम्पस")
    .replace(/thalamus/g, "थैलेमस")
    .replace(/basal ganglia/g, "बेसल गैंग्लिया")
    .replace(/hypothalamus/g, "हाइपोथैलेमस")
    .replace(/cornea/g, "कॉर्निया")
    .replace(/iris/g, "आइरिस")
    .replace(/pupil/g, "प्यूपिल")
    .replace(/lens/g, "लेंस")
    .replace(/retina/g, "रेटिना")
    .replace(/macula/g, "मैक्युला")
    .replace(/optic nerve/g, "ऑप्टिक नर्व")
    .replace(/Optic Nerve/g, "ऑप्टिक नर्व")
    .replace(/vitreous/g, "विट्रियस")
    .replace(/sclera/g, "स्क्लेरा")
    .replace(/conjunctiva/g, "कंजंक्टाइवा")
    .replace(/eyelid/g, "पलक")
    .replace(/eyelids/g, "पलकें")
    .replace(/eyeball/g, "आईबॉल")
    .replace(/orbit/g, "ऑर्बिट")
    .replace(/Forehead/g, "माथा")
    .replace(/forehead/g, "माथा")
    .replace(/Face/g, "चेहरा")
    .replace(/face/g, "चेहरा")
    .replace(/Eye exam/g, "आई एग्ज़ाम")
    .replace(/Eye examination/g, "आई एग्ज़ामिनेशन")
    .replace(/Eye test/g, "आई टेस्ट")
    .replace(/Check/g, "चेक")
    .replace(/Report/g, "रिपोर्ट")
    .replace(/Result/g, "रिज़ल्ट")
    .replace(/results/g, "रिज़ल्ट्स")
    .replace(/Confirm/g, "कन्फ़र्म")
    .replace(/Diagnose/g, "डायग्नोज़")
    .replace(/diagnose/g, "डायग्नोज़")
    .replace(/Diagnosed/g, "डायग्नोज़्ड")
    .replace(/diagnosed/g, "डायग्नोज़्ड")
    .replace(/Treat/g, "इलाज करना")
    .replace(/treated/g, "इलाज किया")
    .replace(/Manage/g, "मैनेज करना")
    .replace(/managed/g, "मैनेज्ड")
    .replace(/Monitor/g, "मॉनिटर")
    .replace(/Monitoring/g, "मॉनिटरिंग")
    .replace(/Screen/g, "स्क्रीन")
    .replace(/Screening/g, "स्क्रीनिंग")
    .replace(/Detect/g, "डिटेक्ट")
    .replace(/Detection/g, "डिटेक्शन")
    .replace(/Prevent/g, "प्रिवेंट")
    .replace(/Preventive/g, "प्रिवेंटिव")
    .replace(/preventive/g, "प्रिवेंटिव")
    .replace(/Protect/g, "प्रोटेक्ट")
    .replace(/Protection/g, "प्रोटेक्शन")
    .replace(/Improve/g, "इम्प्रूव")
    .replace(/Improvement/g, "इम्प्रूवमेंट")
    .replace(/Reduce/g, "कम करना")
    .replace(/Reduction/g, "कमी")
    .replace(/Increase/g, "बढ़ाना")
    .replace(/Decrease/g, "घटाना")
    .replace(/Control/g, "कंट्रोल")
    .replace(/controlled/g, "कंट्रोल्ड")
    .replace(/Stabilize/g, "स्टेबलाइज़")
    .replace(/Maintain/g, "मेंटेन")
    .replace(/Maintenance/g, "मेंटेनेंस")
    .replace(/Restore/g, "रीस्टोर")
    .replace(/Restoration/g, "रीस्टोरेशन")
    .replace(/Preserve/g, "प्रिज़र्व")
    .replace(/Preservation/g, "प्रिज़र्वेशन")
    .replace(/Save/g, "बचाना")
    .replace(/Relieve/g, "रिलीफ़")
    .replace(/Relief/g, "रिलीफ़")
    .replace(/relief/g, "रिलीफ़")
    .replace(/Support/g, "सपोर्ट")
    .replace(/support/g, "सपोर्ट")
    .replace(/Guide/g, "गाइड")
    .replace(/Guidance/g, "गाइडेंस")
    .replace(/guidance/g, "गाइडेंस")
    .replace(/Educate/g, "एजुकेट")
    .replace(/Education/g, "एजुकेशन")
    .replace(/education/g, "एजुकेशन")
    .replace(/Counsel/g, "काउंसल")
    .replace(/Counseling/g, "काउंसलिंग")
    .replace(/counseling/g, "काउंसलिंग")
    .replace(/Refer/g, "रेफ़र")
    .replace(/Referral/g, "रेफ़रल")
    .replace(/referral/g, "रेफ़रल")
    .replace(/Coordinate/g, "कोऑर्डिनेट")
    .replace(/Coordination/g, "कोऑर्डिनेशन")
    .replace(/coordination/g, "कोऑर्डिनेशन")
    .replace(/Collaborate/g, "कोलैबोरेट")
    .replace(/Discuss/g, "डिस्कस")
    .replace(/Discussion/g, "डिस्कशन")
    .replace(/Explain/g, "समझाना")
    .replace(/Explanation/g, "समझ")
    .replace(/Understand/g, "समझना")
    .replace(/Understanding/g, "समझ")
    .replace(/Ask/g, "पूछें")
    .replace(/Answer/g, "जवाब")
    .replace(/Question/g, "सवाल")
    .replace(/Query/g, "सवाल")
    .replace(/Help/g, "मदद")
    .replace(/Assist/g, "असिस्ट")
    .replace(/Assistance/g, "असिस्टेंस")
    .replace(/Service/g, "सर्विस")
    .replace(/services/g, "सर्विसेज़")
    .replace(/Facility/g, "फ़ैसिलिटी")
    .replace(/facilities/g, "फ़ैसिलिटीज़")
    .replace(/Equipment/g, "इक्विपमेंट")
    .replace(/equipped/g, "इक्विप्ड")
    .replace(/Technology/g, "टेक्नोलॉजी")
    .replace(/Advanced technology/g, "एडवांस्ड टेक्नोलॉजी")
    .replace(/Modern/g, "मॉडर्न")
    .replace(/State-of-the-art/g, "स्टेट-ऑफ़-द-आर्ट")
    .replace(/World-class/g, "वर्ल्ड-क्लास")
    .replace(/International/g, "इंटरनेशनल")
    .replace(/National/g, "नेशनल")
    .replace(/Regional/g, "रीज़नल")
    .replace(/Local/g, "लोकल")
    .replace(/City/g, "शहर")
    .replace(/District/g, "जिला")
    .replace(/State/g, "राज्य")
    .replace(/Country/g, "देश")
    .replace(/Region/g, "रीज़न")
    .replace(/Area/g, "एरिया")
    .replace(/Village/g, "गांव")
    .replace(/Town/g, "कस्बा")
    .replace(/Urban/g, "शहरी")
    .replace(/Rural/g, "ग्रामीण")
    .replace(/Road/g, "रोड")
    .replace(/Street/g, "स्ट्रीट")
    .replace(/Lane/g, "लेन")
    .replace(/House/g, "हाउस")
    .replace(/Building/g, "बिल्डिंग")
    .replace(/Floor/g, "फ़्लोर")
    .replace(/Room/g, "रूम")
    .replace(/Block/g, "ब्लॉक")
    .replace(/Phase/g, "फ़ेज़")
    .replace(/Stage/g, "स्टेज")
    .replace(/Step/g, "स्टेप")
    .replace(/Option/g, "ऑप्शन")
    .replace(/options/g, "ऑप्शंस")
    .replace(/Choice/g, "चॉइस")
    .replace(/Alternative/g, "विकल्प")
    .replace(/Plan/g, "प्लान")
    .replace(/Program/g, "प्रोग्राम")
    .replace(/Protocol/g, "प्रोटोकॉल")
    .replace(/Approach/g, "अप्रोच")
    .replace(/Strategy/g, "स्ट्रैटेजी")
    .replace(/Method/g, "मेथड")
    .replace(/Technique/g, "तकनीक")
    .replace(/Procedure/g, "प्रोसीजर")
    .replace(/process/g, "प्रोसेस")
    .replace(/System/g, "सिस्टम")
    .replace(/Approach/g, "अप्रोच")
    .replace(/Policy/g, "पॉलिसी")
    .replace(/Guideline/g, "गाइडलाइन")
    .replace(/guidelines/g, "गाइडलाइंस")
    .replace(/Standard/g, "स्टैंडर्ड")
    .replace(/standards/g, "स्टैंडर्ड्स")
    .replace(/Requirement/g, "ज़रूरत")
    .replace(/Need/g, "ज़रूरत")
    .replace(/Should/g, "करना चाहिए")
    .replace(/Must/g, "ज़रूर")
    .replace(/Can/g, "कर सकते")
    .replace(/Could/g, "कर सकते")
    .replace(/May/g, "हो सकता")
    .replace(/Will/g, "होगा")
    .replace(/Would/g, "होगा")
    .replace(/Often/g, "अक्सर")
    .replace(/Usually/g, "आमतौर पर")
    .replace(/Sometimes/g, "कभी-कभी")
    .replace(/Rarely/g, "शायद ही")
    .replace(/Never/g, "कभी नहीं")
    .replace(/Always/g, "हमेशा")
    .replace(/However/g, "हालांकि")
    .replace(/Therefore/g, "इसलिए")
    .replace(/Nevertheless/g, "फिर भी")
    .replace(/Moreover/g, "इसके अलावा")
    .replace(/Additionally/g, "अतिरिक्त")
    .replace(/Finally/g, "अंत में")
    .replace(/Ultimately/g, "आखिरकार")
    .replace(/Importantly/g, "महत्वपूर्ण बात")
    .replace(/Specifically/g, "खासकर")
    .replace(/Especially/g, "खासतौर पर")
    .replace(/Particularly/g, "खासकर")
    .replace(/Including/g, "शामिल")
    .replace(/including/g, "शामिल")
    .replace(/Such as/g, "जैसे")
    .replace(/For example/g, "उदाहरण के लिए")
    .replace(/Among/g, "इनमें से")
    .replace(/Between/g, "के बीच")
    .replace(/Amongst/g, "के बीच")
    .replace(/Within/g, "के अंदर")
    .replace(/Without/g, "के बिना")
    .replace(/During/g, "के दौरान")
    .replace(/After/g, "के बाद")
    .replace(/Before/g, "से पहले")
    .replace(/Until/g, "तक")
    .replace(/Since/g, "से")
    .replace(/While/g, "जबकि")
    .replace(/When/g, "जब")
    .replace(/Where/g, "कहां")
    .replace(/Who/g, "कौन")
    .replace(/What/g, "क्या")
    .replace(/Why/g, "क्यों")
    .replace(/How/g, "कैसे")
    .replace(/Which/g, "कौन सा")
    .replace(/This/g, "यह")
    .replace(/That/g, "वह")
    .replace(/These/g, "ये")
    .replace(/Those/g, "वो")
    .replace(/All/g, "सभी")
    .replace(/Most/g, "ज़्यादातर")
    .replace(/Many/g, "कई")
    .replace(/Some/g, "कुछ")
    .replace(/None/g, "कोई नहीं")
    .replace(/Any/g, "कोई")
    .replace(/Each/g, "हर")
    .replace(/Every/g, "हर")
    .replace(/Other/g, "दूसरा")
    .replace(/Another/g, "एक और")
    .replace(/Same/g, "वही")
    .replace(/Different/g, "अलग")
    .replace(/Similar/g, "समान")
    .replace(/Additional/g, "अतिरिक्त")
    .replace(/Further/g, "आगे")
    .replace(/Previous/g, "पिछला")
    .replace(/Recent/g, "हालिया")
    .replace(/Current/g, "वर्तमान")
    .replace(/Initial/g, "शुरुआती")
    .replace(/Final/g, "अंतिम")
    .replace(/Complete/g, "पूरा")
    .replace(/Total/g, "कुल")
    .replace(/Partial/g, "आंशिक")
    .replace(/Full/g, "पूर्ण")
    .replace(/Based/g, "आधारित")
    .replace(/focused/g, "फोकस्ड")
    .replace(/oriented/g, "ओरिएंटेड")
    .replace(/Dr. Yuvraj Lahre/g, "डॉ. युवराज लहरे")
    .replace(/Dr. Dibya Prabha/g, "डॉ. डिब्या प्रभा");

  // If the string contains a pipe (likely a meta title), translate each segment
  if (en.includes(" | ")) {
    return en.split(" | ").map(part => translateString(part)).join(" | ");
  }

  return result;
}

// Detect double-wrapped structure: { en: { en: ... }, hi: { en: ..., hi: ... } }
// The inner values can be strings (localized strings), arrays (localized string arrays), or strings+arrays
function isDoubleWrapped(obj: unknown): obj is { en: Record<string, unknown>; hi: Record<string, unknown> } {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  if (!("en" in o) || !("hi" in o)) return false;
  if (typeof o.en !== "object" || o.en === null) return false;
  if (typeof o.hi !== "object" || o.hi === null) return false;
  const enObj = o.en as Record<string, unknown>;
  const hiObj = o.hi as Record<string, unknown>;
  // Both must have their own "en" key
  return "en" in enObj && "en" in hiObj;
}

// Unwrap a double-wrapped structure
function unwrapDoubleWrapped(obj: { en: Record<string, unknown>; hi: Record<string, unknown> }): unknown {
  const enInner = obj.en;
  const hiInner = obj.hi;

  // Use the inner en.en as the source of truth for en, and hiInner.en for hi
  const enVal = enInner.en;
  let hiVal = hiInner.en;

  // If no hi available, translate from en
  if (!hiVal || hiVal === enVal) {
    if (Array.isArray(enVal)) {
      hiVal = (enVal as string[]).map(s => translateString(s));
    } else if (typeof enVal === "string") {
      hiVal = translateString(enVal as string);
    }
  }

  return { en: enVal, hi: hiVal };
}

// Deep clone and translate all localized strings in an object
function translateDeep(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  // Fix double-wrapped structures first (from linter auto-conversion of nested { en, hi })
  if (isDoubleWrapped(obj)) {
    return unwrapDoubleWrapped(obj);
  }

  // Handle localized string { en, hi }
  if (isLocalizedValue(obj)) {
    if (!obj.hi || obj.hi === "") {
      const translated = translateString(obj.en);
      return { en: obj.en, hi: translated === obj.en && !dict[obj.en] ? obj.en : translated };
    }
    // If hi is nested inside another object somehow, re-translate
    if (typeof obj.hi === "object") {
      const translated = translateString(obj.en);
      return { en: obj.en, hi: translated };
    }
    return obj;
  }

  // Handle localized string array { en: string[], hi: string[] }
  if (isLocalizedStringArray(obj)) {
    const hiArr = obj.hi || [];
    if (hiArr.length === 0) {
      return {
        en: obj.en,
        hi: obj.en.map(s => {
          const translated = translateString(s);
          return translated === s ? s : translated;
        }),
      };
    }
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => translateDeep(item));
  }

  // Handle objects
  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      result[key] = translateDeep((obj as Record<string, unknown>)[key]);
    }
    return result;
  }

  return obj;
}

// Fix nested slug fields that should be plain strings, not { en, hi }
// Only the top-level page slug should be localized; nested ones (diagnosticTests[].slug, conditionsTreated[].slug) should be strings
function fixNestedSlugs(obj: unknown, isTopLevel: boolean): unknown {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => fixNestedSlugs(item, false));
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const value = (obj as Record<string, unknown>)[key];

      // If this is a "slug" key at a nested level (not page root), unwrap to plain string
      if (key === "slug" && !isTopLevel && isLocalizedValue(value)) {
        result[key] = value.en;
      } else if (key === "slug" && isTopLevel) {
        // Top-level slug should remain { en, hi }
        result[key] = value;
      } else {
        result[key] = fixNestedSlugs(value, false);
      }
    }
    return result;
  }

  return obj;
}

// Process all JSON files
function processAllFiles() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  console.log(`Found ${files.length} JSON files to process\n`);

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`Processing: ${file}`);

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(content);

      const translated = translateDeep(data);
      const updated = Array.isArray(translated)
        ? (translated as unknown[]).map(page => fixNestedSlugs(page, true))
        : fixNestedSlugs(translated, false);

      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
      console.log(`  -> Updated successfully`);
    } catch (err: any) {
      console.error(`  -> Error: ${err.message}`);
    }
  }

  console.log("\nDone!");
}

processAllFiles();
