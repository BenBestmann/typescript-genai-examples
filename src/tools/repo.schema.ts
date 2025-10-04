import { z } from 'zod';

export const GitHubRepoStatsSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().optional(),
  stargazers_count: z.number(),
  forks: z.number(),
  open_issues: z.number(),
  watchers: z.number(),
  created_at: z.string(),
});

export type GitHubRepoStats = z.infer<typeof GitHubRepoStatsSchema>;
