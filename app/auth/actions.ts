"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function skipLogin() {
    const cookieStore = await cookies();
    cookieStore.set("skip_access", "true", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60,
    });
    redirect("/");
}

export async function goBack() {
    const cookieStore = await cookies();
    cookieStore.delete("skip_access");
    redirect("/");
}
