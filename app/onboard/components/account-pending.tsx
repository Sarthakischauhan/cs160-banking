import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { AccountPendingProps } from "@/types/onboard";

export const renderAccountPendingStep = ({}: AccountPendingProps) => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
        <Clock className="w-6 h-6 text-yellow-600" />
      </div>
      <CardTitle>Account Under Review</CardTitle>
      <CardDescription>
        Thank you for completing your profile! Your account is now under review by our team.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          We'll review your information and create your bank account within 1-2 business days.
        </p>
        <p className="text-sm text-gray-600">
          You'll receive an email notification once your account is ready.
        </p>
      </div>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <AlertCircle className="w-4 h-4" />
        <span>Please do not refresh this page</span>
      </div>
    </CardContent>
  </Card>
);
