import { InfoLdg, TestimonialType } from "@/types";

export const infos: InfoLdg[] = [
  {
    title: "Expert Care for Brain, Eyes, and Spine",
    description:
      "Palamu Neuro & Eye Care provides advanced neurology and ophthalmology care, combining cutting-edge technology with world-class expertise.",
    image: "/_static/illustrations/palamu-neuro-care.jpg", // Update with clinic-specific image
    list: [
      {
        title: "Comprehensive Diagnostics",
        description: "State-of-the-art technology for precise brain, spine, and eye assessments.",
        icon: "search",
      },
      {
        title: "Personalized Treatment",
        description: "Tailored treatment plans to meet your unique health needs.",
        icon: "user",
      },
      {
        title: "Accessible Care",
        description: "Seamless booking via WhatsApp or phone for in-person or online visits.",
        icon: "phone",
      },
    ],
  },
  {
    title: "Why Choose Palamu Neuro & Eye Care?",
    description:
      "Our clinic is trusted across Jharkhand, Bihar, West Bengal, and Chhattisgarh for unmatched expertise and patient-centered care.",
    image: "/_static/illustrations/palamu-neuro-care-2.jpg", // Update with clinic-specific image
    list: [
      {
        title: "Board-Certified Specialists",
        description: "Our doctors are trained at AIIMS and LV Prasad Eye Institute.",
        icon: "shieldCheck",
      },
      {
        title: "Cutting-Edge Technology",
        description: "Advanced diagnostics and treatment for brain, spine, and eye conditions.",
        icon: "cpu",
      },
      {
        title: "Patient Stories",
        description: "Hear from patients we’ve helped across the region.",
        icon: "messages",
      },
    ],
  },
];

// export const features: FeatureLdg[] = [
//   {
//     title: "Neurology Care",
//     description: "Expert treatment for brain, spine, and nerve conditions, including migraines, epilepsy, and stroke recovery.",
//     icon: "brain",
//   },
//   {
//     title: "Ophthalmology Care",
//     description: "Advanced eye and retina care for conditions like glaucoma, cataracts, and diabetic eye issues.",
//     icon: "eye",
//   },
//   {
//     title: "Comprehensive Diagnostics",
//     description: "State-of-the-art technology for precise brain, spine, and eye assessments.",
//     icon: "search",
//   },
//   {
//     title: "Accessible for All",
//     description: "Seamless booking via WhatsApp or phone for in-person or online visits.",
//     icon: "phone",
//   },
//   {
//     title: "Patient-Centered Care",
//     description: "Personalized treatment plans tailored to your unique health needs.",
//     icon: "user",
//   },
//   {
//     title: "Trusted Across the Region",
//     description: "Serving patients from Jharkhand, Bihar, West Bengal, and Chhattisgarh.",
//     icon: "mapPin",
//   },
// ];

export const testimonials: TestimonialType[] = [
  {
    name: "Ramesh Kumar",
    job: "Patient",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "I struggled with chronic migraines for years. Dr. Yuvraj Lahre’s treatment plan finally gave me relief. I can’t thank him enough!",
    location: "Palamu, Jharkhand",
  },
  {
    name: "Sunita Devi",
    job: "Patient",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "After my retinal detachment, I thought I’d never see clearly again. Dr. Dibya Prabha’s surgery restored my vision. She’s a miracle worker!",
    location: "Patna, Bihar",
  },
  {
    name: "Amit Singh",
    job: "Patient",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "A spinal injury left me unable to walk. Palamu Neuro & Eye Care’s team not only treated me but also gave me hope. I’m back to my daily routine now.",
    location: "Durgapur, West Bengal",
  },
  {
    name: "Priya Sharma",
    job: "Patient",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review:
      "Living with epilepsy was terrifying until I met Dr. Lahre. His expertise and care have made managing my condition so much easier.",
    location: "Raipur, Chhattisgarh",
  },
];

export const patientTestimonials = [
  {
    id: "ramesh",
    name: "Ramesh Kumar",
    location: "Palamu, Jharkhand",
    review: "I struggled with chronic migraines for years. Dr. Yuvraj Lahre’s treatment plan finally gave me relief. I can’t thank him enough!",
    disease: "Chronic Migraines",
  },
  {
    id: "sunita",
    name: "Sunita Devi",
    location: "Patna, Bihar",
    review: "After my retinal detachment, I thought I’d never see clearly again. Dr. Dibya Prabha’s surgery restored my vision. She’s a miracle worker!",
    disease: "Retinal Detachment",
  },
  {
    id: "amit",
    name: "Amit Singh",
    location: "Durgapur, West Bengal",
    review: "A spinal injury left me unable to walk. Palamu Neuro & Eye Care’s team not only treated me but also gave me hope. I’m back to my daily routine now.",
    disease: "Spinal Injury",
  },
  {
    id: "priya",
    name: "Priya Sharma",
    location: "Raipur, Chhattisgarh",
    review: "Living with epilepsy was terrifying until I met Dr. Lahre. His expertise and care have made managing my condition so much easier.",
    disease: "Epilepsy",
  },
  {
    id: "rajesh",
    name: "Rajesh Mehta",
    location: "Jamshedpur, Jharkhand",
    review: "Cataracts made my world blurry. Dr. Prabha’s surgery gave me clear vision again. The entire process was smooth and professional.",
    disease: "Cataract",
  },
  {
    id: "anita",
    name: "Anita Das",
    location: "Kolkata, West Bengal",
    review: "Nerve pain was disrupting my life. Palamu Neuro & Eye Care’s team diagnosed the issue and provided a treatment plan that worked wonders. I’m pain-free now!",
    disease: "Nerve Pain",
  },
  {
    id: "vikram",
    name: "Vikram Patel",
    location: "Bokaro, Jharkhand",
    review: "I had a stroke that left me with mobility issues. Dr. Lahre’s rehabilitation plan helped me regain my strength and independence.",
    disease: "Post-Stroke Rehabilitation",
  },
  {
    id: "meena",
    name: "Meena Yadav",
    location: "Gaya, Bihar",
    review: "Glaucoma was slowly taking my vision. Dr. Prabha’s timely intervention saved my eyesight. I’m forever grateful to her and the team.",
    disease: "Glaucoma",
  },
];