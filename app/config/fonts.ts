import { Young_Serif, Bitter, Montserrat } from "next/font/google";

// Young Serif for logos and headings
export const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Bitter for paragraphs and body text
export const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Montserrat Classic for general text (non-heading)
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Font family definitions
export const FONT_FAMILIES = {
  youngSerif: "var(--font-young-serif)",
  bitter: "var(--font-bitter)",
  hattonUltralight: "var(--font-hatton-ultralight)",
  montserrat: "var(--font-montserrat)",
} as const;

// Font weight definitions
export const FONT_WEIGHTS = {
  thin: "100",
  extraLight: "200", 
  light: "300",
  normal: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
  black: "900",
} as const;

// Font utility classes
export const FONT_CLASSES = {
  // Hatton classes for brand logo
  logo: "hatton-ultralight",
  logoHatton: "hatton-ultralight",
  
  // Young Serif classes for logos and headings
  logoYoung: "font-young-serif font-normal",
  heading1: "font-young-serif font-bold text-4xl",
  heading2: "font-young-serif font-bold text-3xl", 
  heading3: "font-young-serif font-semibold text-2xl",
  heading4: "font-young-serif font-medium text-xl",
  heading5: "font-young-serif font-medium text-lg",
  heading6: "font-young-serif font-light text-base",
  
  // Bitter classes for paragraphs and body text
  paragraph: "font-bitter font-light text-base leading-relaxed",
  paragraphSmall: "font-bitter font-light text-sm leading-relaxed",
  paragraphLarge: "font-bitter font-light text-lg leading-relaxed",
  body: "font-bitter font-light text-base",
  bodySmall: "font-bitter font-light text-sm",
  bodyLarge: "font-bitter font-light text-lg",
  
  // Utility classes
  thin: "font-bitter font-thin",
  extraLight: "font-bitter font-extralight",
  light: "font-bitter font-light",
  normal: "font-bitter font-normal",
  medium: "font-bitter font-medium",
  semiBold: "font-bitter font-semibold",
  bold: "font-bitter font-bold",
  extraBold: "font-bitter font-extrabold",
  black: "font-bitter font-black",
} as const;

// CSS custom properties for fonts
export const FONT_CSS_VARS = {
  "--font-young-serif": FONT_FAMILIES.youngSerif,
  "--font-bitter": FONT_FAMILIES.bitter,
  "--font-hatton-ultralight": FONT_FAMILIES.hattonUltralight,
  "--font-montserrat": FONT_FAMILIES.montserrat,
} as const;

// Tailwind CSS configuration for fonts
export const TAILWIND_FONTS = {
  fontFamily: {
    'young-serif': [FONT_FAMILIES.youngSerif, 'serif'],
    'bitter': [FONT_FAMILIES.bitter, 'serif'],
    'hatton-ultralight': [FONT_FAMILIES.hattonUltralight, 'sans-serif'],
    'montserrat': [FONT_FAMILIES.montserrat, 'sans-serif'],
  },
  fontWeight: {
    'thin': FONT_WEIGHTS.thin,
    'extralight': FONT_WEIGHTS.extraLight,
    'light': FONT_WEIGHTS.light,
    'normal': FONT_WEIGHTS.normal,
    'medium': FONT_WEIGHTS.medium,
    'semibold': FONT_WEIGHTS.semiBold,
    'bold': FONT_WEIGHTS.bold,
    'extrabold': FONT_WEIGHTS.extraBold,
    'black': FONT_WEIGHTS.black,
  },
} as const;
