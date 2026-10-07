import fs from 'fs/promises';
import path from 'path';
import { fetchGscData, identifyOpportunities } from './seo-analyzer';
import { generateSeoRecommendations } from './ai-engine';

// Recursively map out the Next.js app directory to find all pages
async function getSiteMap(dir: string, base: string = ''): Promise<string[]> {
  let routes: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subRoutes = await getSiteMap(path.join(dir, entry.name), path.join(base, entry.name));
        routes = routes.concat(subRoutes);
      } else if (entry.name === 'page.tsx') {
        routes.push(path.join('app', base, 'page.tsx').replace(/\\/g, '/'));
      }
    }
  } catch (e) {
    // Ignore if directory doesn't exist
  }
  return routes;
}

async function fetchCurrentMetadata(url: string) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    
    return {
      title: titleMatch ? titleMatch[1] : null,
      description: descMatch ? descMatch[1] : null
    };
  } catch (e) {
    return { title: null, description: null };
  }
}

async function main() {
  const SITE_URL = process.env.GSC_PROPERTY_URL || 'sc-domain:palamuneurocare.com';
  
  // Last 7 days
  const endDate = new Date().toISOString().split('T')[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 7);
  const startDate = startDateObj.toISOString().split('T')[0];

  try {
    const rows = await fetchGscData(startDate, endDate, SITE_URL);
    console.log(`Fetched ${rows.length} rows from GSC.`);

    const opportunities = identifyOpportunities(rows);
    console.log(`Identified ${opportunities.length} high-leverage opportunities based on missed click potential.`);

    if (opportunities.length === 0) {
      console.log("No immediate opportunities found.");
      return;
    }

    // Group opportunities by URL to avoid conflicting recommendations
    const groupedByUrl = opportunities.reduce((acc, opp) => {
      if (!acc[opp.page]) acc[opp.page] = [];
      acc[opp.page].push(opp);
      return acc;
    }, {} as Record<string, typeof opportunities>);

    // Fetch metadata once per URL and structure the data
    const enrichedOpportunities = await Promise.all(
      Object.entries(groupedByUrl).map(async ([page, queries]) => {
        const urlToFetch = page.startsWith('http') ? page : `https://${SITE_URL.replace('sc-domain:', '')}${page}`;
        const metadata = await fetchCurrentMetadata(urlToFetch);
        return {
          url: urlToFetch,
          currentMetadata: metadata,
          missedQueries: queries.map(q => ({
            query: q.query,
            clicks: q.clicks,
            impressions: q.impressions,
            position: q.position,
            opportunityScore: q.opportunityScore
          }))
        };
      })
    );

    const siteMap = await getSiteMap(path.resolve(process.cwd(), 'app'));
    console.log(`Discovered ${siteMap.length} existing Next.js routes.`);

    const plan = await generateSeoRecommendations(enrichedOpportunities, siteMap);
    
    const outputPath = path.resolve(process.cwd(), 'seo-action-plan.json');
    await fs.writeFile(outputPath, JSON.stringify(plan, null, 2));
    
    console.log(`\nSuccess! SEO action plan generated at: ${outputPath}`);
    console.log("You can now pass this file to Claude Code or Antigravity to automatically execute the changes.");
  } catch (error) {
    console.error("Error running SEO optimization loop:", error);
  }
}

main();
