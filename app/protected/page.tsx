import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function UserPage() {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/auth/login");
  }

  const decodedToken = jwt.decode(session.tokenSet.idToken) as Record<string, any> | null;
  const roles = decodedToken['https://my-app.example.com/roles'];
  const isAdmin = roles.includes("User");

  if (!isAdmin) {
    return redirect("/unauthorized");
  }

  return <div>✅ Welcome to User Dashboard</div>;
}
