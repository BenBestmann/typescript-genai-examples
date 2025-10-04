import 'dotenv/config';
import { handleError } from '../utils';
import { z } from 'zod';
import { generateText, stepCountIs, tool } from 'ai';
import { fetchGitHubRepoStats } from './fetch-repo-stats';
import { GitHubRepoStatsSchema } from './repo.schema';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// See: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
async function main() {
  const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

  const gitRepoStatsTool = tool({
    description: 'Get the stats of a GitHub repository',
    outputSchema: GitHubRepoStatsSchema,
    inputSchema: z.object({
      repoName: z.string().describe('The name of the repository in the format "owner/repo"'),
    }),
    execute: async ({ repoName }) => {
      const [owner, repo] = repoName.split('/');
      return fetchGitHubRepoStats(owner, repo);
    },
  });

  const result = await generateText({
    model: google('gemini-2.5-flash'),
    tools: { gitRepoStatsTool },
    system: `You are a helpful assistant that can answer questions about GitHub repositories.`,
    prompt: 'Which repository is more popluar, "vercel/ai" or "langchain-ai/langchainjs"?',
    stopWhen: stepCountIs(2), // allow model to call tools (step 1) and then compare and return the result (step 2)
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      console.log(text, toolCalls, toolResults, finishReason, usage);
    },
  });

  console.log(result.text);
}

main().catch(handleError);
