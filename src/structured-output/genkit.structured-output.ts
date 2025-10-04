import 'dotenv/config';
import fs from 'fs';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';
import { handleError } from '../utils';
import { SupportTicketSchema } from './ticket.schema';

async function main() {
  const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
    model: googleAI.model('gemini-2.5-flash'),
  });

  const emailInput = fs.readFileSync('src/structured-output/unstructured-input.txt', 'utf8');
  const prompt = `You are a bot that extracts structured data from support emails. Please extract the info from the following email into the provided schema:`;

  //See: https://genkit.dev/docs/models/#structured-output
  const response = await ai.generate({
    system: prompt,
    prompt: emailInput,
    output: { schema: SupportTicketSchema },
    config: {
      temperature: 0.8,
    },
  });

  const structuredData = JSON.parse(response.text);

  console.log(structuredData);
}

main().catch(handleError);
