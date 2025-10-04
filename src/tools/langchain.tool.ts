import 'dotenv/config';
import z from 'zod';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { tool } from '@langchain/core/tools';
import { handleError } from '../utils';
import { fetchGitHubRepoStats } from './fetch-repo-stats';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

// This version uses LangGraph to automatically handle the tool execution loop
// See: https://langchain-ai.github.io/langgraphjs/
async function main() {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.8,
  });

  const gitRepoStatsTool = tool(
    ({ repoName }) => {
      const [owner, repo] = repoName.split('/');
      return fetchGitHubRepoStats(owner, repo);
    },
    {
      name: 'getGitHubRepoStats',
      description: 'Gets statistics and information about a GitHub repository',
      schema: z.object({
        repoName: z
          .string()
          .describe('The repository name in the format "owner/repo" (e.g., "facebook/react")'),
      }),
    }
  );

  // Create a ReAct agent that automatically handles the tool execution loop
  const agent = createReactAgent({
    llm: model,
    tools: [gitRepoStatsTool],
    prompt: 'You are a helpful assistant that can answer questions about GitHub repositories.',
  });

  // The agent will automatically handle the tool execution loop
  const result = await agent.invoke({
    messages: [
      {
        role: 'user',
        content: 'Which repository is more popluar, "vercel/ai" or "langchain-ai/langchainjs"?',
      },
    ],
  });

  // Get the final message from the agent
  const finalMessage = result.messages[result.messages.length - 1];
  console.log(finalMessage.content);
}

main().catch(handleError);
