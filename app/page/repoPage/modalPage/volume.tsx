"use client";

import { useState } from "react";
import type { WrapStats } from "../../../github/wrapStats";

type IconName = "commit" | "folder" | "globe" | "plus" | "minus" | "streak";

function VolumeIcon({ name, className }: { name: IconName; className?: string }) {
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
        case "folder":
            return (
                <svg {...common}>
                    <path d="M3 6h6l2 2h10v11H3z" />
                </svg>
            );
        case "globe":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                </svg>
            );
        case "plus":
            return (
                <svg {...common}>
                    <path d="M12 5v14M5 12h14" />
                </svg>
            );
        case "minus":
            return (
                <svg {...common}>
                    <path d="M5 12h14" />
                </svg>
            );
        case "streak":
            return (
                <svg {...common}>
                    <path d="M12 2c2.5 3 1 5-.5 7S9 13 9 15.5a3 3 0 0 0 6 0c0-1.2-.5-2-.5-2s.3 1.8-1 2.5c.8-2-.5-3.5-.5-3.5s-.2 1.8-1.5 2.5c1-2.5-1-6.5-1-6.5z" />
                </svg>
            );
        default:
            return null;
    }
}

function VolumeModal({
    stats,
    onClose,
}: {
    stats: WrapStats;
    onClose: () => void;
}) {
    const { volume } = stats;
    const changeTotal = volume.totalAdditions + volume.totalDeletions;
    const addPercent = changeTotal ? Math.round((volume.totalAdditions / changeTotal) * 100) : 0;

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
                        Volume
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-800 rounded-md p-3 flex flex-col items-center text-center">
                        <VolumeIcon name="commit" className="w-5 h-5 text-gray-300 mb-2" />
                        <div className="text-gray-100 font-bold text-xl">{volume.totalCommits}</div>
                        <div className="text-gray-400 text-xs">Commits</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3 flex flex-col items-center text-center">
                        <VolumeIcon name="folder" className="w-5 h-5 text-gray-300 mb-2" />
                        <div className="text-gray-100 font-bold text-xl">{volume.totalRepos}</div>
                        <div className="text-gray-400 text-xs">Repos</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3 flex flex-col items-center text-center">
                        <VolumeIcon name="globe" className="w-5 h-5 text-gray-300 mb-2" />
                        <div className="text-gray-100 font-bold text-xl">{volume.totalLanguages}</div>
                        <div className="text-gray-400 text-xs">Languages</div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2 text-green-400">
                            <VolumeIcon name="plus" className="w-4 h-4" />
                            +{volume.totalAdditions}
                        </span>
                        <span className="flex items-center gap-2 text-red-400">
                            <VolumeIcon name="minus" className="w-4 h-4" />
                            -{volume.totalDeletions}
                        </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-800">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${addPercent}%` }}
                        />
                        <div
                            className="h-full bg-red-500"
                            style={{ width: `${100 - addPercent}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                    <VolumeIcon name="streak" className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-400 text-sm">Longest streak</span>
                    <span className="ml-auto text-gray-100 font-bold text-xl">
                        {volume.longestStreak}d
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function VolumeCard({ stats }: { stats: WrapStats | null }) {
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
            </button>
            {open && stats && (
                <VolumeModal stats={stats} onClose={() => setOpen(false)} />
            )}
        </>
    );
}
