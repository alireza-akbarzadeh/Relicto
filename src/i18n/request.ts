import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";

const messages = { en, fa } as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = rawLocale === "fa" ? "fa" : "en";

  return {
    locale,
    messages: messages[locale],
  };
});

