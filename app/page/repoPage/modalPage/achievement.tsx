"use client";

import { useState } from "react";
import type { WrapStats } from "../../../github/wrapStats";

type IconName =
    | "commit"
    | "streak"
    | "moon"
    | "sun"
    | "globe"
    | "docs"
    | "star"
    | "starMany"
    | "broom"
    | "hammer"
    | "tombstone"
    | "folder"
    | "spark"
    | "bug"
    | "rocket"
    | "calendar"
    | "pen"
    | "alert"
    | "wrench"
    | "heart"
    | "users"
    | "target"
    | "quote"
    | "layers";

function AchievementIcon({ name, className }: { name: IconName; className?: string }) {
    const common = {
        viewBox: "0 0 24 24",
        className: className ?? "w-6 h-6",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    switch (name) {
        case "commit":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M3 12h6M15 12h6" />
                </svg>
            );
        case "streak":
            return (
                <svg {...common}>
                    <path d="M12 2c2.5 3 1 5-.5 7S9 13 9 15.5a3 3 0 0 0 6 0c0-1.2-.5-2-.5-2s.3 1.8-1 2.5c.8-2-.5-3.5-.5-3.5s-.2 1.8-1.5 2.5c1-2.5-1-6.5-1-6.5z" />
                </svg>
            );
        case "moon":
            return (
                <svg {...common}>
                    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                </svg>
            );
        case "sun":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
                </svg>
            );
        case "globe":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                </svg>
            );
        case "docs":
            return (
                <svg {...common}>
                    <path d="M6 2h9l3 3v17H6z" />
                    <path d="M14 2v4h4" />
                    <path d="M9 12h6M9 16h6" />
                </svg>
            );
        case "star":
            return (
                <svg {...common}>
                    <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
                </svg>
            );
        case "starMany":
            return (
                <svg {...common}>
                    <path d="M12 3l1.8 3.9 4.2.4-3.2 2.9.9 4.2-3.7-2.1-3.7 2.1.9-4.2-3.2-2.9 4.2-.4z" />
                    <circle cx="19" cy="7" r="1.3" />
                    <circle cx="5" cy="7" r="1.3" />
                </svg>
            );
        case "broom":
            return (
                <svg {...common}>
                    <path d="M14 3l7 7-4 4-7-7z" />
                    <path d="M14 3 6 11" />
                    <path d="M3 21l2-5M8 19l3-3M11 21l1-4" />
                </svg>
            );
        case "hammer":
            return (
                <svg {...common}>
                    <path d="M15 3l6 6-3 3-2-2-7 7-3-3 7-7-2-2z" />
                    <path d="M4 21l4-4" />
                </svg>
            );
        case "tombstone":
            return (
                <svg {...common}>
                    <path d="M7 21V11a5 5 0 0 1 10 0v10z" />
                    <path d="M9 21v-3M15 21v-3" />
                </svg>
            );
        case "folder":
            return (
                <svg {...common}>
                    <path d="M3 6h6l2 2h10v11H3z" />
                </svg>
            );
        case "spark":
            return (
                <svg {...common}>
                    <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
                </svg>
            );
        case "bug":
            return (
                <svg {...common}>
                    <rect x="8" y="8" width="8" height="10" rx="4" />
                    <path d="M12 8V5M9 5 7 3M15 5l2-2M4 12H2M22 12h-2M5 16l-2 2M19 16l2 2M8 12H4M16 12h4" />
                </svg>
            );
        case "rocket":
            return (
                <svg {...common}>
                    <path d="M12 2c3 2 5 6 4 11l-4 4-4-4c-1-5 1-9 4-11z" />
                    <circle cx="12" cy="9" r="1.5" />
                    <path d="M9 16l-2 5 4-2M15 16l2 5-4-2" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...common}>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
            );
        case "pen":
            return (
                <svg {...common}>
                    <path d="M4 20l1-4 11-11 3 3-11 11z" />
                    <path d="M14 6l3 3" />
                </svg>
            );
        case "alert":
            return (
                <svg {...common}>
                    <path d="M12 3l9 16H3z" />
                    <path d="M12 10v4" />
                    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
                </svg>
            );
        case "wrench":
            return (
                <svg {...common}>
                    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3 3-2-2z" />
                </svg>
            );
        case "heart":
            return (
                <svg {...common}>
                    <path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9z" />
                </svg>
            );
        case "users":
            return (
                <svg {...common}>
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    <circle cx="17" cy="9" r="2.4" />
                    <path d="M15.5 14c2.5.3 4.5 2.5 4.5 5" />
                </svg>
            );
        case "target":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
            );
        case "quote":
            return (
                <svg {...common}>
                    <path d="M7 8c-2 0-3 1.5-3 3.5S5 15 7 15c0-3 1-4 3-4V8z" />
                    <path d="M16 8c-2 0-3 1.5-3 3.5S14 15 16 15c0-3 1-4 3-4V8z" />
                </svg>
            );
        case "layers":
            return (
                <svg {...common}>
                    <path d="M12 3l9 5-9 5-9-5z" />
                    <path d="M3 13l9 5 9-5" />
                </svg>
            );
        default:
            return null;
    }
}

export type Achievement = {
    id: string;
    title: string;
    description: string;
    icon: IconName;
    check: (stats: WrapStats) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "first-commit",
        title: "First Commit",
        description: "Made at least one commit this year.",
        icon: "commit",
        check: (s) => s.personality.totalCommits >= 1,
    },
    {
        id: "getting-started",
        title: "Getting Started",
        description: "Reached 10 commits this year.",
        icon: "commit",
        check: (s) => s.personality.totalCommits >= 10,
    },
    {
        id: "committed",
        title: "Committed",
        description: "Reached 50 commits this year.",
        icon: "commit",
        check: (s) => s.personality.totalCommits >= 50,
    },
    {
        id: "century-club",
        title: "Century Club",
        description: "Reached 100 commits this year.",
        icon: "commit",
        check: (s) => s.personality.totalCommits >= 100,
    },
    {
        id: "streak-starter",
        title: "Streak Starter",
        description: "Committed on 2 days in a row.",
        icon: "streak",
        check: (s) => s.personality.longestStreak >= 2,
    },
    {
        id: "on-a-roll",
        title: "On a Roll",
        description: "Hit a 5-day commit streak.",
        icon: "streak",
        check: (s) => s.personality.longestStreak >= 5,
    },
    {
        id: "night-owl",
        title: "Night Owl",
        description: "Most commits land late at night.",
        icon: "moon",
        check: (s) => s.personality.chronotype === "Night Owl",
    },
    {
        id: "early-bird",
        title: "Early Bird",
        description: "Most commits land in the early morning.",
        icon: "sun",
        check: (s) => s.personality.chronotype === "Early Bird",
    },
    {
        id: "bilingual",
        title: "Bilingual",
        description: "Worked with 2 or more languages.",
        icon: "globe",
        check: (s) => s.volume.totalLanguages >= 2,
    },
    {
        id: "polyglot",
        title: "Polyglot",
        description: "Worked with 5 or more languages.",
        icon: "globe",
        check: (s) => s.volume.totalLanguages >= 5,
    },
    {
        id: "documentarian",
        title: "The Documentarian",
        description: "Markdown ranks among your top languages.",
        icon: "docs",
        check: (s) => s.languages.topLanguages.some((l) => l.name === "Markdown"),
    },
    {
        id: "first-star",
        title: "First Star",
        description: "Earned at least 1 star on a repo.",
        icon: "star",
        check: (s) => s.highlights.totalStars >= 1,
    },
    {
        id: "getting-noticed",
        title: "Getting Noticed",
        description: "Earned 10 or more stars total.",
        icon: "starMany",
        check: (s) => s.highlights.totalStars >= 10,
    },
    {
        id: "the-cleaner",
        title: "The Cleaner",
        description: "Removed 500+ lines of code this year.",
        icon: "broom",
        check: (s) => s.volume.totalDeletions >= 500,
    },
    {
        id: "builder",
        title: "Builder",
        description: "Added 1,000+ lines of code this year.",
        icon: "hammer",
        check: (s) => s.volume.totalAdditions >= 1000,
    },
    {
        id: "serial-starter",
        title: "Serial Starter",
        description: "Have at least one repo left untouched since creation.",
        icon: "tombstone",
        check: (s) => s.highlights.graveyardCount >= 1,
    },
    {
        id: "repo-collector",
        title: "Repo Collector",
        description: "Own 5 or more repos.",
        icon: "folder",
        check: (s) => s.volume.totalRepos >= 5,
    },
    {
        id: "one-hit-wonder",
        title: "One-Hit Wonder",
        description: "Used a language in exactly one repo.",
        icon: "spark",
        check: (s) => s.languages.oneHitWonders.length >= 1,
    },
    {
        id: "bug-squasher",
        title: "Bug Squasher",
        description: "5 or more commit messages mention a fix.",
        icon: "bug",
        check: (s) => s.personality.fixCount >= 5,
    },
    {
        id: "release-machine",
        title: "Release Machine",
        description: `Your favorite commit word is "release."`,
        icon: "rocket",
        check: (s) => s.personality.mostUsedWord === "release",
    },
    {
        id: "weekend-warrior",
        title: "Weekend Warrior",
        description: "Your most active day is a Saturday or Sunday.",
        icon: "calendar",
        check: (s) =>
            s.personality.mostActiveDay === "Saturday" ||
            s.personality.mostActiveDay === "Sunday",
    },
    {
        id: "wordsmith",
        title: "Wordsmith",
        description: "Average commit message is 40+ characters.",
        icon: "pen",
        check: (s) => s.personality.avgMessageLength >= 40,
    },
    {
        id: "oops",
        title: "Oops!",
        description: `At least one commit message says "oops."`,
        icon: "alert",
        check: (s) => s.personality.oopsCount >= 1,
    },
    {
        id: "work-in-progress",
        title: "Work In Progress",
        description: `At least one commit message says "WIP."`,
        icon: "wrench",
        check: (s) => s.personality.wipCount >= 1,
    },
    {
        id: "fan",
        title: "Fan",
        description: "Starred the same person's repos more than once.",
        icon: "heart",
        check: (s) => (s.social.mostStarredOwner?.count ?? 0) >= 2,
    },
    {
        id: "social-butterfly",
        title: "Social Butterfly",
        description: "Have 5 or more followers.",
        icon: "users",
        check: (s) => s.social.followers >= 5,
    },
    {
        id: "popular-pick",
        title: "Popular Pick",
        description: "One of your repos has 5+ stars.",
        icon: "star",
        check: (s) => (s.highlights.mostStarredRepo?.stars ?? 0) >= 5,
    },
    {
        id: "found-your-focus",
        title: "Found Your Focus",
        description: "10+ commits went to a single repo this year.",
        icon: "target",
        check: (s) => (s.highlights.babyRepo?.commits ?? 0) >= 10,
    },
    {
        id: "novelist",
        title: "Novelist",
        description: "Wrote a commit message 100+ characters long.",
        icon: "quote",
        check: (s) => s.personality.longestMessage.length >= 100,
    },
    {
        id: "full-stack-curious",
        title: "Full-Stack Curious",
        description: "Matched the Full-Stacker archetype this year.",
        icon: "layers",
        check: (s) =>
            s.archetype.primary.title === "The Full-Stacker" ||
            s.archetype.secondary?.title === "The Full-Stacker",
    },
];

function AchievementsModal({
    stats,
    onClose,
}: {
    stats: WrapStats;
    onClose: () => void;
}) {
    const earnedIds = new Set(
        ACHIEVEMENTS.filter((a) => a.check(stats)).map((a) => a.id)
    );

    const orderedAchievements = [
        ...ACHIEVEMENTS.filter((a) => earnedIds.has(a.id)),
        ...ACHIEVEMENTS.filter((a) => !earnedIds.has(a.id)),
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto themed-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-1">
                    <div className="text-white font-semibold text-xl">
                        Achievements
                    </div>
                    <button type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>
                <div className="text-gray-400 text-sm mb-5">
                    {earnedIds.size} / {ACHIEVEMENTS.length} unlocked
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {orderedAchievements.map((achievement) => {
                        const earned = earnedIds.has(achievement.id);
                        return (
                            <div
                                key={achievement.id}
                                className={`flex items-start gap-3 rounded-md p-3 border transition-colors duration-300 ${
                                    earned
                                        ? "bg-gray-800 border-gray-600"
                                        : "bg-gray-900 border-gray-800 opacity-40"
                                }`}
                            >
                                <AchievementIcon
                                    name={achievement.icon}
                                    className={`w-6 h-6 shrink-0 mt-0.5 ${
                                        earned ? "text-white" : "text-gray-500"
                                    }`}
                                />
                                <div>
                                    <div
                                        className={`text-sm font-semibold ${
                                            earned ? "text-white" : "text-gray-400"
                                        }`}
                                    >
                                        {achievement.title}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">
                                        {achievement.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function AchievementsCard({ stats }: { stats: WrapStats | null }) {
    const [open, setOpen] = useState(false);

    const earned = stats ? ACHIEVEMENTS.filter((a) => a.check(stats)) : [];
    const shown = earned.slice(0, 5);

    return (
        <>
            <button type="button"
                onClick={() => stats && setOpen(true)}
                disabled={!stats}
                className="flex flex-col flex-1 min-h-0 h-full text-left rounded-md border border-gray-700 bg-gray-900 shadow-md
                cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-lg
                active:scale-95 active:bg-gray-600 focus:outline-none focus-visible:ring-2
                focus-visible:ring-gray-400 p-4 disabled:cursor-default disabled:active:scale-100 disabled:hover:bg-gray-900 disabled:hover:shadow-md"
            >
                <div className="text-white font-semibold text-xl mb-5">
                    Achievements
                </div>
                {!stats ? (
                    <div className="text-gray-400 text-sm">Not enough data yet.</div>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0 text-base">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Unlocked</span>
                            <span className="text-gray-100 font-bold text-2xl">
                                {earned.length} / {ACHIEVEMENTS.length}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                            {shown.length === 0 && (
                                <div className="text-gray-500">
                                    No achievements unlocked yet — get committing!
                                </div>
                            )}
                            {shown.map((a) => (
                                <div key={a.id} className="flex items-center gap-2">
                                    <AchievementIcon
                                        name={a.icon}
                                        className="w-4 h-4 text-white shrink-0"
                                    />
                                    <div className="text-gray-100 font-semibold">
                                        {a.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {earned.length > shown.length && (
                            <div className="mt-auto text-gray-500 pt-3 border-t border-gray-800">
                                +{earned.length - shown.length} more unlocked
                            </div>
                        )}
                    </div>
                )}
            </button>
            {open && stats && (
                <AchievementsModal stats={stats} onClose={() => setOpen(false)} />
            )}
        </>
    );
}
