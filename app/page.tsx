import { cookies } from "next/headers";
import { auth } from "./auth/auth";
import { computeWrapStats } from "./github/wrapStats";
import Weblockpage from "./page/weblockPage";
import Ghpage from "./page/repoPage/ghPage";
import Skippage from "./page/repoPage/skipPage";

export default async function Home() {
    const session = await auth();

    if (session) {
        let repos: {
            id: number;
            name: string;
            full_name: string;
            fork: boolean;
            stargazers_count: number;
            created_at: string;
            pushed_at: string;
        }[] = [];

        try {
            const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            if (res.ok) {
                repos = await res.json();
            } else {
                console.error("Failed to fetch repos:", res.status, await res.text());
            }
        } catch (err) {
            console.error("Failed to reach GitHub API:", err);
        }

        let stats = null;
        if (session.accessToken) {
            try {
                stats = await computeWrapStats(session.accessToken, repos);
            } catch (err) {
                console.error("Failed to compute wrap stats:", err);
            }
        }

        return <Ghpage repos={repos} user={session.user} stats={stats} />;
    }

    const cookieStore = await cookies();

    if (cookieStore.get("skip_access")) {
        return <Skippage />;
    }

    return <Weblockpage />;
}
