import { Inter, Newsreader } from "next/font/google";

export const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const serifFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});
