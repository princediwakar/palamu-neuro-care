export type SeoPageCategory =
  | "specialist"
  | "condition"
  | "diagnostic"
  | "symptom"
  | "location"
  | "info"
  | "doctor";

export type Clinician = "dr-lahre" | "dr-prabha" | "both";

export type JsonLdType =
  | "MedicalClinic"
  | "Physician"
  | "MedicalProcedure"
  | "MedicalCondition"
  | "MedicalSignOrSymptom";

interface SeoPageBase {
  slug: string;
  category: SeoPageCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonical?: string;
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  faqs: { question: string; answer: string; bluf?: string }[];
  clinicalObservations?: {
    standardView: string;
    palamuObservation: string;
    treatmentModification: string;
    clinician: Clinician;
  }[];
  relatedPages: string[];
  clinician: Clinician;
  jsonLdType: JsonLdType;
}

export interface SpecialistSeoPage extends SeoPageBase {
  category: "specialist";
  specialistType: string;
  doctorName: string;
  doctorImage: string;
  doctorQualifications: string[];
  conditionsTreated: {
    name: string;
    description: string;
    slug: string;
  }[];
  servicesOffered: {
    name: string;
    description: string;
    icon: string;
  }[];
  specialistIntro: string;
  whyChooseUs: string[];
}

export interface ConditionSeoPage extends SeoPageBase {
  category: "condition";
  conditionName: string;
  parentDepartment: "neurology" | "ophthalmology";
  whatIsIt: string | InfoContentBlock[];
  symptoms: string[];
  causes: string[];
  diagnosticTests: {
    name: string;
    description: string;
    slug: string;
  }[];
  treatmentApproach: {
    intro: string;
    methods: { name: string; description: string }[];
  };
  whenToSeeDoctor: string[];
  testimonials?: { quote: string; name: string; location: string }[];
  clinicStats?: {
    metric: string;
    value: string;
    sampleSize?: string;
    timeframe?: string;
  }[];
}

export interface DiagnosticSeoPage extends SeoPageBase {
  category: "diagnostic";
  testName: string;
  parentDepartment: "neurology" | "ophthalmology" | "both";
  whatIsIt: string | InfoContentBlock[];
  whyItIsDone: string[];
  procedureSteps: { step: number; title: string; description: string | InfoContentBlock[] }[];
  preparation: string[];
  relatedConditions: string[];
}

export interface SymptomSeoPage extends SeoPageBase {
  category: "symptom";
  symptomName: string;
  whenToWorry: string[];
  possibleCauses: { cause: string; description: string }[];
  whichSpecialistToSee: string;
  diagnosticApproach: string;
  relatedConditions: string[];
}

export interface LocationSeoPage extends SeoPageBase {
  category: "location";
  targetCity: string;
  targetState: string;
  distanceFromPalamu: string;
  travelInfo: string;
  servicesOffered: string[];
  servingRegions: string[];
  cityHighlight?: string;
}

export type InfoContentBlock =
  | { type: "paragraphs"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "highlight"; title?: string; text: string }
  | { type: "cards"; items: { icon?: string; title: string; description: string }[] }
  | { type: "steps"; items: { title: string; description: string }[] };

export interface InfoSeoPage extends SeoPageBase {
  category: "info";
  sections: { heading: string; content: string | InfoContentBlock[]; icon?: string }[];
  callToAction: string;
}

export interface DoctorSeoPage extends SeoPageBase {
  category: "doctor";
  doctorName: string;
  doctorImage: string;
  qualifications: string;
  education: { degree: string; institution: string }[];
  specializations: string[];
  bio: string;
  achievements: { title: string; description: string }[];
}

export type SeoPage =
  | SpecialistSeoPage
  | ConditionSeoPage
  | DiagnosticSeoPage
  | SymptomSeoPage
  | LocationSeoPage
  | InfoSeoPage
  | DoctorSeoPage;
