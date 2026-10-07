import { generateJsonLd } from "@/lib/seo-pages/metadata-factory";
import { SeoPage } from "@/lib/seo-pages/types";

export default function JsonLdScripts({ page, lang }: { page: SeoPage; lang: string }) {
  const jsonLdBlocks = generateJsonLd(page, lang);
  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
