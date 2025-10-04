import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { handleError } from '../utils';

async function main() {
  const ai = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
  });

  const messages = [
    new SystemMessage(
      'You are an AI tutor for developers. Please answer the question in a concise manner.'
    ),
    new HumanMessage('What is a prompt?'),
  ];

  const response = await ai.invoke(messages);

  console.log(response.content);
}

main().catch(handleError);
