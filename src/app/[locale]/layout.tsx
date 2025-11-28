import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Fonts temporarily disabled due to network issues
const orbitron = { variable: "font-orbitron" };
const rajdhani = { variable: "font-rajdhani" };
const inter = { variable: "font-inter" };
const roboto = { variable: "font-roboto" };

export const metadata: Metadata = {
  title: "CyberDestin RO",
  description: "Sci-Fi Love Tarot",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
