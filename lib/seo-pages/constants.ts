import type { Clinician } from "./types";

export const CLINIC = {
  name: "Palamu Neuro & Eye Care",
  alternateName: "Palamu Neuro & Eye Care",
  url: "https://www.palamuneurocare.com",
  logo: "https://www.palamuneurocare.com/logo.svg",
  email: "hello@palamu-neuro-care.app",
  phone: "+91 77798 97207",
  phoneDisplay: "+91 77798 97207",
  whatsapp: "https://wa.me/917779897207",
  address: {
    street: "Sitakunj police line road, Hamidganj",
    city: "Medininagar",
    state: "Jharkhand",
    postalCode: "822102",
    country: "IN",
    full: "Sitakunj police line road, Hamidganj, Medininagar, Jharkhand 822102, India",
  },
  geo: {
    latitude: 24.0305,
    longitude: 84.0673,
  },
  mapsUrl: "https://share.google/zmRJAZm1DtuJN3Cn9",
  placeId: "ChIJ7SO2cid3jDkR4IUQ_BqFcA8",
  maps: {
    lahre: "https://share.google/RKYcHWMq8fWQUB7cV",
    prabha: "https://share.google/vgzSXWnbULqZp7EBT",
    clinic: "https://maps.app.goo.gl/BU8Ki6cBFhZVH81V7",
    lahrePlaceId: "ChIJV1q_-yvh9DkRimUJu3R20fI",
    prabhaPlaceId: "ChIJqUX6OePl9DkR4D6kkVGPmjg",
  },
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Palamu+Neuro+Care+Medininagar&z=16&output=embed",
  reviewUrl:
    "https://search.google.com/local/writereview?placeid=ChIJ7SO2cid3jDkR4IUQ_BqFcA8",
  hours: {
    mondayToSaturday: "9:00 AM – 8:00 PM",
    sunday: "Closed",
    full: "Mon–Sat: 9:00 AM – 8:00 PM | Sun: Closed",
  },
  social: {
    facebook: "https://www.facebook.com/palamuneurocare",
    instagram: "https://www.instagram.com/palamuneurocare",
  },
  serviceRegions: [
    "Palamu",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Patna",
    "Rourkela",
    "Jharkhand",
    "Bihar",
    "West Bengal",
    "Chhattisgarh",
  ],
  pressMentions: [] as {
    outlet: string;
    title: string;
    url: string;
    date: string;
    doctor: "lahre" | "prabha";
  }[],
} as const;

export const DOCTORS = {
  lahre: {
    name: "Dr. Yuvraj Lahre",
    slug: "dr-yuvraj-lahre-neurologist-palamu",
    title: "Neurologist",
    image: "/_static/illustrations/yuvraj.jpeg",
    qualifications: "MBBS, MD Medicine, DM Neurology (AIIMS Bhubaneswar), Gold Medalist",
    shortBio:
      "Dr. Yuvraj Lahre is a highly skilled neurologist with training from AIIMS Bhubaneswar. He specializes in diagnosing and treating complex neurological disorders including migraines, epilepsy, stroke, Parkinson's disease, and peripheral nerve conditions.",
    education: [
      { degree: "MBBS", institution: "GMC Nagpur" },
      { degree: "MD Medicine", institution: "RIMS Palamu" },
      { degree: "DM Neurology", institution: "AIIMS Bhubaneswar" },
    ],
    specializations: [
      "Migraine and Headache Disorders",
      "Epilepsy Management",
      "Stroke Care and Rehabilitation",
      "Parkinson's Disease and Movement Disorders",
      "Neuropathy and Nerve Disorders",
      "Spine and Back Pain Management",
    ],
  },
  prabha: {
    name: "Dr. Dibya Prabha",
    slug: "dr-dibya-prabha-ophthalmologist-palamu",
    title: "Ophthalmologist & Retina Specialist",
    image: "/_static/illustrations/dibya.jpeg",
    qualifications:
      "MBBS, MS Ophthalmology (RIMS Palamu), FICO, Fellow - Retina & Vitreous (LV Prasad Eye Institute, Hyderabad)",
    shortBio:
      "Dr. Dibya Prabha is an expert ophthalmologist and retina specialist with fellowship training from the prestigious LV Prasad Eye Institute, Hyderabad. She provides advanced eye care including retinal surgery, cataract surgery, and management of complex retinal diseases.",
    education: [
      { degree: "MBBS", institution: "MGM Jamshedpur" },
      { degree: "MS Ophthalmology", institution: "RIMS Palamu" },
      { degree: "Fellow - Retina & Vitreous", institution: "LV Prasad Eye Institute, Hyderabad" },
    ],
    specializations: [
      "Retinal Detachment Surgery",
      "Diabetic Retinopathy Management",
      "Cataract Surgery",
      "Macular Degeneration Treatment",
      "Glaucoma Management",
      "Ocular Oncology",
    ],
  },
} as const;

export function getClinicianName(clinician: Clinician, lang: string): string {
  if (clinician === "dr-lahre") return lang === "hi" ? "डॉ. युवराज लाहरे" : DOCTORS.lahre.name;
  if (clinician === "dr-prabha") return lang === "hi" ? "डॉ. दिब्या प्रभा" : DOCTORS.prabha.name;
  return lang === "hi" ? "पलामू न्यूरो एंड आई केयर क्लिनिक" : CLINIC.name;
}
