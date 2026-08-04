"use client";

import { useState } from "react";
import type { WrapStats } from "../../../github/wrapStats";

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

function LanguageBar({
    name,
    percent,
    size = "base",
}: {
    name: string;
    percent: number;
    size?: "base" | "lg";
}) {
    const textClass = size === "lg" ? "text-base" : "text-sm";
    const barHeight = size === "lg" ? "h-2.5" : "h-2";

    return (
        <div>
            <div className={`flex justify-between items-center ${textClass} text-gray-200 mb-1`}>
                <span className="flex items-center gap-2 font-medium">
                    <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: languageColor(name) }}
                    />
                    {name}
                </span>
                <span className="font-semibold">{percent}%</span>
            </div>
            <div className={`w-full bg-gray-800 rounded-full ${barHeight}`}>
                <div
                    className={`${barHeight} rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%`, backgroundColor: languageColor(name) }}
                />
            </div>
        </div>
    );
}

function TopLanguageModal({
    stats,
    onClose,
}: {
    stats: WrapStats;
    onClose: () => void;
}) {
    const { languages } = stats;

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
                        Top Languages
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                    {languages.topLanguages.map((lang) => (
                        <LanguageBar key={lang.name} name={lang.name} percent={lang.percent} size="lg" />
                    ))}
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                    {languages.mostPolyglotRepo && (
                        <div className="text-sm text-gray-400">
                            Most polyglot repo
                            <div className="text-gray-100 font-medium">
                                {languages.mostPolyglotRepo.name}{" "}
                                <span className="text-gray-400 font-normal text-xs">
                                    ({languages.mostPolyglotRepo.count} languages)
                                </span>
                            </div>
                        </div>
                    )}
                    {languages.oneHitWonders.length > 0 && (
                        <div className="text-sm text-gray-400">
                            One-hit wonder{languages.oneHitWonders.length > 1 ? "s" : ""}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {languages.oneHitWonders.map((name) => (
                                    <span
                                        key={name}
                                        className="text-gray-200 text-xs bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TopLanguageCard({ stats }: { stats: WrapStats | null }) {
    const [open, setOpen] = useState(false);

    const hasLanguages = !!stats && stats.languages.topLanguages.length > 0;

    return (
        <>
            <button
                type="button"
                onClick={() => hasLanguages && setOpen(true)}
                disabled={!hasLanguages}
                className="flex flex-col flex-1 min-h-0 h-full text-left rounded-md border border-gray-700 bg-gray-900 shadow-md
                cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-lg
                active:scale-95 active:bg-gray-600 focus:outline-none focus-visible:ring-2
                focus-visible:ring-gray-400 p-4 disabled:cursor-default disabled:active:scale-100 disabled:hover:bg-gray-900 disabled:hover:shadow-md"
            >
                <div className="text-white font-semibold text-xl mb-5">
                    Top Language
                </div>
                {!hasLanguages || !stats ? (
                    <div className="text-gray-400 text-sm">Not enough data yet.</div>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex flex-col gap-3">
                            {stats.languages.topLanguages.slice(0, 3).map((lang) => (
                                <LanguageBar key={lang.name} name={lang.name} percent={lang.percent} />
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
            </button>
            {open && hasLanguages && stats && (
                <TopLanguageModal stats={stats} onClose={() => setOpen(false)} />
            )}
        </>
    );
}
