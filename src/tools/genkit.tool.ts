import 'dotenv/config';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { handleError } from '../utils';
import { GitHubRepoStatsSchema } from './repo.schema';
import { fetchGitHubRepoStats } from './fetch-repo-stats';

async function main() {
  const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
    model: googleAI.model('gemini-2.5-flash'),
  });

  const gitRepoStatsTool = ai.defineTool(
    {
      name: 'getGitHubRepoStats',
      description: 'Gets statistics and information about a GitHub repository',
      inputSchema: z.object({
        repoName: z
          .string()
          .describe('The repository name in the format "owner/repo" (e.g., "facebook/react")'),
      }),
      outputSchema: GitHubRepoStatsSchema,
    },
    async (input) => {
      const [owner, repo] = input.repoName.split('/');
      return fetchGitHubRepoStats(owner, repo);
    }
  );

  const result = await ai.generate({
    system: 'You are a helpful assistant that can answer questions about GitHub repositories.',
    prompt: 'Which repository is more popluar, "vercel/ai" or "langchain-ai/langchainjs"?',
    tools: [gitRepoStatsTool],
  });

  console.log(result.text);
}

main().catch(handleError);
