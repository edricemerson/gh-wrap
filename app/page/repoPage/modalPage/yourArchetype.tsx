"use client";

import { useState } from "react";
import type { WrapStats } from "../../../github/wrapStats";

type ArchetypeInfo = {
    title: string;
    description: string;
};

const ALL_ARCHETYPES: ArchetypeInfo[] = [
    {
        title: "The Monogamist",
        description: "One repo, your whole heart. Most of your commits this year went to a single project.",
    },
    {
        title: "The Serial Starter",
        description: "Lots of new repos, light follow-through. You love a fresh idea more than finishing the last one.",
    },
    {
        title: "The Documentarian",
        description: "Docs and READMEs make up a real chunk of your work. Future-you (and everyone else) says thanks.",
    },
    {
        title: "The Full-Stacker",
        description: "Most of your repos mix frontend and backend in the same place. You build the whole thing, top to bottom.",
    },
    {
        title: "The Polyglot",
        description: `Six or more languages across your repos this year. You don't stick to one toolbox.`,
    },
    {
        title: "The Night Owl",
        description: "Most of your commits land late at night. The best code apparently happens after midnight.",
    },
    {
        title: "The Builder",
        description: "Steady, consistent output across the year. No single gimmick — just showing up and shipping.",
    },
];

function ArchetypeModal({
    stats,
    onClose,
}: {
    stats: WrapStats;
    onClose: () => void;
}) {
    const primaryTitle = stats.archetype.primary.title;
    const secondaryTitle = stats.archetype.secondary?.title ?? null;

    const ordered = [
        ...ALL_ARCHETYPES.filter((a) => a.title === primaryTitle),
        ...ALL_ARCHETYPES.filter((a) => a.title === secondaryTitle),
        ...ALL_ARCHETYPES.filter(
            (a) => a.title !== primaryTitle && a.title !== secondaryTitle
        ),
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto themed-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-1">
                    <div className="text-white font-semibold text-xl">
                        Archetypes
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>
                <div className="text-gray-400 text-sm mb-5">
                    Your primary is {primaryTitle}
                    {secondaryTitle ? `, runner-up is ${secondaryTitle}.` : "."}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {ordered.map((archetype) => {
                        const isPrimary = archetype.title === primaryTitle;
                        const isSecondary = archetype.title === secondaryTitle;
                        const matched = isPrimary || isSecondary;

                        return (
                            <div
                                key={archetype.title}
                                className={`rounded-md p-3 border transition-colors duration-300 ${
                                    matched
                                        ? "bg-gray-800 border-gray-600"
                                        : "bg-gray-900 border-gray-800 opacity-40"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`text-sm font-semibold ${
                                            matched ? "text-white" : "text-gray-400"
                                        }`}
                                    >
                                        {archetype.title}
                                    </div>
                                    {isPrimary && (
                                        <span className="text-[10px] uppercase tracking-wide text-gray-900 bg-gray-200 rounded-full px-1.5 py-0.5">
                                            Primary
                                        </span>
                                    )}
                                    {isSecondary && (
                                        <span className="text-[10px] uppercase tracking-wide text-gray-300 border border-gray-600 rounded-full px-1.5 py-0.5">
                                            Runner-up
                                        </span>
                                    )}
                                </div>
                                <div className="text-gray-400 text-xs mt-1">
                                    {archetype.description}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function YourArchetypeCard({ stats }: { stats: WrapStats | null }) {
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
            </button>
            {open && stats && (
                <ArchetypeModal stats={stats} onClose={() => setOpen(false)} />
            )}
        </>
    );
}
