type RepoLite = {
    name: string;
    full_name: string;
    fork: boolean;
    stargazers_count?: number;
    created_at?: string;
    pushed_at?: string;
};

type GithubCommit = {
    commit?: {
        author?: { date?: string };
        message?: string;
    };
};

type ContributorStats = {
    author?: { login?: string };
    weeks?: { w: number; a: number; d: number }[];
};

type StarredRepo = {
    language?: string | null;
    owner?: { login?: string };
};

export type WrapStats = {
    languages: {
        topLanguages: { name: string; bytes: number; percent: number }[];
        mostPolyglotRepo: { name: string; count: number } | null;
        oneHitWonders: string[];
    };
    personality: {
        totalCommits: number;
        mostActiveDay: string;
        peakHour: number;
        chronotype: string;
        longestStreak: number;
        mostUsedWord: string | null;
        avgMessageLength: number;
        fixCount: number;
        wipCount: number;
        oopsCount: number;
        longestMessage: string;
    };
    volume: {
        totalCommits: number;
        totalRepos: number;
        totalLanguages: number;
        totalAdditions: number;
        totalDeletions: number;
        longestStreak: number;
    };
    highlights: {
        mostStarredRepo: { name: string; stars: number } | null;
        babyRepo: { name: string; commits: number } | null;
        newestRepo: { name: string; createdAt: string } | null;
        totalStars: number;
        graveyardCount: number;
        graveyardRepos: string[];
    };
    archetype: {
        primary: { title: string; description: string };
        secondary: { title: string; description: string } | null;
    };
    social: {
        followers: number;
        mostStarredOwner: { login: string; count: number } | null;
        topStarredLanguages: { name: string; percent: number }[];
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

const FRONTEND_LANGS = new Set(["HTML", "CSS", "Vue", "Svelte"]);
const BACKEND_LANGS = new Set([
    "Python", "Java", "Go", "Ruby", "PHP", "C#", "Rust", "Kotlin",
    "C", "C++", "Elixir", "Scala", "Perl", "Haskell", "Clojure",
]);

const MAX_REPOS = 30;
const CONCURRENCY = 5;
const MAX_COMMIT_PAGES = 5;
const GRAVEYARD_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 2;

function ghFetch(url: string, accessToken: string) {
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
        },
    });
}

async function mapWithConcurrency<T>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<void>
): Promise<void> {
    let index = 0;

    async function worker() {
        while (index < items.length) {
            const current = index++;
            await fn(items[current]);
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, worker)
    );
}

function determineArchetype(input: {
    totalCommits: number;
    topRepoShare: number;
    reposCreatedThisYear: number;
    avgCommitsPerActiveRepo: number;
    markdownPercent: number;
    totalLanguages: number;
    chronotype: string;
    fullstackRepoCount: number;
    fullstackShare: number;
}): {
    primary: { title: string; description: string };
    secondary: { title: string; description: string } | null;
} {
    const {
        totalCommits, topRepoShare, reposCreatedThisYear,
        avgCommitsPerActiveRepo, markdownPercent, totalLanguages, chronotype,
        fullstackRepoCount, fullstackShare,
    } = input;

    const candidates: { title: string; description: string }[] = [];

    if (totalCommits > 10 && topRepoShare >= 0.6) {
        candidates.push({
            title: "The Monogamist",
            description: "One repo, your whole heart. Most of your commits this year went to a single project.",
        });
    }
    if (reposCreatedThisYear >= 3 && avgCommitsPerActiveRepo > 0 && avgCommitsPerActiveRepo < 5) {
        candidates.push({
            title: "The Serial Starter",
            description: "Lots of new repos, light follow-through. You love a fresh idea more than finishing the last one.",
        });
    }
    if (markdownPercent >= 15) {
        candidates.push({
            title: "The Documentarian",
            description: "Docs and READMEs make up a real chunk of your work. Future-you (and everyone else) says thanks.",
        });
    }
    if (fullstackRepoCount >= 2 && fullstackShare >= 0.5) {
        candidates.push({
            title: "The Full-Stacker",
            description: "Most of your repos mix frontend and backend in the same place. You build the whole thing, top to bottom.",
        });
    }
    if (totalLanguages >= 6) {
        candidates.push({
            title: "The Polyglot",
            description: `Six or more languages across your repos this year. You don't stick to one toolbox.`,
        });
    }
    if (chronotype === "Night Owl") {
        candidates.push({
            title: "The Night Owl",
            description: "Most of your commits land late at night. The best code apparently happens after midnight.",
        });
    }

    if (candidates.length === 0) {
        candidates.push({
            title: "The Builder",
            description: "Steady, consistent output across the year. No single gimmick — just showing up and shipping.",
        });
    }

    return {
        primary: candidates[0],
        secondary: candidates[1] ?? null,
    };
}

export async function computeWrapStats(
    accessToken: string,
    allRepos: RepoLite[]
): Promise<WrapStats> {
    const repos = allRepos.filter((r) => !r.fork).slice(0, MAX_REPOS);

    const [userRes, starredRes] = await Promise.all([
        ghFetch("https://api.github.com/user", accessToken),
        ghFetch("https://api.github.com/user/starred?per_page=100", accessToken),
    ]);

    const userData = userRes.ok ? await userRes.json() : null;
    const login: string | undefined = userData?.login;
    const followers: number = userData?.followers ?? 0;

    const starredRepos: StarredRepo[] = starredRes.ok ? await starredRes.json() : [];

    const now = new Date();
    const year = now.getUTCFullYear();
    const sinceISO = `${year}-01-01T00:00:00Z`;
    const untilISO = `${year}-12-31T23:59:59Z`;
    const yearStart = Date.UTC(year, 0, 1) / 1000;
    const yearEnd = Date.UTC(year + 1, 0, 1) / 1000;

    const languageBytes: Record<string, number> = {};
    const languageRepoCount: Record<string, number> = {};
    let mostPolyglotRepo: { name: string; count: number } | null = null;

    const dayCounts = new Array(7).fill(0);
    const hourCounts = new Array(24).fill(0);
    const commitDates = new Set<string>();
    const wordCounts: Record<string, number> = {};
    const commitsByRepo: Record<string, number> = {};
    let totalCommits = 0;
    let totalMessageLength = 0;
    let longestMessage = "";
    let fixCount = 0;
    let wipCount = 0;
    let oopsCount = 0;
    let totalAdditions = 0;
    let totalDeletions = 0;
    let fullstackRepoCount = 0;

    await mapWithConcurrency(repos, CONCURRENCY, async (repo) => {
        const [languagesRes, contributorsRes] = await Promise.all([
            ghFetch(`https://api.github.com/repos/${repo.full_name}/languages`, accessToken),
            login
                ? ghFetch(`https://api.github.com/repos/${repo.full_name}/stats/contributors`, accessToken)
                : Promise.resolve(null),
        ]);

        if (languagesRes.ok) {
            const data: Record<string, number> = await languagesRes.json();
            const distinct = Object.keys(data).length;

            if (!mostPolyglotRepo || distinct > mostPolyglotRepo.count) {
                mostPolyglotRepo = { name: repo.name, count: distinct };
            }

            const langNames = Object.keys(data);
            const hasFrontend = langNames.some((l) => FRONTEND_LANGS.has(l));
            const hasBackend = langNames.some((l) => BACKEND_LANGS.has(l));
            if (hasFrontend && hasBackend) {
                fullstackRepoCount++;
            }

            for (const [lang, bytes] of Object.entries(data)) {
                languageBytes[lang] = (languageBytes[lang] ?? 0) + bytes;
                languageRepoCount[lang] = (languageRepoCount[lang] ?? 0) + 1;
            }
        }

        if (contributorsRes?.ok) {
            const data: ContributorStats[] = await contributorsRes.json();
            const mine = data.find((c) => c.author?.login === login);

            for (const week of mine?.weeks ?? []) {
                if (week.w >= yearStart && week.w < yearEnd) {
                    totalAdditions += week.a ?? 0;
                    totalDeletions += week.d ?? 0;
                }
            }
        }

        if (!login) return;

        let page = 1;
        for (let i = 0; i < MAX_COMMIT_PAGES; i++) {
            const commitsRes = await ghFetch(
                `https://api.github.com/repos/${repo.full_name}/commits?author=${login}&since=${sinceISO}&until=${untilISO}&per_page=100&page=${page}`,
                accessToken
            );
            if (!commitsRes.ok) break;

            const commits: GithubCommit[] = await commitsRes.json();
            if (commits.length === 0) break;

            for (const c of commits) {
                const dateStr = c.commit?.author?.date;
                const message = c.commit?.message ?? "";

                if (dateStr) {
                    const d = new Date(dateStr);
                    dayCounts[d.getUTCDay()]++;
                    hourCounts[d.getUTCHours()]++;
                    commitDates.add(dateStr.slice(0, 10));
                }

                totalCommits++;
                commitsByRepo[repo.name] = (commitsByRepo[repo.name] ?? 0) + 1;
                totalMessageLength += message.length;
                if (message.length > longestMessage.length) longestMessage = message;

                const lower = message.toLowerCase();
                if (lower.includes("fix")) fixCount++;
                if (lower.includes("wip")) wipCount++;
                if (lower.includes("oops")) oopsCount++;

                for (const word of lower.split(/[^a-z0-9']+/)) {
                    if (word.length > 2 && !STOPWORDS.has(word)) {
                        wordCounts[word] = (wordCounts[word] ?? 0) + 1;
                    }
                }
            }

            if (commits.length < 100) break;
            page++;
        }
    });

    const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(languageBytes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percent: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
        }));
    const oneHitWonders = Object.entries(languageRepoCount)
        .filter(([, count]) => count === 1)
        .map(([name]) => name);

    const mostActiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const chronotype =
        peakHour >= 22 || peakHour < 5
            ? "Night Owl"
            : peakHour >= 5 && peakHour < 10
                ? "Early Bird"
                : "Steady Coder";

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

    // --- Repo highlights ---
    let mostStarredRepo: { name: string; stars: number } | null = null;
    let newestRepo: { name: string; createdAt: string } | null = null;
    let totalStars = 0;
    const graveyardRepos: string[] = [];

    for (const repo of repos) {
        const stars = repo.stargazers_count ?? 0;
        totalStars += stars;

        if (!mostStarredRepo || stars > mostStarredRepo.stars) {
            mostStarredRepo = { name: repo.name, stars };
        }

        if (repo.created_at) {
            if (!newestRepo || repo.created_at > newestRepo.createdAt) {
                newestRepo = { name: repo.name, createdAt: repo.created_at };
            }
        }

        if (repo.created_at && repo.pushed_at) {
            const created = new Date(repo.created_at).getTime();
            const pushed = new Date(repo.pushed_at).getTime();
            if (pushed - created < GRAVEYARD_THRESHOLD_MS) {
                graveyardRepos.push(repo.name);
            }
        }
    }

    const babyRepoEntry = Object.entries(commitsByRepo).sort((a, b) => b[1] - a[1])[0];
    const babyRepo = babyRepoEntry ? { name: babyRepoEntry[0], commits: babyRepoEntry[1] } : null;

    // --- Archetype ---
    const reposCreatedThisYear = repos.filter(
        (r) => r.created_at && new Date(r.created_at).getUTCFullYear() === year
    ).length;
    const activeRepoCount = Object.keys(commitsByRepo).length;
    const avgCommitsPerActiveRepo = activeRepoCount ? totalCommits / activeRepoCount : 0;
    const topRepoShare = totalCommits && babyRepo ? babyRepo.commits / totalCommits : 0;
    const markdownPercent = totalBytes
        ? Math.round(((languageBytes["Markdown"] ?? 0) / totalBytes) * 100)
        : 0;

    const fullstackShare = repos.length ? fullstackRepoCount / repos.length : 0;

    const archetype = determineArchetype({
        totalCommits,
        topRepoShare,
        reposCreatedThisYear,
        avgCommitsPerActiveRepo,
        markdownPercent,
        totalLanguages: Object.keys(languageBytes).length,
        chronotype,
        fullstackRepoCount,
        fullstackShare,
    });

    // --- Social layer ---
    const starredOwnerCount: Record<string, number> = {};
    const starredLanguageCount: Record<string, number> = {};

    for (const starred of starredRepos) {
        const owner = starred.owner?.login;
        if (owner) starredOwnerCount[owner] = (starredOwnerCount[owner] ?? 0) + 1;

        if (starred.language) {
            starredLanguageCount[starred.language] = (starredLanguageCount[starred.language] ?? 0) + 1;
        }
    }

    const mostStarredOwnerEntry = Object.entries(starredOwnerCount).sort((a, b) => b[1] - a[1])[0];
    const mostStarredOwner = mostStarredOwnerEntry
        ? { login: mostStarredOwnerEntry[0], count: mostStarredOwnerEntry[1] }
        : null;

    const totalStarredWithLanguage = Object.values(starredLanguageCount).reduce((a, b) => a + b, 0);
    const topStarredLanguages = Object.entries(starredLanguageCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({
            name,
            percent: totalStarredWithLanguage ? Math.round((count / totalStarredWithLanguage) * 100) : 0,
        }));

    return {
        languages: {
            topLanguages,
            mostPolyglotRepo,
            oneHitWonders,
        },
        personality: {
            totalCommits,
            mostActiveDay: DAY_NAMES[mostActiveDayIndex] ?? "Unknown",
            peakHour,
            chronotype,
            longestStreak,
            mostUsedWord,
            avgMessageLength: totalCommits ? Math.round(totalMessageLength / totalCommits) : 0,
            fixCount,
            wipCount,
            oopsCount,
            longestMessage,
        },
        volume: {
            totalCommits,
            totalRepos: repos.length,
            totalLanguages: Object.keys(languageBytes).length,
            totalAdditions,
            totalDeletions,
            longestStreak,
        },
        highlights: {
            mostStarredRepo,
            babyRepo,
            newestRepo,
            totalStars,
            graveyardCount: graveyardRepos.length,
            graveyardRepos: graveyardRepos.slice(0, 3),
        },
        archetype,
        social: {
            followers,
            mostStarredOwner,
            topStarredLanguages,
        },
    };
}
