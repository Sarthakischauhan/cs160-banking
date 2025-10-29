import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { CompleteProps } from "@/types/onboard";

export const renderCompleteStep = ({ onGoToDashboard }: CompleteProps) => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-green-600" />
      </div>
      <CardTitle>Welcome to Your Bank!</CardTitle>
      <CardDescription>
        Your account has been created successfully. You can now access your dashboard.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={onGoToDashboard} className="w-full">
        Go to Dashboard
      </Button>
    </CardContent>
  </Card>
);
