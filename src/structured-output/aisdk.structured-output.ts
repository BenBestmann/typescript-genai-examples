import 'dotenv/config';
import fs from 'fs';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { handleError } from '../utils';
import { SupportTicketSchema } from './ticket.schema';

// See: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
async function main() {
  const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

  const emailInput = fs.readFileSync('src/structured-output/unstructured-input.txt', 'utf8');

  const response = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: SupportTicketSchema,
    prompt: [
      {
        role: 'system',
        content: `You are a bot that extracts structured data from support emails. Please extract the info from the following email into the provided schema:`,
      },
      { role: 'user', content: emailInput },
    ],
  });

  const structuredData = response.object;
  console.log(structuredData);
}

main().catch(handleError);
