import { GitHubRepoStats, GitHubRepoStatsSchema } from './repo.schema';

export async function fetchGitHubRepoStats(owner: string, repo: string): Promise<GitHubRepoStats> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch repo stats: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return GitHubRepoStatsSchema.parse(data) as GitHubRepoStats;
}
