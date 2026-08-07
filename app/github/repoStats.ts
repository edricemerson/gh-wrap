type GithubCommit = {
    sha?: string;
    commit?: {
        author?: { date?: string; name?: string };
        message?: string;
    };
    author?: { login?: string } | null;
};

type ContributorStats = {
    author?: { login?: string; avatar_url?: string };
    total?: number;
};

type PullRequest = {
    merged_at?: string | null;
};

export type RepoStats = {
    vitals: {
        name: string;
        fullName: string;
        description: string | null;
        stars: number;
        forks: number;
        watchers: number;
        sizeKb: number;
        createdAt: string;
        updatedAt: string;
        license: string | null;
        defaultBranch: string;
        primaryLanguage: string | null;
    };
    languages: {
        breakdown: { name: string; bytes: number; percent: number }[];
    };
    activity: {
        commitsSampled: number;
        mostActiveDay: string;
        peakHour: number;
        longestStreak: number;
        lastCommit: { message: string; date: string; sha: string; authorLogin: string | null } | null;
    };
    contributors: {
        top: { login: string; commits: number; avatarUrl: string | null }[];
    };
    issuesAndPRs: {
        openIssues: number;
        openPRs: number;
        closedPRsSampled: number;
        mergedPRsSampled: number;
        mergeRatePercent: number;
    };
    personality: {
        mostUsedWord: string | null;
        firstCommit: { message: string; date: string; sha: string; authorLogin: string | null } | null;
    };
};

const DAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const STOPWORDS = new Set([
    "the", "a", "an", "to", "for", "of", "and", "in", "on", "with", "is",
    "that", "this", "it", "as", "be", "at", "from", "by", "fix", "fixed",
    "fixes", "update", "updated", "add", "added", "adding", "remove",
    "removed", "initial", "commit", "merge", "branch", "into", "pull", "request",
]);

const MAX_COMMIT_PAGES = 3;

export class RateLimitError extends Error {
    constructor() {
        super("GitHub API rate limit exceeded");
        this.name = "RateLimitError";
    }
}

function isRateLimited(res: Response) {
    return res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0";
}

function ghFetch(url: string, accessToken?: string) {
    return fetch(url, {
        headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            Accept: "application/vnd.github+json",
        },
    });
}

function parseLocalDateParts(dateStr: string): { hour: number; dayOfWeek: number; dateOnly: string } {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);

    if (!match) {
        const fallback = new Date(dateStr);
        return {
            hour: fallback.getUTCHours(),
            dayOfWeek: fallback.getUTCDay(),
            dateOnly: dateStr.slice(0, 10),
        };
    }

    const [, year, month, day, hour] = match;
    const dayOfWeek = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
    ).getUTCDay();

    return { hour: Number(hour), dayOfWeek, dateOnly: `${year}-${month}-${day}` };
}

async function getFirstCommit(fullName: string, accessToken?: string): Promise<GithubCommit | null> {
    const res = await ghFetch(
        `https://api.github.com/repos/${fullName}/commits?per_page=1`,
        accessToken
    );
    if (!res.ok) return null;

    const link = res.headers.get("link");
    if (!link) {
        const data: GithubCommit[] = await res.json();
        return data[0] ?? null;
    }

    const match = link.match(/<([^>]+)>;\s*rel="last"/);
    if (!match) {
        const data: GithubCommit[] = await res.json();
        return data[0] ?? null;
    }

    const lastRes = await ghFetch(match[1], accessToken);
    if (!lastRes.ok) return null;

    const lastData: GithubCommit[] = await lastRes.json();
    return lastData[0] ?? null;
}

function toCommitSummary(c: GithubCommit | null): {
    message: string;
    date: string;
    sha: string;
    authorLogin: string | null;
} | null {
    if (!c) return null;
    return {
        message: c.commit?.message ?? "",
        date: c.commit?.author?.date ?? "",
        sha: c.sha ?? "",
        authorLogin: c.author?.login ?? c.commit?.author?.name ?? null,
    };
}

export async function computeRepoStats(
    accessToken: string | undefined,
    fullName: string
): Promise<RepoStats> {
    const [repoRes, languagesRes, contributorsRes, openPRsRes, closedPRsRes, firstCommit] =
        await Promise.all([
            ghFetch(`https://api.github.com/repos/${fullName}`, accessToken),
            ghFetch(`https://api.github.com/repos/${fullName}/languages`, accessToken),
            ghFetch(`https://api.github.com/repos/${fullName}/stats/contributors`, accessToken),
            ghFetch(`https://api.github.com/repos/${fullName}/pulls?state=open&per_page=100`, accessToken),
            ghFetch(`https://api.github.com/repos/${fullName}/pulls?state=closed&per_page=100`, accessToken),
            getFirstCommit(fullName, accessToken),
        ]);

    if (isRateLimited(repoRes)) {
        throw new RateLimitError();
    }

    const repoData = repoRes.ok ? await repoRes.json() : {};
    const languagesData: Record<string, number> = languagesRes.ok ? await languagesRes.json() : {};
    const contributorsData: unknown = contributorsRes.ok ? await contributorsRes.json() : [];
    const openPRs: unknown[] = openPRsRes.ok ? await openPRsRes.json() : [];
    const closedPRsRaw: unknown[] = closedPRsRes.ok ? await closedPRsRes.json() : [];
    const closedPRs = closedPRsRaw as PullRequest[];

    const totalBytes = Object.values(languagesData).reduce((a, b) => a + b, 0);
    const breakdown = Object.entries(languagesData)
        .sort((a, b) => b[1] - a[1])
        .map(([name, bytes]) => ({
            name,
            bytes,
            percent: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
        }));

    const dayCounts = new Array(7).fill(0);
    const hourCounts = new Array(24).fill(0);
    const commitDates = new Set<string>();
    const wordCounts: Record<string, number> = {};
    let commitsSampled = 0;
    let lastCommit: { message: string; date: string; sha: string; authorLogin: string | null } | null = null;

    let page = 1;
    for (let i = 0; i < MAX_COMMIT_PAGES; i++) {
        const commitsRes = await ghFetch(
            `https://api.github.com/repos/${fullName}/commits?per_page=100&page=${page}`,
            accessToken
        );
        if (!commitsRes.ok) break;

        const commits: GithubCommit[] = await commitsRes.json();
        if (commits.length === 0) break;

        for (const c of commits) {
            const dateStr = c.commit?.author?.date;
            const message = c.commit?.message ?? "";

            if (dateStr) {
                const { hour, dayOfWeek, dateOnly } = parseLocalDateParts(dateStr);
                dayCounts[dayOfWeek]++;
                hourCounts[hour]++;
                commitDates.add(dateOnly);
            }

            if (!lastCommit) {
                lastCommit = toCommitSummary(c);
            }

            commitsSampled++;

            const lower = message.toLowerCase();
            for (const word of lower.split(/[^a-z0-9']+/)) {
                if (word.length > 2 && !STOPWORDS.has(word)) {
                    wordCounts[word] = (wordCounts[word] ?? 0) + 1;
                }
            }
        }

        if (commits.length < 100) break;
        page++;
    }

    const mostActiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    const sortedDates = Array.from(commitDates).sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;

    for (const dateStr of sortedDates) {
        const d = new Date(`${dateStr}T00:00:00Z`);
        if (prevDate) {
            const diffDays = Math.round((d.getTime() - prevDate.getTime()) / 86400000);
            currentStreak = diffDays === 1 ? currentStreak + 1 : 1;
        } else {
            currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        prevDate = d;
    }

    const mostUsedWord =
        Object.entries(wordCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const topContributors = Array.isArray(contributorsData)
        ? (contributorsData as ContributorStats[])
            .filter((c) => c.author?.login)
            .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
            .slice(0, 5)
            .map((c) => ({
                login: c.author!.login as string,
                commits: c.total ?? 0,
                avatarUrl: c.author?.avatar_url ?? null,
            }))
        : [];

    const mergedPRs = closedPRs.filter((p) => !!p.merged_at);
    const mergeRatePercent = closedPRs.length
        ? Math.round((mergedPRs.length / closedPRs.length) * 100)
        : 0;
    const openIssues = Math.max(0, (repoData.open_issues_count ?? 0) - openPRs.length);

    return {
        vitals: {
            name: repoData.name ?? fullName.split("/")[1] ?? fullName,
            fullName,
            description: repoData.description ?? null,
            stars: repoData.stargazers_count ?? 0,
            forks: repoData.forks_count ?? 0,
            watchers: repoData.subscribers_count ?? repoData.watchers_count ?? 0,
            sizeKb: repoData.size ?? 0,
            createdAt: repoData.created_at ?? "",
            updatedAt: repoData.updated_at ?? repoData.pushed_at ?? "",
            license: repoData.license?.name ?? null,
            defaultBranch: repoData.default_branch ?? "main",
            primaryLanguage: repoData.language ?? null,
        },
        languages: { breakdown },
        activity: {
            commitsSampled,
            mostActiveDay: DAY_NAMES[mostActiveDayIndex] ?? "Unknown",
            peakHour,
            longestStreak,
            lastCommit,
        },
        contributors: { top: topContributors },
        issuesAndPRs: {
            openIssues,
            openPRs: openPRs.length,
            closedPRsSampled: closedPRs.length,
            mergedPRsSampled: mergedPRs.length,
            mergeRatePercent,
        },
        personality: {
            mostUsedWord,
            firstCommit: toCommitSummary(firstCommit),
        },
    };
}
