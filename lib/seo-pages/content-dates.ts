import datesMap from "./content-dates.json";

interface FileDates {
  datePublished: string;
  dateModified: string;
}

export function getContentDates(slug: string): { datePublished?: string; dateModified?: string } {
  const dates = (datesMap as Record<string, FileDates>)[slug];
  return dates ?? {};
}
