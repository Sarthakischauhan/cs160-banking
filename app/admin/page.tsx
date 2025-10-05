import { auth0, getRole } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/auth/login");
  }
  const role = getRole(session)

  if (!role.includes("Admin")) {
    return redirect("/unauthorized");
  }

  return <div>✅ Welcome to Admin Dashboard</div>;
}
