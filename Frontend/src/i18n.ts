import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./i18n/routing";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as "en" | "de")) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
