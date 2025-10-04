import 'dotenv/config';
import fs from 'fs';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { handleError } from '../utils';
import { SupportTicketSchema } from './ticket.schema';

// See: https://js.langchain.com/docs/concepts/structured_outputs/
async function main() {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.8,
  });

  const modelWithStructuredOutput = model.withStructuredOutput(SupportTicketSchema);
  const emailInput = fs.readFileSync('src/structured-output/unstructured-input.txt', 'utf8');

  const messages = [
    new SystemMessage(
      'You are a bot that extracts structured data from support emails. Please extract the info from the following email into the provided schema:'
    ),
    new HumanMessage(emailInput),
  ];

  const structuredData = await modelWithStructuredOutput.invoke(messages);

  console.log(structuredData);
}

main().catch(handleError);
