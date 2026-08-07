import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";
import { computeRepoStats, RateLimitError } from "../../github/repoStats";

export async function GET(request: NextRequest) {
    const session = await auth();

    const repo = request.nextUrl.searchParams.get("repo");
    if (!repo) {
        return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
    }

    try {
        // No session (e.g. guest/skip flow) still works, just unauthenticated
        // against GitHub's public API — private repos simply aren't visible.
        const stats = await computeRepoStats(session?.accessToken, repo);
        return NextResponse.json(stats);
    } catch (err) {
        if (err instanceof RateLimitError) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429 });
        }
        console.error("Failed to compute repo stats:", err);
        return NextResponse.json({ error: "Failed to compute repo stats" }, { status: 500 });
    }
}
