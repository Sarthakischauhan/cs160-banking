"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();

  const handleReturnHome = () => {
    // Redirect to Auth0's logout endpoint which will clear the session and redirect to home
    window.location.href = "/api/auth/logout?returnTo=" + encodeURIComponent(window.location.origin + "/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You declined to authorize the login request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            To use our banking application, you need to authorize access. Without authorization, we cannot set up your account or let you access your banking features.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push("/auth/login")} className="w-full">
              Try Logging In Again
            </Button>
            <Button variant="outline" className="w-full" onClick={handleReturnHome}>
              Return to Home
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            If you need assistance, please contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
