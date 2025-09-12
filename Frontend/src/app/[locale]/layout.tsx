import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "OOP Game",
  description: "The best game to learn oop",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "de")) {
    notFound();
  }
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        {/* Disabled AuthDebug to reduce memory usage */}
        {/* <AuthDebug /> */}
      </body>
    </html>
  );
}
