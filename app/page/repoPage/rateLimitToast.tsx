"use client";

import { signIn } from "next-auth/react";

export default function RateLimitToast({ onDismiss }: { onDismiss: () => void }) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg px-5 py-4 max-w-md animate-slide-in-bottom">
            <div className="flex-1">
                <div className="text-white font-semibold text-sm">
                    GitHub rate limit reached
                </div>
                <div className="text-gray-400 text-xs mt-1">
                    Guest browsing is limited by GitHub. Sign in with GitHub for a much higher limit.
                </div>
            </div>
            <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="shrink-0 text-sm font-semibold bg-gray-50 text-gray-900 rounded-md px-3 py-1.5 hover:bg-gray-200 transition-colors duration-300"
            >
                Sign in
            </button>
            <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss"
                className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors duration-300"
            >
                ✕
            </button>
        </div>
    );
}
