import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LOCALE_CODES, DEFAULT_LOCALE } from "@/lib/i18n-locales";

const LOCALE_COOKIE = "NEXT_LOCALE";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale =
    stored && LOCALE_CODES.includes(stored as typeof LOCALE_CODES[number])
      ? stored
      : DEFAULT_LOCALE;

  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../messages/${DEFAULT_LOCALE}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
