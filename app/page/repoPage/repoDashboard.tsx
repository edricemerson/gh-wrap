"use client";

import { useState } from "react";
import type { RepoStats } from "../../github/repoStats";

type IconName =
    | "star" | "fork" | "eye" | "box" | "calendar" | "scale" | "branch" | "globe"
    | "clock" | "streak" | "commit" | "users" | "issue" | "pr" | "quote" | "sparkle";

function Icon({ name, className }: { name: IconName; className?: string }) {
    const common = {
        viewBox: "0 0 24 24",
        className: className ?? "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    switch (name) {
        case "star":
            return <svg {...common}><path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" /></svg>;
        case "fork":
            return <svg {...common}><circle cx="6" cy="5" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6 7v2a4 4 0 0 0 4 4M18 7v2a4 4 0 0 1-4 4M12 13v4" /></svg>;
        case "eye":
            return <svg {...common}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
        case "box":
            return <svg {...common}><path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></svg>;
        case "calendar":
            return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
        case "scale":
            return <svg {...common}><path d="M12 3v18M7 7h10M4 7l3 6a3 3 0 0 0 6 0L10 7M14 7l3 6a3 3 0 0 0 6 0l-3-6" /></svg>;
        case "branch":
            return <svg {...common}><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="10" r="2" /><path d="M6 8v8M6 8a6 6 0 0 0 6 6h4" /></svg>;
        case "globe":
            return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
        case "clock":
            return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
        case "streak":
            return <svg {...common}><path d="M12 2c2.5 3 1 5-.5 7S9 13 9 15.5a3 3 0 0 0 6 0c0-1.2-.5-2-.5-2s.3 1.8-1 2.5c.8-2-.5-3.5-.5-3.5s-.2 1.8-1.5 2.5c1-2.5-1-6.5-1-6.5z" /></svg>;
        case "commit":
            return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M3 12h6M15 12h6" /></svg>;
        case "users":
            return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M15.5 14c2.5.3 4.5 2.5 4.5 5" /></svg>;
        case "issue":
            return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><circle cx="12" cy="16" r="0.6" fill="currentColor" /></svg>;
        case "pr":
            return <svg {...common}><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M6 8v8M18 16V8a4 4 0 0 0-4-4h-2" /></svg>;
        case "quote":
            return <svg {...common}><path d="M7 8c-2 0-3 1.5-3 3.5S5 15 7 15c0-3 1-4 3-4V8z" /><path d="M16 8c-2 0-3 1.5-3 3.5S14 15 16 15c0-3 1-4 3-4V8z" /></svg>;
        case "sparkle":
            return <svg {...common}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" /></svg>;
        default:
            return null;
    }
}

function formatSize(sizeKb: number) {
    if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
    return `${sizeKb} KB`;
}

function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function formatHour(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}${period}`;
}

function CardShell({
    title,
    onClick,
    children,
}: {
    title: string;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col flex-1 min-w-0 min-h-0 h-full text-left rounded-md border border-gray-700 bg-gray-900 shadow-md
            cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-lg
            active:scale-95 active:bg-gray-600 focus:outline-none focus-visible:ring-2
            focus-visible:ring-gray-400 p-4"
        >
            <div className="text-white font-semibold text-xl mb-5">{title}</div>
            {children}
        </button>
    );
}

function ModalShell({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
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
                    <div className="text-white font-semibold text-xl">{title}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function VitalsCard({ stats }: { stats: RepoStats }) {
    const [open, setOpen] = useState(false);
    const { vitals } = stats;

    return (
        <>
            <CardShell title="Repo Vitals" onClick={() => setOpen(true)}>
                <div className="flex flex-col gap-3 text-base">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-400"><Icon name="star" className="w-4 h-4" />Stars</span>
                        <span className="text-gray-100 font-semibold">{vitals.stars}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-400"><Icon name="fork" className="w-4 h-4" />Forks</span>
                        <span className="text-gray-100 font-semibold">{vitals.forks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-400"><Icon name="globe" className="w-4 h-4" />Language</span>
                        <span className="text-gray-100 font-semibold">{vitals.primaryLanguage ?? "—"}</span>
                    </div>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-800 text-gray-500 text-base truncate">
                    {vitals.description ?? "No description"}
                </div>
            </CardShell>
            {open && (
                <ModalShell title="Repo Vitals" onClose={() => setOpen(false)}>
                    {vitals.description && (
                        <div className="text-gray-300 text-sm mb-5">{vitals.description}</div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="star" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Stars</div><div className="text-gray-100 font-semibold">{vitals.stars}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="fork" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Forks</div><div className="text-gray-100 font-semibold">{vitals.forks}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="eye" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Watchers</div><div className="text-gray-100 font-semibold">{vitals.watchers}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="box" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Size</div><div className="text-gray-100 font-semibold">{formatSize(vitals.sizeKb)}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="calendar" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Created</div><div className="text-gray-100 font-semibold">{formatDate(vitals.createdAt)}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="scale" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">License</div><div className="text-gray-100 font-semibold">{vitals.license ?? "None"}</div></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-4 pt-4 border-t border-gray-800">
                        <Icon name="branch" className="w-4 h-4" />
                        Default branch: <span className="text-gray-200">{vitals.defaultBranch}</span>
                    </div>
                </ModalShell>
            )}
        </>
    );
}

const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
    "C++": "#f34b7d", C: "#555555", "C#": "#178600", PHP: "#4F5D95", Ruby: "#701516",
    Go: "#00ADD8", Rust: "#dea584", Swift: "#F05138", Kotlin: "#A97BFF", HTML: "#e34c26",
    CSS: "#563d7c", Shell: "#89e051", Dart: "#00B4AB", Vue: "#41b883", Scala: "#c22d40",
};

function languageColor(name: string) {
    return LANGUAGE_COLORS[name] ?? "#8b949e";
}

function LanguagesCard({ stats }: { stats: RepoStats }) {
    const [open, setOpen] = useState(false);
    const langs = stats.languages.breakdown;

    return (
        <>
            <CardShell title="Languages" onClick={() => setOpen(true)}>
                {langs.length === 0 ? (
                    <div className="text-gray-400 text-sm">No language data.</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {langs.slice(0, 3).map((l) => (
                            <div key={l.name}>
                                <div className="flex justify-between text-base text-gray-200">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: languageColor(l.name) }} />
                                        {l.name}
                                    </span>
                                    <span className="font-semibold">{l.percent}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                                    <div className="h-2 rounded-full" style={{ width: `${l.percent}%`, backgroundColor: languageColor(l.name) }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardShell>
            {open && (
                <ModalShell title="Language Breakdown" onClose={() => setOpen(false)}>
                    <div className="flex flex-col gap-4">
                        {langs.map((l) => (
                            <div key={l.name}>
                                <div className="flex justify-between text-base text-gray-200">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: languageColor(l.name) }} />
                                        {l.name}
                                    </span>
                                    <span className="font-semibold">{l.percent}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2.5 mt-1">
                                    <div className="h-2.5 rounded-full" style={{ width: `${l.percent}%`, backgroundColor: languageColor(l.name) }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalShell>
            )}
        </>
    );
}

function ActivityCard({ stats }: { stats: RepoStats }) {
    const [open, setOpen] = useState(false);
    const { activity } = stats;

    return (
        <>
            <CardShell title="Commit Activity" onClick={() => setOpen(true)}>
                <div className="flex flex-col gap-3 text-base">
                    <div className="text-xl font-bold text-white">{formatHour(activity.peakHour)}</div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Most active day</span>
                        <span className="text-gray-100 font-semibold">{activity.mostActiveDay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Longest streak</span>
                        <span className="text-gray-100 font-semibold">{activity.longestStreak}d</span>
                    </div>
                </div>
                {activity.lastCommit && (
                    <div className="mt-auto pt-3 border-t border-gray-800 text-gray-400 text-base truncate">
                        Last: &quot;{activity.lastCommit.message.split("\n")[0]}&quot;
                    </div>
                )}
            </CardShell>
            {open && (
                <ModalShell title="Commit Activity" onClose={() => setOpen(false)}>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="clock" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Peak hour</div><div className="text-gray-100 font-semibold">{formatHour(activity.peakHour)}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="calendar" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Most active day</div><div className="text-gray-100 font-semibold">{activity.mostActiveDay}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="streak" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Longest streak</div><div className="text-gray-100 font-semibold">{activity.longestStreak}d</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="commit" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Commits sampled</div><div className="text-gray-100 font-semibold">{activity.commitsSampled}</div></div>
                        </div>
                    </div>
                    {activity.lastCommit && (
                        <a
                            href={`https://github.com/${stats.vitals.fullName}/commit/${activity.lastCommit.sha}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block pt-4 border-t border-gray-800 rounded-md -mx-1 px-1 py-2 transition-colors duration-300 hover:bg-gray-800"
                        >
                            <div className="text-gray-400 text-xs mb-1">Last commit</div>
                            <div className="text-gray-100 font-semibold text-sm hover:underline">
                                &quot;{activity.lastCommit.message.split("\n")[0]}&quot;
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                                {activity.lastCommit.authorLogin ?? "unknown"} · {formatDate(activity.lastCommit.date)}
                            </div>
                        </a>
                    )}
                </ModalShell>
            )}
        </>
    );
}

function ContributorsCard({ stats }: { stats: RepoStats }) {
    const [open, setOpen] = useState(false);
    const top = stats.contributors.top;

    return (
        <>
            <CardShell title="Top Contributors" onClick={() => setOpen(true)}>
                {top.length === 0 ? (
                    <div className="text-gray-400 text-sm">Not enough data yet.</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {top.slice(0, 4).map((c) => (
                            <div key={c.login} className="flex items-center justify-between text-base">
                                <span className="flex items-center gap-2 text-gray-200">
                                    <Icon name="users" className="w-4 h-4 text-gray-400" />
                                    {c.login}
                                </span>
                                <span className="text-gray-100 font-semibold">{c.commits}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardShell>
            {open && (
                <ModalShell title="Top Contributors" onClose={() => setOpen(false)}>
                    {top.length === 0 ? (
                        <div className="text-gray-400 text-sm">Not enough data yet.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {top.map((c, i) => (
                                <a
                                    key={c.login}
                                    href={`https://github.com/${c.login}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2 rounded-md transition-colors duration-300 hover:bg-gray-800"
                                >
                                    <span className="flex items-center gap-3 text-gray-100 font-medium">
                                        <span className="text-gray-500 text-xs w-4">#{i + 1}</span>
                                        {c.login}
                                    </span>
                                    <span className="text-gray-400 text-sm">{c.commits} commits</span>
                                </a>
                            ))}
                        </div>
                    )}
                </ModalShell>
            )}
        </>
    );
}

function IssuesCard({ stats }: { stats: RepoStats }) {
    const [open, setOpen] = useState(false);
    const { issuesAndPRs } = stats;

    return (
        <>
            <CardShell title="Issues & PRs" onClick={() => setOpen(true)}>
                <div className="flex flex-col gap-3 text-base">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-400"><Icon name="issue" className="w-4 h-4" />Open issues</span>
                        <span className="text-gray-100 font-semibold">{issuesAndPRs.openIssues}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-400"><Icon name="pr" className="w-4 h-4" />Open PRs</span>
                        <span className="text-gray-100 font-semibold">{issuesAndPRs.openPRs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Merge rate</span>
                        <span className="text-gray-100 font-semibold">{issuesAndPRs.mergeRatePercent}%</span>
                    </div>
                </div>
            </CardShell>
            {open && (
                <ModalShell title="Issues & PRs" onClose={() => setOpen(false)}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="issue" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Open issues</div><div className="text-gray-100 font-semibold">{issuesAndPRs.openIssues}</div></div>
                        </div>
                        <div className="bg-gray-800 rounded-md p-3 flex items-start gap-3">
                            <Icon name="pr" className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                            <div><div className="text-gray-400 text-xs">Open PRs</div><div className="text-gray-100 font-semibold">{issuesAndPRs.openPRs}</div></div>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-800">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Merge rate (last {issuesAndPRs.closedPRsSampled} closed PRs)</span>
                            <span className="text-gray-100 font-bold">{issuesAndPRs.mergeRatePercent}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${issuesAndPRs.mergeRatePercent}%` }} />
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                            {issuesAndPRs.mergedPRsSampled} merged of {issuesAndPRs.closedPRsSampled} sampled
                        </div>
                    </div>
                </ModalShell>
            )}
        </>
    );
}

function PersonalityCard({ stats }: { stats: RepoStats }) {
    const [open, setOpen] = useState(false);
    const { personality } = stats;

    return (
        <>
            <CardShell title="Repo Personality" onClick={() => setOpen(true)}>
                <div className="flex flex-col gap-3">
                    {personality.mostUsedWord ? (
                        <div>
                            <div className="text-gray-400 text-base">Favorite word</div>
                            <div className="text-gray-100 font-semibold text-lg">
                                &quot;{personality.mostUsedWord}&quot;
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm">Not enough data yet.</div>
                    )}
                </div>
                {personality.firstCommit && (
                    <div className="mt-auto pt-3 border-t border-gray-800 text-gray-400 text-base truncate">
                        Origin: &quot;{personality.firstCommit.message.split("\n")[0]}&quot;
                    </div>
                )}
            </CardShell>
            {open && (
                <ModalShell title="Repo Personality" onClose={() => setOpen(false)}>
                    {personality.mostUsedWord && (
                        <div className="mb-6">
                            <div className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                                <Icon name="quote" className="w-4 h-4" /> Favorite word
                            </div>
                            <div className="text-gray-100 font-semibold text-lg">
                                &quot;{personality.mostUsedWord}&quot;
                            </div>
                        </div>
                    )}
                    {personality.firstCommit && (
                        <a
                            href={`https://github.com/${stats.vitals.fullName}/commit/${personality.firstCommit.sha}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block pt-4 border-t border-gray-800 rounded-md -mx-1 px-1 py-2 transition-colors duration-300 hover:bg-gray-800"
                        >
                            <div className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                                <Icon name="sparkle" className="w-4 h-4" /> Origin story — the first commit
                            </div>
                            <div className="text-gray-100 font-semibold text-sm hover:underline">
                                &quot;{personality.firstCommit.message.split("\n")[0]}&quot;
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                                {personality.firstCommit.authorLogin ?? "unknown"} · {formatDate(personality.firstCommit.date)}
                            </div>
                        </a>
                    )}
                </ModalShell>
            )}
        </>
    );
}

export default function RepoDashboard({
    repoStats,
    loading,
    onBack,
}: {
    repoStats: RepoStats | null;
    loading: boolean;
    onBack: () => void;
}) {
    return (
        <div className="flex flex-col flex-1 min-h-0 min-w-0 animate-slide-in-bottom">
            <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-2 min-w-0">
                <div className="text-white font-semibold text-2xl truncate min-w-0">
                    {repoStats ? repoStats.vitals.fullName : "Loading repo..."}
                </div>
                <button
                    type="button"
                    onClick={onBack}
                    className="shrink-0 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
                >
                    ← Back to Wrap
                </button>
            </div>

            {loading || !repoStats ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    Loading repo stats...
                </div>
            ) : (
                <>
                    <div className="flex flex-1 gap-6 p-6 min-h-0 min-w-0">
                        <VitalsCard stats={repoStats} />
                        <LanguagesCard stats={repoStats} />
                        <ActivityCard stats={repoStats} />
                    </div>
                    <div className="flex flex-1 gap-6 px-6 pb-6 min-h-0 min-w-0">
                        <ContributorsCard stats={repoStats} />
                        <IssuesCard stats={repoStats} />
                        <PersonalityCard stats={repoStats} />
                    </div>
                </>
            )}
        </div>
    );
}
