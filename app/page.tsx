import { auth0, getRole } from "@/lib/auth0";
import jwt from "jsonwebtoken";
import { AppHeader } from "./components/app-header";
import { AuthCard } from "./components/auth-card";

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <main className="w-screen h-screen bg-gradient-to-b from-gray-50 via-sky-100 to-white">
        <AppHeader />
        <div className="grid w-full h-[75%] content-center justify-items-center col-span-3">
          <h1 className="font-bold text-5xl py-3">
            Welcome to the Online Bank
          </h1>
          <h2 className="font-semibold text-2xl text-gray-600 py-7">
            Bank anywhere. Anytime.
          </h2>
          <div className="grid grid-cols-3 justify-items-center content-center">
            <a href="/auth/login">
              <div className="border-1 border-black py-2 px-4 rounded-lg hover:bg-gray-300">
                Log in
              </div>
            </a>
            <div className="py-2">
              <span>or</span>
            </div>
            <a href="/auth/login?screen_hint=signup">
              <div className="border-1 border-black py-2 px-4 rounded-lg hover:bg-gray-300">
                Sign Up
              </div>
            </a>
          </div>
        </div>
      </main>
    );
  }
  const roles = getRole(session as any)
  if (!session.user.email_verified){}
  return (
    <main>
      <p>Logged in as: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Roles: {roles|| "No roles assigned"}</p>
      <div>
        <a href="/admin">Admin Dashboard</a>
      </div>
      <div>
        <a href="/protected">Protected page</a>
      </div>
      <div>
        <a href="/auth/logout">Log Out</a>
      </div>
    </main>
  );
}
