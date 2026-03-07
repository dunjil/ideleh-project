import { Outfit, Plus_Jakarta_Sans } from "next/font/google"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontDisplay = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
})

export { fontSans, fontDisplay }
