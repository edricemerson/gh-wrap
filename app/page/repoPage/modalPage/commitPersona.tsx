"use client";

import { useState } from "react";
import type { WrapStats } from "../../../github/wrapStats";

type IconName = "moon" | "sun" | "clock" | "calendar" | "streak" | "commit" | "quote" | "wrench" | "alert" | "bug";

function PersonaIcon({ name, className }: { name: IconName; className?: string }) {
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
        case "clock":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...common}>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
            );
        case "streak":
            return (
                <svg {...common}>
                    <path d="M12 2c2.5 3 1 5-.5 7S9 13 9 15.5a3 3 0 0 0 6 0c0-1.2-.5-2-.5-2s.3 1.8-1 2.5c.8-2-.5-3.5-.5-3.5s-.2 1.8-1.5 2.5c1-2.5-1-6.5-1-6.5z" />
                </svg>
            );
        case "commit":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M3 12h6M15 12h6" />
                </svg>
            );
        case "quote":
            return (
                <svg {...common}>
                    <path d="M7 8c-2 0-3 1.5-3 3.5S5 15 7 15c0-3 1-4 3-4V8z" />
                    <path d="M16 8c-2 0-3 1.5-3 3.5S14 15 16 15c0-3 1-4 3-4V8z" />
                </svg>
            );
        case "wrench":
            return (
                <svg {...common}>
                    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3 3-2-2z" />
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
        case "bug":
            return (
                <svg {...common}>
                    <rect x="8" y="8" width="8" height="10" rx="4" />
                    <path d="M12 8V5M9 5 7 3M15 5l2-2M4 12H2M22 12h-2M5 16l-2 2M19 16l2 2M8 12H4M16 12h4" />
                </svg>
            );
        default:
            return null;
    }
}

function formatHour(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}${period}`;
}

function formatRelativeTime(dateStr: string): string {
    const diffMs = Math.max(0, Date.now() - new Date(dateStr).getTime());
    const diffMin = Math.round(diffMs / 60000);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;

    const diffDay = Math.round(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;

    const diffMonth = Math.round(diffDay / 30);
    return `${diffMonth}mo ago`;
}

function chronotypeIcon(chronotype: string): IconName {
    if (chronotype === "Night Owl") return "moon";
    if (chronotype === "Early Bird") return "sun";
    return "clock";
}

function CommitPersonaModal({
    stats,
    onClose,
}: {
    stats: WrapStats;
    onClose: () => void;
}) {
    const { personality } = stats;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto themed-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="text-white font-semibold text-xl">
                        Commit Personality
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                        <PersonaIcon
                            name={chronotypeIcon(personality.chronotype)}
                            className="w-6 h-6 text-gray-200"
                        />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">
                            {formatHour(personality.peakHour)}
                        </div>
                        <div className="inline-block mt-1 text-xs font-medium text-gray-200 bg-gray-800 rounded-full px-2 py-0.5">
                            {personality.chronotype}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                        <PersonaIcon name="calendar" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-gray-400 text-xs">Most active day</div>
                            <div className="text-gray-100 font-semibold">{personality.mostActiveDay}</div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                        <PersonaIcon name="streak" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-gray-400 text-xs">Longest streak</div>
                            <div className="text-gray-100 font-semibold">
                                {personality.longestStreak} day{personality.longestStreak === 1 ? "" : "s"}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                        <PersonaIcon name="commit" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-gray-400 text-xs">Commits this year</div>
                            <div className="text-gray-100 font-semibold">{personality.totalCommits}</div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                        <PersonaIcon name="quote" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-gray-400 text-xs">Avg message length</div>
                            <div className="text-gray-100 font-semibold">{personality.avgMessageLength} chars</div>
                        </div>
                    </div>
                </div>

                {personality.mostUsedWord && (
                    <div className="mb-6">
                        <div className="text-gray-400 text-xs mb-1">Favorite commit word</div>
                        <div className="text-gray-100 font-semibold text-lg">
                            &quot;{personality.mostUsedWord}&quot;
                        </div>
                    </div>
                )}

                {personality.lastCommit && (
                    <a
                        href={
                            personality.lastCommit.sha
                                ? `https://github.com/${personality.lastCommit.fullName}/commit/${personality.lastCommit.sha}`
                                : `https://github.com/${personality.lastCommit.fullName}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mb-6 mt-4 -mx-3 p-3 border-t border-gray-800 rounded-md transition-colors duration-300 hover:bg-gray-800"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-gray-400 text-xs">Last commit</div>
                            <div className="text-gray-500 text-xs">
                                {formatRelativeTime(personality.lastCommit.date)}
                            </div>
                        </div>
                        <div className="text-gray-100 font-semibold text-sm leading-relaxed hover:underline">
                            &quot;{personality.lastCommit.message.split("\n")[0]}&quot;
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                            {personality.lastCommit.repoName} ·{" "}
                            {new Date(personality.lastCommit.date).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </div>
                    </a>
                )}

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-800">
                    <div className="flex flex-col items-center text-center">
                        <PersonaIcon name="wrench" className="w-5 h-5 text-gray-300 mb-1" />
                        <div className="text-gray-100 font-bold">{personality.fixCount}</div>
                        <div className="text-gray-400 text-xs">Fixes</div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <PersonaIcon name="bug" className="w-5 h-5 text-gray-300 mb-1" />
                        <div className="text-gray-100 font-bold">{personality.wipCount}</div>
                        <div className="text-gray-400 text-xs">WIPs</div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <PersonaIcon name="alert" className="w-5 h-5 text-gray-300 mb-1" />
                        <div className="text-gray-100 font-bold">{personality.oopsCount}</div>
                        <div className="text-gray-400 text-xs">Oops</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CommitPersonaCard({ stats }: { stats: WrapStats | null }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => stats && setOpen(true)}
                disabled={!stats || stats.personality.totalCommits === 0}
                className="flex flex-col flex-1 min-h-0 h-full text-left rounded-md border border-gray-700 bg-gray-900 shadow-md
                cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-lg
                active:scale-95 active:bg-gray-600 focus:outline-none focus-visible:ring-2
                focus-visible:ring-gray-400 p-4 disabled:cursor-default disabled:active:scale-100 disabled:hover:bg-gray-900 disabled:hover:shadow-md"
            >
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
                        <div className="mt-auto flex flex-col gap-1 pt-3 border-t border-gray-800">
                            {stats.personality.lastCommit && (
                                <div className="text-gray-400 text-base truncate">
                                    Last commit: &quot;{stats.personality.lastCommit.message.split("\n")[0]}&quot;{" "}
                                    <span className="text-gray-500">
                                        ({formatRelativeTime(stats.personality.lastCommit.date)})
                                    </span>
                                </div>
                            )}
                            <div className="text-gray-500 text-base">
                                {stats.personality.fixCount} fixes · {stats.personality.wipCount} WIPs ·{" "}
                                {stats.personality.oopsCount} oops
                            </div>
                        </div>
                    </div>
                )}
            </button>
            {open && stats && stats.personality.totalCommits > 0 && (
                <CommitPersonaModal stats={stats} onClose={() => setOpen(false)} />
            )}
        </>
    );
}
