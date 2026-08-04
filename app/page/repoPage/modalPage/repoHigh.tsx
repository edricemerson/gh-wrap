"use client";

import { useState } from "react";
import type { WrapStats } from "../../../github/wrapStats";

type IconName = "star" | "target" | "sparkle" | "trophy" | "tombstone";

function HighlightIcon({ name, className }: { name: IconName; className?: string }) {
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
        case "star":
            return (
                <svg {...common}>
                    <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
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
        case "sparkle":
            return (
                <svg {...common}>
                    <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
                </svg>
            );
        case "trophy":
            return (
                <svg {...common}>
                    <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
                    <path d="M7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5" />
                    <path d="M12 13v3M9 21h6M9 21l.5-2.5h5L15 21" />
                </svg>
            );
        case "tombstone":
            return (
                <svg {...common}>
                    <path d="M7 21V11a5 5 0 0 1 10 0v10z" />
                    <path d="M9 21v-3M15 21v-3" />
                </svg>
            );
        default:
            return null;
    }
}

function StatRow({
    icon,
    label,
    value,
}: {
    icon: IconName;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <HighlightIcon name={icon} className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
            <div>
                <div className="text-gray-400 text-xs">{label}</div>
                <div className="text-gray-100 font-semibold">{value}</div>
            </div>
        </div>
    );
}

function RepoHighlightsModal({
    stats,
    onClose,
}: {
    stats: WrapStats;
    onClose: () => void;
}) {
    const { highlights } = stats;

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
                        Repo Highlights
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    <StatRow
                        icon="star"
                        label="Most-starred repo"
                        value={
                            highlights.mostStarredRepo
                                ? `${highlights.mostStarredRepo.name} (${highlights.mostStarredRepo.stars}★)`
                                : "—"
                        }
                    />
                    <StatRow
                        icon="target"
                        label="Your baby this year"
                        value={
                            highlights.babyRepo
                                ? `${highlights.babyRepo.name} (${highlights.babyRepo.commits} commits)`
                                : "—"
                        }
                    />
                    <StatRow
                        icon="sparkle"
                        label="Newest repo"
                        value={highlights.newestRepo?.name ?? "—"}
                    />

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <HighlightIcon name="trophy" className="w-5 h-5 text-gray-300" />
                            <span className="text-gray-400 text-sm">Total stars earned</span>
                        </div>
                        <span className="text-gray-100 font-bold text-2xl">
                            {highlights.totalStars}
                        </span>
                    </div>

                    <div>
                        <div className="flex items-start gap-3">
                            <HighlightIcon
                                name="tombstone"
                                className="w-5 h-5 text-gray-300 shrink-0 mt-0.5"
                            />
                            <div className="flex-1">
                                <div className="text-gray-400 text-xs">
                                    Graveyard — {highlights.graveyardCount} repo
                                    {highlights.graveyardCount === 1 ? "" : "s"} untouched since creation
                                </div>
                                {highlights.graveyardRepos.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {highlights.graveyardRepos.map((name) => (
                                            <span
                                                key={name}
                                                className="text-gray-200 text-xs bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1"
                                            >
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-100 font-semibold">None — nice.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RepoHighlightsCard({ stats }: { stats: WrapStats | null }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => stats && setOpen(true)}
                disabled={!stats}
                className="flex flex-col flex-1 min-h-0 h-full text-left rounded-md border border-gray-700 bg-gray-900 shadow-md
                cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-lg
                active:scale-95 active:bg-gray-600 focus:outline-none focus-visible:ring-2
                focus-visible:ring-gray-400 p-4 disabled:cursor-default disabled:active:scale-100 disabled:hover:bg-gray-900 disabled:hover:shadow-md"
            >
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
                                        {stats.highlights.graveyardRepos.slice(0, 3).join(", ")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </button>
            {open && stats && (
                <RepoHighlightsModal stats={stats} onClose={() => setOpen(false)} />
            )}
        </>
    );
}
