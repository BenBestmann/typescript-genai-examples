import 'dotenv/config';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';
import { handleError } from '../utils';

// See: https://genkit.dev/docs/models/#the-generate-method
async function main() {
  const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
    model: googleAI.model('gemini-2.5-flash'),
  });

  const response = await ai.generate({
    system: 'You are an AI tutor for developers. Please answer the question in a concise manner.',
    prompt: 'What is a prompt?',
    config: {
      temperature: 0.8,
    },
  });

  console.log(response.text);
}

main().catch(handleError);
