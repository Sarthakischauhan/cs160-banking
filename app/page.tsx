import { auth0 } from "@/lib/auth0";
import jwt from "jsonwebtoken";


export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main>
        <div><a href="/auth/login">Log in</a></div>
        <div><a href="/auth/signup">Sign up</a></div>
        <div><a href="/admin">Admin Dashboard</a></div>
        <div><a href="/protected">Protected page</a></div>
      </main>
    );
  }

  const decodedToken = jwt.decode(session.tokenSet.idToken) as Record<string, any> | null;
  const roles = decodedToken['https://my-app.example.com/roles'];


  return (
    <main>
      <p>Logged in as: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Roles: {roles.join(", ") || "No roles assigned"}</p>
      <div><a href="/admin">Admin Dashboard</a></div>
      <div><a href="/protected">Protected page</a></div>
      <div><a href="/auth/logout">Log Out</a></div>
    </main>
  );
}
