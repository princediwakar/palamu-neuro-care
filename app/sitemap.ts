import { MetadataRoute } from 'next'
import { allEnPages, allHiPages } from '@/lib/seo-pages/registry'
import { CLINIC } from '@/lib/seo-pages/constants'
import { getContentDates } from '@/lib/seo-pages/content-dates'

const COMMIT_DATE = new Date("2026-06-04");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = CLINIC.url

  const staticRoutes = [
    { url: baseUrl, lastModified: COMMIT_DATE, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/hi`, lastModified: COMMIT_DATE, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/doctors`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/hi/doctors`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/hi/gallery`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/videos`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/hi/videos`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/neurology`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/hi/neurology`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/ophthalmology`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/hi/ophthalmology`, lastModified: COMMIT_DATE, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: COMMIT_DATE, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/hi/privacy`, lastModified: COMMIT_DATE, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: COMMIT_DATE, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/hi/terms`, lastModified: COMMIT_DATE, changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  const seoRouteDate = (slug: string) => {
    const dates = getContentDates(slug);
    return dates.dateModified ? new Date(dates.dateModified) : new Date();
  };

  const enSeoRoutes: MetadataRoute.Sitemap = allEnPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: seoRouteDate(page.slug),
    changeFrequency: 'monthly' as const,
    priority: page.category === 'specialist' ? 0.9 : page.category === 'doctor' ? 0.8 : 0.7,
  }))

  const hiSeoRoutes: MetadataRoute.Sitemap = allHiPages.map((page) => ({
    url: `${baseUrl}/hi/${page.slug}`,
    lastModified: seoRouteDate(page.slug),
    changeFrequency: 'monthly' as const,
    priority: page.category === 'specialist' ? 0.9 : page.category === 'doctor' ? 0.8 : 0.7,
  }))

  return [...staticRoutes, ...enSeoRoutes, ...hiSeoRoutes]
}
