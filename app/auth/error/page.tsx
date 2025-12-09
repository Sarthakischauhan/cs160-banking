import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string };
}) {
  const error = searchParams.error || "unknown_error";
  const errorDescription = searchParams.error_description || "An unknown authentication error occurred";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            Something went wrong during the login process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
            <p className="text-xs font-mono text-red-700 dark:text-red-300">
              <strong>Error:</strong> {error}
            </p>
            {errorDescription && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                {decodeURIComponent(errorDescription)}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please try logging in again. If the problem persists, contact our support team.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">Try Logging In Again</Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
