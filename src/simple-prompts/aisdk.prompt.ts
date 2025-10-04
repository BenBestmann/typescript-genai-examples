import 'dotenv/config';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { handleError } from '../utils';

async function main() {
  const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await generateText({
    model: google('gemini-2.5-flash'),
    system: 'You are an AI tutor for developers. Please answer the question in a concise manner.',
    prompt: 'What is a prompt?',
  });

  console.log(response.text);
}

main().catch(handleError);
