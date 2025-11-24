import { auth0, getRole } from "@/lib/auth0";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { redirect } from "next/navigation";

export function requireRole(session: SessionData | null, requiredRole: string) {
  if (!session) {
    redirect("/auth/login");
  }
  const roles = getRole(session);
  if (!roles.includes(requiredRole)) {
    redirect("/unauthorized");
  }
}