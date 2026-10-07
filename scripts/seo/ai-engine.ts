import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export const SeoActionSchema = z.object({
  sourceUrl: z.string().describe("The original URL from GSC that ranks for these queries."),
  targetUrl: z.string().describe("The actual URL to update or create. If the queries are in Hindi, this MUST be the /hi/ version of the URL. E.g., if sourceUrl is / and queries are Hindi, targetUrl must be /hi/"),
  targetQueries: z.array(z.string()).describe("The list of queries this specific action is designed to address"),
  actionType: z.enum(["NONE", "UPDATE_META", "ADD_SECTION", "CREATE_NEW_PAGE"]).describe("The strategic recommendation."),
  
  suggestedTitle: z.string().nullable().describe("If UPDATE_META: The improved meta title. MUST BE UNDER 60 CHARACTERS. Do not keyword stuff!"),
  suggestedDescription: z.string().nullable().describe("If UPDATE_META: The improved meta description (under 155 chars)."),
  
  suggestedSectionHeading: z.string().nullable().describe("If ADD_SECTION: The H2 heading for the new section."),
  suggestedSectionOutline: z.string().nullable().describe("If ADD_SECTION: A brief bulleted outline of what this section should cover."),
  
  suggestedNewPageUrl: z.string().nullable().describe("If CREATE_NEW_PAGE: The suggested URL slug (e.g., /epilepsy-treatment or /hi/migraine-treatment)."),
  suggestedNewPageTopic: z.string().nullable().describe("If CREATE_NEW_PAGE: The core topic and intent of the new page."),
  
  rationale: z.string().describe("Why this specific actionType was chosen over others.")
});

export const SeoPlanSchema = z.object({
  actions: z.array(SeoActionSchema)
});

export type SeoPlan = z.infer<typeof SeoPlanSchema>;

export async function generateSeoRecommendations(opportunities: any[], siteMap: string[]): Promise<SeoPlan> {
  const prompt = `
You are an analytical SEO Engine and Holistic Page Strategist. 
You are provided with a list of URLs. For each URL, you will receive its current metadata and an array of high-potential search queries it is currently ranking for based on Google Search Console data.

Existing Site Structure:
${JSON.stringify(siteMap, null, 2)}

Your Task:
Review all the queries for a given URL and formulate a cohesive strategy. DO NOT output contradictory actions. YOU MUST SPLIT distinct queries into MULTIPLE SEPARATE ACTIONS. Do not try to solve all queries with a single action!

CRITICAL RULES:
1. I18N SUPPORT: The website supports both English (default, e.g. \`/\`) and Hindi (prefixed with \`/hi\`, e.g. \`/hi/\`). 
   - If a query is in Hindi, you MUST create a separate action specifically for the Hindi version of the site. Set \`targetUrl\` to the \`/hi/\` equivalent of the \`sourceUrl\`. 
   - NEVER suggest updating an English URL's metadata with Hindi text.
2. TITLE LENGTH: Any \`suggestedTitle\` MUST be strictly under 60 characters to avoid truncation in Google Search. Be concise and focus on the primary intent. Do not keyword stuff.
3. SEPARATE DISTINCT INTENTS: If some queries are generic (e.g. "best neurologist") and some are about specific conditions (e.g. "epilepsy doctor", "migraine"), YOU MUST SPLIT THEM into separate actions!
   - Use "UPDATE_META" for the generic queries that match the page's core intent.
   - Use "CREATE_NEW_PAGE" for specific condition queries (e.g., suggest creating \`/epilepsy-treatment\`), because they represent fundamentally different medical conditions that deserve their own dedicated programmatic pages. Do not bloat the homepage with specific condition sections if they warrant their own page.
4. ADD_SECTION: Use this sparingly, only for highly relevant sub-topics that shouldn't be their own page but are missing from the current page content.
5. NONE: If a query is irrelevant or a typo (e.g., 'nas ka doctor' meaning ENT, while this is a neuro clinic), suggest "NONE".

Data:
${JSON.stringify(opportunities, null, 2)}

Return a JSON object containing an "actions" array. 
The JSON output MUST exactly match this format:
{
  "actions": [
    {
      "sourceUrl": "string",
      "targetUrl": "string",
      "targetQueries": ["string"],
      "actionType": "NONE" | "UPDATE_META" | "ADD_SECTION" | "CREATE_NEW_PAGE",
      "suggestedTitle": "string | null",
      "suggestedDescription": "string | null",
      "suggestedSectionHeading": "string | null",
      "suggestedSectionOutline": "string | null",
      "suggestedNewPageUrl": "string | null",
      "suggestedNewPageTopic": "string | null",
      "rationale": "string"
    }
  ]
}
  `;

  console.log("Analyzing opportunities with DeepSeek...");

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a precise, data-driven SEO analyzer. Output strictly valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");

  return JSON.parse(content) as SeoPlan;
}
