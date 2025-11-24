"use server";

import { cookies } from "next/headers";

export async function toggleHideBalanceAction(newValue: boolean) {
	const cookieStore = await cookies();

	cookieStore.set("hideBalance", String(newValue), {
		path: "/",
		maxAge: 60 * 60 * 24 * 365, // 1 year
		sameSite: "strict",
	});
}
