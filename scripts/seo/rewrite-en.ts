import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

async function rewriteSection(sectionName: string, sectionData: any): Promise<any> {
  const prompt = `
You are an expert medical copywriter. Your task is to rewrite the provided JSON content for a clinic named "Palamu Neuro & Eye Care".
The tone should be professional, approachable, regional (Jharkhand, Bihar, Chhattisgarh, West Bengal), and 100% unique from generic templates.
Do NOT change any JSON keys, array structures, or nesting. ONLY rewrite the string values.
CRITICAL RULES:
1. Preserve all placeholders exactly as they are (e.g., {count}, {clinicName}, <highlight>...</highlight>).
2. Do not change the JSON structure or key names.
3. Keep the content length roughly similar to the original.
4. The output must be valid JSON matching the exact structure of the input.

Input JSON for section "${sectionName}":
${JSON.stringify(sectionData, null, 2)}
`;

  console.log(`Rewriting section: ${sectionName}...`);

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a precise JSON transformation engine. Output strictly valid JSON without any markdown formatting wrappers." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");

  return JSON.parse(content);
}

async function main() {
  const enFilePath = path.resolve(process.cwd(), 'messages/en.json');
  const enFileContent = await fs.readFile(enFilePath, 'utf-8');
  const enData = JSON.parse(enFileContent);

  const sectionsToRewrite = [
    'homepage',
    'gallery',
    'videos',
    'doctors',
    'pages.neurology',
    'pages.ophthalmology',
    'sections.hero',
    'sections.services',
    'sections.doctors',
    'sections.benefits',
    'sections.faq'
  ];

  for (const sectionPath of sectionsToRewrite) {
    const keys = sectionPath.split('.');
    let target = enData;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    const lastKey = keys[keys.length - 1];

    if (target[lastKey]) {
      try {
        const rewrittenData = await rewriteSection(sectionPath, target[lastKey]);
        target[lastKey] = rewrittenData;
        console.log(`Successfully rewritten ${sectionPath}`);
      } catch (e) {
        console.error(`Failed to rewrite ${sectionPath}:`, e);
      }
    }
  }

  await fs.writeFile(enFilePath, JSON.stringify(enData, null, 2), 'utf-8');
  console.log('Successfully updated messages/en.json');
}

main().catch(console.error);
