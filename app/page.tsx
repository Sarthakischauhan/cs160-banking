import { auth0, getRole } from "@/lib/auth0";
import jwt from "jsonwebtoken";
import { AppHeader } from "./components/app-header";
import { ProfilePage } from "./components/profile";

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <main className="w-screen h-screen bg-gradient-to-b from-gray-50 via-sky-100 to-white">
        <AppHeader />
        <div className="grid w-full h-[75%] content-center justify-items-center col-span-3">
          <h1 className="font-bold text-5xl py-3">Welcome to the Online Bank</h1>
          <h2 className="font-semibold text-2xl text-gray-600 py-7">Bank anywhere. Anytime.</h2>
          <div className="grid grid-cols-3 justify-items-center content-center">
            <a href="/auth/login">
              <div className="border-1 border-black py-2 px-4 rounded-lg hover:bg-gray-300">Log in</div>
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

  const decodedToken = jwt.decode(session.tokenSet.idToken) as Record<string, any> | null;
  const roles = decodedToken?.["https://my-app.example.com/roles"] ?? [];

  return <ProfilePage session={session} roles={roles} />;
}
