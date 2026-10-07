import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define the interface for our normalized GSC row
export interface GscRow {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function fetchGscData(
  startDate: string,
  endDate: string,
  siteUrl: string
): Promise<GscRow[]> {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in .env.local');
  }

  // Format private key (sometimes newlines get escaped in env vars)
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  console.log(`Fetching GSC data for ${siteUrl} from ${startDate} to ${endDate}...`);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit: 500, // Top 500 queries/pages
    },
  });

  const rows = res.data.rows || [];

  return rows.map((row) => ({
    query: row.keys?.[0] || '',
    page: row.keys?.[1] || '',
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

// Expected CTR curve for positions 1-10 (estimates)
const CTR_CURVE: Record<number, number> = {
  1: 0.30, 2: 0.15, 3: 0.10, 4: 0.07, 5: 0.05, 
  6: 0.04, 7: 0.03, 8: 0.02, 9: 0.015, 10: 0.01
};

function getExpectedCtr(position: number): number {
  const roundedPos = Math.round(position);
  if (roundedPos < 1) return 0.30;
  if (roundedPos > 10) return 0.005;
  return CTR_CURVE[roundedPos] || 0.01;
}

export interface Opportunity extends GscRow {
  opportunityScore: number;
}

export function identifyOpportunities(rows: GscRow[]): Opportunity[] {
  const scored = rows.map(row => {
    const expectedCtr = getExpectedCtr(row.position);
    const expectedClicks = row.impressions * expectedCtr;
    const missedClicks = Math.max(0, expectedClicks - row.clicks);
    
    return {
      ...row,
      opportunityScore: missedClicks
    };
  });

  // 1. Filter out pure navigational/brand queries 
  // (We shouldn't optimize meta tags for queries like "palamu-neuro-care" where intent is just to find the homepage)
  const nonBrand = scored.filter(row => {
    const q = row.query.toLowerCase();
    return !q.includes('palamu-neuro-care') && !q.includes('neuro');
  });

  // 2. Identify real gaps: 
  // - The page must be ranking reasonably well (Position <= 30) OR have decent volume (Impressions >= 10)
  // - The actual CTR is significantly lower than expected CTR
  const opportunities = nonBrand.filter(row => 
    (row.position <= 30 || row.impressions >= 10) && 
    (row.ctr < getExpectedCtr(row.position) * 0.5) // Less than half of expected CTR
  );
  
  // 3. Sort by missed clicks, but for low-traffic sites, impressions dominate
  return opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore || b.impressions - a.impressions).slice(0, 10);
}
