import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import axios from "axios";

async function getUserRoles(userId: string) {
  const tokenResponse = await axios.post(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    }
  );

  const mgmtApiToken = tokenResponse.data.access_token;

  const rolesResponse = await axios.get(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${mgmtApiToken}`,
      },
    }
  );

  return rolesResponse.data.map((r: any) => r.name);
}

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/auth/login");
  }

  const roles = await getUserRoles(session.user.sub);
  const isAdmin = roles.includes("admin");

  if (!isAdmin) {
    return redirect("/unauthorized");
  }

  return <div>✅ Welcome to Admin Dashboard</div>;
}
