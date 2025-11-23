import { cookies } from "next/headers";
import { SettingsClient } from "./settings-client";

export default async function Settings() {
  // --- Initial State (SSR read) ---
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";

  return <SettingsClient initialTheme={theme} />;
}
