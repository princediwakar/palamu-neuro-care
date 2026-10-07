import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'lib/seo-pages/data');
const langs = ['en', 'hi'];

function updateFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let data = JSON.parse(content);
  
  let modified = false;

  const genericEnAddress = "Palamu Neuro & Eye Care, Sitakunj Police Line Road, Hamidganj, Medininagar, Palamu, Jharkhand 822102.";
  const genericHiAddress = "पलामू न्यूरो एंड आई केयर, सीताकुंज पुलिस लाइन रोड, हमीदगंज, मेदिनीनगर, पलामू, झारखंड 822102।";

  for (const page of data) {
    // 1. Update travelInfo if it exists
    if (page.travelInfo) {
      if (filePath.includes('/en/')) {
        page.travelInfo = `Palamu Neuro & Eye Care is centrally located in Medininagar, making it easily accessible for patients from surrounding districts via regular bus and train services. Clinic address: ${genericEnAddress}`;
      } else {
        page.travelInfo = `पलामू न्यूरो एंड आई केयर मेदिनीनगर में स्थित है, जिससे यह आसपास के जिलों के मरीजों के लिए बस और ट्रेन सेवाओं के माध्यम से आसानी से सुलभ है। क्लिनिक का पता: ${genericHiAddress}`;
      }
      modified = true;
    }

    // 2. Update FAQs containing directions or distances
    if (page.faqs) {
      for (const faq of page.faqs) {
        const lowerAnswer = faq.answer.toLowerCase();
        // Identify answers that look like travel directions (contain km, hours, road, trains, etc.)
        // Or if they contain the old DCB Bank address
        if (lowerAnswer.includes('km ') || lowerAnswer.includes('hours by road') || lowerAnswer.includes('trains connect') || lowerAnswer.includes('dcb bank')) {
          if (filePath.includes('/en/')) {
            faq.answer = `Our clinic is conveniently located in Medininagar, Palamu, and is well-connected by road and rail to neighboring districts. Regular buses and trains serve the area. The clinic is located at ${genericEnAddress} Please call 7779897207 to book your appointment in advance so we can guide you on the best route.`;
          } else {
            faq.answer = `हमारा क्लिनिक मेदिनीनगर, पलामू में सुविधाजनक रूप से स्थित है, और पड़ोसी जिलों से सड़क और रेल मार्ग द्वारा अच्छी तरह से जुड़ा हुआ है। क्लिनिक का पता है: ${genericHiAddress} कृपया अग्रिम रूप से अपनी नियुक्ति बुक करने के लिए 7779897207 पर कॉल करें ताकि हम आपको सर्वोत्तम मार्ग पर मार्गदर्शन कर सकें।`;
          }
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.json')) {
      updateFile(fullPath);
    }
  }
}

langs.forEach(lang => {
  const langDir = path.join(dataDir, lang);
  if (fs.existsSync(langDir)) {
    processDirectory(langDir);
  }
});
