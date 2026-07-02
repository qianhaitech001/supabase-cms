export type StorefrontVisualTone = "inshow" | "minimal" | "industrial" | "warm";

const allowedThemes: StorefrontVisualTone[] = ["inshow", "minimal", "industrial", "warm"];

export function getStorefrontTheme(): StorefrontVisualTone {
  const value = (process.env.STOREFRONT_THEME ?? process.env.NEXT_PUBLIC_STOREFRONT_THEME ?? "inshow")
    .trim()
    .toLowerCase();

  return allowedThemes.includes(value as StorefrontVisualTone) ? (value as StorefrontVisualTone) : "inshow";
}

export const storefrontThemeOptions = [
  {
    value: "inshow",
    label: "INSHOW B2B",
    description: "Orange accent, deep navy footer, rounded commercial storefront controls."
  },
  {
    value: "minimal",
    label: "Minimal Editorial",
    description: "Quiet grayscale palette with restrained accents for content-led sites."
  },
  {
    value: "industrial",
    label: "Industrial Utility",
    description: "Dark graphite surfaces, sharp corners, and high-contrast calls to action."
  },
  {
    value: "warm",
    label: "Warm Trade",
    description: "Warmer neutrals and amber accents for home, furniture, and lifestyle exports."
  }
] satisfies Array<{ value: StorefrontVisualTone; label: string; description: string }>;
