"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import AchievementsCard from "./modalPage/achievement";
import YourArchetypeCard from "./modalPage/yourArchetype";
import RepoHighlightsCard from "./modalPage/repoHigh";
import VolumeCard from "./modalPage/volume";
import CommitPersonaCard from "./modalPage/commitPersona";
import TopLanguageCard from "./modalPage/topLang";
import RepoDashboard from "./repoDashboard";
import RateLimitToast from "./rateLimitToast";
import type { RepoStats } from "../../github/repoStats";

type Repo = {
    id: number;
    name: string;
    full_name: string;
};

type User = {
    name?: string | null;
    image?: string | null;
};

type WrapStats = {
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
        lastCommit: { message: string; date: string; repoName: string; fullName: string; sha: string } | null;
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
        mostStarredRepo: { name: string; fullName: string; stars: number } | null;
        babyRepo: { name: string; fullName: string; commits: number } | null;
        newestRepo: { name: string; fullName: string; createdAt: string } | null;
        totalStars: number;
        graveyardCount: number;
        graveyardRepos: { name: string; fullName: string }[];
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

export default function Ghpage({
    repos,
    user,
    stats,
}: {
    repos: Repo[];
    user?: User;
    stats: WrapStats | null;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [view, setView] = useState<"wrap" | "repo">("wrap");
    const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
    const [loadingRepo, setLoadingRepo] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);

    const filteredRepos = repos.filter((repo) =>
        repo.full_name.toLowerCase().includes(query.toLowerCase())
    );

    const selectedRepo = repos.find((repo) => repo.id === selected) ?? null;

    async function handleContinue() {
        if (!selectedRepo) return;

        setView("repo");
        setLoadingRepo(true);
        setRepoStats(null);

        try {
            const res = await fetch(
                `/api/repo-stats?repo=${encodeURIComponent(selectedRepo.full_name)}`
            );
            if (res.ok) {
                setRepoStats(await res.json());
            } else if (res.status === 429) {
                setRateLimited(true);
                setView("wrap");
            } else {
                console.error("Failed to fetch repo stats:", res.status);
            }
        } catch (err) {
            console.error("Failed to fetch repo stats:", err);
        } finally {
            setLoadingRepo(false);
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* LEFT SECTION */}
            <div className="flex flex-col items-start bg-gray-900 px-8 py-6 w-96 h-screen animate-slide-in-left">
                <div className="flex items-center gap-3 mb-4">
                    {user?.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.image}
                            alt={user.name ?? "GitHub avatar"}
                            className="h-15 w-15 rounded-full"
                        />
                    )}
                    <div className="text-white font-medium text-2xl">
                        Welcome, {user?.name ?? "there"}
                    </div>
                </div>
                <div className="flex items-center justify-between w-full mb-4">
                    <div className="text-xl font-semibold text-white">
                        Choose your repo
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Sign out
                    </button>
                </div>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repos..."
                    className="bg-black border border-gray-700 w-full h-8 text-white placeholder-gray-500 px-2 mb-3 rounded-md focus:outline-none focus:border-gray-500 transition-colors duration-300"
                />
                <div className="flex flex-col gap-2 overflow-y-auto w-full flex-1 themed-scrollbar">
                    {filteredRepos.length === 0 && (
                        <div className="text-gray-400 text-sm">
                            No repositories found.
                        </div>
                    )}
                    {filteredRepos.map((repo) => (
                        <button
                            key={repo.id}
                            onClick={() => setSelected(repo.id)}
                            className={`text-left px-3 py-2 rounded-md transition-colors duration-300 ${selected === repo.id
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:bg-gray-800"
                                }`}
                        >
                            {repo.full_name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleContinue}
                    disabled={selected === null}
                    className="mt-4 w-full h-9 rounded-md bg-gray-50 text-gray-900 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-300"
                >
                    Continue
                </button>
            </div>

            {view === "repo" ? (
                <RepoDashboard
                    repoStats={repoStats}
                    loading={loadingRepo}
                    onBack={() => setView("wrap")}
                />
            ) : (
                <>
                    <div className="flex flex-col flex-1 min-h-0 min-w-0 animate-slide-in-bottom">
                        <div className="flex flex-1 gap-6 p-6 min-h-0">
                            <TopLanguageCard stats={stats} />

                            <CommitPersonaCard stats={stats} />

                            <VolumeCard stats={stats} />
                        </div>

                        <div className="flex flex-1 gap-6 px-6 pb-6 min-h-0">
                            <RepoHighlightsCard stats={stats} />

                            <YourArchetypeCard stats={stats} />

                            <AchievementsCard stats={stats} />
                        </div>
                    </div>
                    <button type="button" className="flex flex-col items-center justify-center gap-12
                        text-white text-3xl mr-5 my-6 rounded-md border border-gray-700 bg-gray-900 shadow-md
                        cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-lg
                        active:scale-95 active:bg-gray-600 focus:outline-none focus-visible:ring-2
                        focus-visible:ring-gray-400 px-5 animate-slide-in-right"
                        style={{ fontFamily: "var(--font-anton)" }}
                    >
                        {"WRAPPED".split("").map((letter, i) => (
                            <span key={i}>{letter}</span>
                        ))}
                    </button>
                </>
            )}

            {rateLimited && (
                <RateLimitToast onDismiss={() => setRateLimited(false)} />
            )}
        </div>
    );
}
