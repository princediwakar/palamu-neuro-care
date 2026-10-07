import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.palamuneurocare.com"),
  title: "Palamu Neuro & Eye Care | Neurology & Ophthalmology Experts",
  description:
    "Palamu Neuro & Eye Care offers world-class neurology and ophthalmology care in Palamu, Jharkhand. Book your appointment today for expert brain, spine, and eye care.",
  keywords: [
    "neurologist Palamu",
    "eye specialist Jharkhand",
    "retina care Bihar",
    "spine doctor West Bengal",
    "brain specialist Chhattisgarh",
  ],
  openGraph: {
    title: "Palamu Neuro & Eye Care | Neurology & Ophthalmology Experts",
    description:
      "Palamu Neuro & Eye Care offers world-class neurology and ophthalmology care in Palamu, Jharkhand. Book your appointment today for expert brain, spine, and eye care.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Palamu Neuro & Eye Care",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/_static/illustrations/hero1.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palamu Neuro & Eye Care | Neurology & Ophthalmology Experts",
    description:
      "Palamu Neuro & Eye Care offers world-class neurology and ophthalmology care in Palamu, Jharkhand. Book your appointment today for expert brain, spine, and eye care.",
    images: [
      `${process.env.NEXT_PUBLIC_BASE_URL}/_static/illustrations/hero1.jpg`,
    ],
  },
};