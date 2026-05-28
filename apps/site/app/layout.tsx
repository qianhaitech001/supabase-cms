import type { Metadata } from "next";
import { getRuntimeSiteConfig } from "@/lib/site-config";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getRuntimeSiteConfig();
  return {
    title: config.defaultSeo.title,
    description: config.defaultSeo.description,
    metadataBase: new URL(config.domain),
    robots: config.defaultSeo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: config.defaultSeo.title,
      description: config.defaultSeo.description,
      images: config.defaultSeo.ogImageUrl ? [config.defaultSeo.ogImageUrl] : []
    }
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
