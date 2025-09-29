import { auth0 } from "@/lib/auth0";
import axios from "axios";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">Sign up</a> |{" "}
        <a href="/auth/login">Log in</a> |{" "}
        <a href="/protected">This is protected</a> |{" "}
        <a href="/admin">Admin Users Only</a> |{" "}
      </main>
    );
  }

  // **Fetch Management API token first**
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

  // **Fetch roles for this user**
  let roles: string[] = [];
  try {
    const rolesResponse = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${session.user.sub}/roles`,
      {
        headers: {
          Authorization: `Bearer ${mgmtApiToken}`,
        },
      }
    );
    roles = rolesResponse.data.map((r: any) => r.name);
  } catch (err) {
    console.error("Error fetching roles:", err);
  }

  return (
    <main>
      <p>Logged in as: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Roles: {roles.join(", ") || "No roles assigned"}</p>
      <a href="/admin">Admin Page</a> | <a href="/auth/logout">Log out</a> |{" "}
      <a href="/auth/access-token">TOKEN</a> |{" "}
      <a href="/auth/profile">PROFILE</a>
    </main>
  );
}
