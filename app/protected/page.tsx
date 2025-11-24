import { redirect } from "next/navigation";
import { auth0, getRole } from "@/lib/auth0";

export default async function UserPage() {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/auth/login");
  }
  const role = getRole(session);

  if (!role.includes("User")) {
    return redirect("/unauthorized");
  }

  return <div>✅ Welcome to User Dashboard</div>;
}
