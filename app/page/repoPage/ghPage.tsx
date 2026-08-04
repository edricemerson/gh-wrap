"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

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

function formatHour(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}${period}`;
}

const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Dart: "#00B4AB",
    Vue: "#41b883",
    Scala: "#c22d40",
    R: "#198CE7",
    "Objective-C": "#438eff",
    Perl: "#0298c3",
    Lua: "#000080",
    Haskell: "#5e5086",
    Elixir: "#6e4a7e",
    Clojure: "#db5855",
    Groovy: "#4298b8",
    PowerShell: "#012456",
    Dockerfile: "#384d54",
    Makefile: "#427819",
};

function languageColor(name: string) {
    return LANGUAGE_COLORS[name] ?? "#8b949e";
}

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

    const filteredRepos = repos.filter((repo) =>
        repo.full_name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden">
            {/* LEFT SECTION */}
            <div className="flex flex-col items-start bg-gray-900 px-8 py-6 w-96 h-screen">
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
                    disabled={selected === null}
                    className="mt-4 w-full h-9 rounded-md bg-gray-50 text-gray-900 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-300"
                >
                    Continue
                </button>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
                <div className="flex flex-1 gap-6 p-6 min-h-0">
                    <div className="bg-gray-900 flex flex-col flex-1 min-h-0 h-full rounded-md p-4">
                        <div className="text-white font-semibold text-xl mb-5">
                            Top Language
                        </div>
                        {!stats || stats.languages.topLanguages.length === 0 ? (
                            <div className="text-gray-400 text-sm">Not enough data yet.</div>
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0">
                                <div className="flex flex-col gap-3">
                                    {stats.languages.topLanguages.map((lang) => (
                                        <div key={lang.name}>
                                            <div className="flex justify-between items-center text-base text-gray-200">
                                                <span className="flex items-center gap-2 font-medium">
                                                    <span
                                                        className="w-3 h-3 rounded-full inline-block"
                                                        style={{ backgroundColor: languageColor(lang.name) }}
                                                    />
                                                    {lang.name}
                                                </span>
                                                <span className="font-semibold">{lang.percent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                                                <div
                                                    className="h-2.5 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${lang.percent}%`,
                                                        backgroundColor: languageColor(lang.name),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-gray-800">
                                    {stats.languages.mostPolyglotRepo && (
                                        <div className="text-base text-gray-400">
                                            Most polyglot repo
                                            <div className="text-gray-100 font-medium text-base">
                                                {stats.languages.mostPolyglotRepo.name}{" "}
                                                <span className="text-gray-400 font-normal text-base">
                                                    ({stats.languages.mostPolyglotRepo.count} languages)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {stats.languages.oneHitWonders.length > 0 && (
                                        <div className="text-base text-gray-400">
                                            One-hit wonder
                                            <div className="text-gray-100 font-medium text-base">
                                                {stats.languages.oneHitWonders[0]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 flex flex-col flex-1 min-h-0 h-full rounded-md p-4">
                        <div className="text-white font-semibold text-xl mb-5">
                            Commit Personality
                        </div>
                        {!stats || stats.personality.totalCommits === 0 ? (
                            <div className="text-gray-400 text-sm">Not enough data yet.</div>
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <div className="text-xl font-bold text-white">
                                            {formatHour(stats.personality.peakHour)}
                                        </div>
                                        <div className="inline-block mt-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full px-2 py-0.5">
                                            {stats.personality.chronotype}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-base">
                                        <div>
                                            <div className="text-gray-400">Most active day</div>
                                            <div className="text-gray-100 font-semibold">
                                                {stats.personality.mostActiveDay}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">Longest streak</div>
                                            <div className="text-gray-100 font-semibold">
                                                {stats.personality.longestStreak} day
                                                {stats.personality.longestStreak === 1 ? "" : "s"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">Commits this year</div>
                                            <div className="text-gray-100 font-semibold">
                                                {stats.personality.totalCommits}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">Avg message length</div>
                                            <div className="text-gray-100 font-semibold">
                                                {stats.personality.avgMessageLength} chars
                                            </div>
                                        </div>
                                    </div>
                                    {stats.personality.mostUsedWord && (
                                        <div className="text-base">
                                            <div className="text-gray-400">Favorite commit word</div>
                                            <div className="text-gray-100 font-semibold">
                                                &quot;{stats.personality.mostUsedWord}&quot;
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto text-gray-500 text-base pt-3 border-t border-gray-800">
                                    {stats.personality.fixCount} fixes · {stats.personality.wipCount} WIPs ·{" "}
                                    {stats.personality.oopsCount} oops
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 flex flex-col flex-1 min-h-0 h-full rounded-md p-4">
                        <div className="text-white font-semibold text-xl mb-5">
                            Volume
                        </div>
                        {!stats ? (
                            <div className="text-gray-400 text-sm">Not enough data yet.</div>
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0 justify-between text-base">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Total commits</span>
                                    <span className="text-gray-100 font-bold text-base">
                                        {stats.volume.totalCommits}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Repos analyzed</span>
                                    <span className="text-gray-100 font-bold text-base">
                                        {stats.volume.totalRepos}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Languages touched</span>
                                    <span className="text-gray-100 font-bold text-base">
                                        {stats.volume.totalLanguages}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Lines added</span>
                                    <span className="text-green-400 font-bold text-base">
                                        +{stats.volume.totalAdditions}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Lines removed</span>
                                    <span className="text-red-400 font-bold text-base">
                                        -{stats.volume.totalDeletions}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Longest streak</span>
                                    <span className="text-gray-100 font-bold text-base">
                                        {stats.volume.longestStreak}d
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 gap-6 px-6 pb-6 min-h-0">
                    <div className="bg-gray-900 flex flex-col flex-1 min-h-0 h-full rounded-md p-4">
                        <div className="text-white font-semibold text-xl mb-5">
                            Repo Highlights
                        </div>
                        {!stats ? (
                            <div className="text-gray-400 text-sm">Not enough data yet.</div>
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0 text-base">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <div className="text-gray-400">Most-starred repo</div>
                                        <div className="text-gray-100 font-semibold">
                                            {stats.highlights.mostStarredRepo
                                                ? `${stats.highlights.mostStarredRepo.name} (${stats.highlights.mostStarredRepo.stars}★)`
                                                : "—"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Your baby this year</div>
                                        <div className="text-gray-100 font-semibold">
                                            {stats.highlights.babyRepo
                                                ? `${stats.highlights.babyRepo.name} (${stats.highlights.babyRepo.commits} commits)`
                                                : "—"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Newest repo</div>
                                        <div className="text-gray-100 font-semibold">
                                            {stats.highlights.newestRepo?.name ?? "—"}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-gray-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total stars earned</span>
                                        <span className="text-gray-100 font-bold text-base">
                                            {stats.highlights.totalStars}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">
                                            Graveyard ({stats.highlights.graveyardCount} repo
                                            {stats.highlights.graveyardCount === 1 ? "" : "s"} untouched since creation)
                                        </div>
                                        {stats.highlights.graveyardRepos.length > 0 && (
                                            <div className="text-gray-300">
                                                {stats.highlights.graveyardRepos.join(", ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 flex flex-col flex-1 min-h-0 h-full rounded-md p-4">
                        <div className="text-white font-semibold text-xl mb-5">
                            Your Archetype
                        </div>
                        {!stats ? (
                            <div className="text-gray-400 text-sm">Not enough data yet.</div>
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0 justify-center gap-4">
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {stats.archetype.primary.title}
                                    </div>
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                        {stats.archetype.primary.description}
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-800">
                                    {stats.archetype.secondary ? (
                                        <>
                                            <div className="text-sm font-semibold text-gray-300">
                                                Runner-up: {stats.archetype.secondary.title}
                                            </div>
                                            <div className="text-gray-400 text-xs leading-relaxed">
                                                {stats.archetype.secondary.description}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-500 text-xs leading-relaxed">
                                            No runner-up this year — you&apos;re a clean fit for just one archetype.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 flex flex-col flex-1 min-h-0 h-full rounded-md p-4">
                        <div className="text-white font-semibold text-xl mb-2">
                            Social Layer
                        </div>
                        {!stats ? (
                            <div className="text-gray-400 text-sm">Not enough data yet.</div>
                        ) : (
                            <div className="flex flex-col flex-1 min-h-0 text-xs">
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Followers</span>
                                        <span className="text-gray-100 font-bold text-base">
                                            {stats.social.followers}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">You starred most</div>
                                        <div className="text-gray-100 font-semibold">
                                            {stats.social.mostStarredOwner
                                                ? `${stats.social.mostStarredOwner.login} (${stats.social.mostStarredOwner.count} repos)`
                                                : "—"}
                                        </div>
                                    </div>
                                </div>
                                {stats.social.topStarredLanguages.length > 0 && (
                                    <div className="mt-auto pt-3 border-t border-gray-800">
                                        <div className="text-gray-400 mb-2">
                                            Top languages among repos you starred
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            {stats.social.topStarredLanguages.map((lang) => (
                                                <div key={lang.name}>
                                                    <div className="flex justify-between items-center text-gray-200">
                                                        <span className="flex items-center gap-1.5">
                                                            <span
                                                                className="w-2 h-2 rounded-full inline-block"
                                                                style={{ backgroundColor: languageColor(lang.name) }}
                                                            />
                                                            {lang.name}
                                                        </span>
                                                        <span>{lang.percent}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                                                        <div className="h-1.5 rounded-full"
                                                            style={{
                                                                width: `${lang.percent}%`,
                                                                backgroundColor: languageColor(lang.name),
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-12 w-10 text-white text-3xl mr-5"
                style={{ fontFamily: "var(--font-yellowtail)" }}
            >
                {"WRAPPED".split("").map((letter, i) => (
                    <span key={i}>{letter}</span>
                ))}
            </div>
        </div>
    );
}
