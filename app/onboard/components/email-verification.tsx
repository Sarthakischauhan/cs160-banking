import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent } 
from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { EmailVerificationProps } from "@/types/onboard";

export const renderEmailVerificationStep = ({handleEmailVerification, isLoading } : EmailVerificationProps) => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Didn't receive the email? Check your spam folder or request a new verification email.
          </p>
          <Button 
            onClick={handleEmailVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );