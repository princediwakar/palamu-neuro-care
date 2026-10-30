import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (typeof source !== "object" || Array.isArray(source)) return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target?.[key];
    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "hi")) {
    locale = routing.defaultLocale;
  }

  const enMessages = (await import("../messages/en.json")).default;
  if (locale === "en") {
    return {
      locale,
      messages: enMessages,
    };
  }

  const localeMessages = (await import(`../messages/${locale}.json`)).default;
  return {
    locale,
    messages: deepMerge(enMessages, localeMessages),
  };
});
