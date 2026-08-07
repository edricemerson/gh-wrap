"use client";

import { useState, type SyntheticEvent } from "react";
import { goBack } from "../../auth/actions";
import Ghpage from "./ghPage";
import RateLimitToast from "./rateLimitToast";

function isRateLimited(res: Response) {
    return res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0";
}

type GuestData = {
    repos: { id: number; name: string; full_name: string }[];
    user: { name: string; image: string | null };
};

function parseGithubUsername(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const urlMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?$/i);
    if (urlMatch) return urlMatch[1];

    if (/^[a-zA-Z0-9-]+$/.test(trimmed)) return trimmed;

    return null;
}

export default function Skippage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [guestData, setGuestData] = useState<GuestData | null>(null);
    const [rateLimited, setRateLimited] = useState(false);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const username = parseGithubUsername(input);
        if (!username) {
            setError("Enter a GitHub profile link, e.g. https://github.com/username");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
            ]);

            if (isRateLimited(userRes) || isRateLimited(reposRes)) {
                setRateLimited(true);
                return;
            }

            if (!userRes.ok) {
                setError("Couldn't find that GitHub user.");
                return;
            }

            const userData = await userRes.json();
            const reposData: {
                id: number;
                name: string;
                full_name: string;
            }[] = reposRes.ok ? await reposRes.json() : [];

            setGuestData({
                repos: reposData.map((r) => ({
                    id: r.id,
                    name: r.name,
                    full_name: r.full_name,
                })),
                user: { name: userData.login, image: userData.avatar_url ?? null },
            });
        } catch (err) {
            console.error("Failed to load GitHub profile:", err);
            setError("Something went wrong fetching that profile.");
        } finally {
            setLoading(false);
        }
    }

    if (guestData) {
        return <Ghpage repos={guestData.repos} user={guestData.user} stats={null} />;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center bg-gray-900 rounded-lg px-8 py-6 w-96">
                <div className="flex items-center justify-between w-full mb-4">
                    <div className="text-xl font-semibold text-white">
                        Insert GitHub Profile Link
                    </div>
                    <form action={goBack}>
                        <button
                            type="submit"
                            className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
                        >
                            Go back
                        </button>
                    </form>
                </div>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="https://github.com/username"
                        className="bg-gray-50 w-full h-8 text-gray-900 px-2 rounded-md"
                    />
                    {error && (
                        <div className="text-red-400 text-sm mt-2">{error}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full h-9 rounded-md bg-gray-50 text-gray-900 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-300"
                    >
                        {loading ? "Loading..." : "Continue"}
                    </button>
                </form>
                <div className="text-gray-500 text-xs mt-3">
                    Only public repos are visible without signing in.
                </div>
            </div>
            {rateLimited && (
                <RateLimitToast onDismiss={() => setRateLimited(false)} />
            )}
        </div>
    );
}
