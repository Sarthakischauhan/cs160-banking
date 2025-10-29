"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OnboardStep } from "@/types/onboard";
import {
  renderEmailVerificationStep,
  renderProfileCompletionStep,
  renderAccountPendingStep,
  renderCompleteStep,
} from "./components";

export default function OnboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardStep>("verify");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    accountType: "",
  });

  // Change the page to handle flow of verified user, instead of having a search param use the client side logic to figure out if they need to verify their email
  useEffect(() => {
    const verifyParam = searchParams.get("verify");
    if (verifyParam === "true") {
      setCurrentStep("verify");
    } else {
      checkUserStatus();
    }
  }, [searchParams]);

  const checkUserStatus = async () => {
    try {
      const response = await fetch("/api/customer");
      if (response.ok) {
        const customer = await response.json();
        if (customer) {
          if (customer.account_type) {
            setCurrentStep("complete");
          } else {
            setCurrentStep("profile");
          }
        }
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);
    try {
      // Redirect to Auth0 login with signup hint
      window.location.href = "/auth/login?screen_hint=signup";
    } catch (error) {
      console.error("Error triggering email verification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          phone: formData.phone,
          account_type: formData.accountType,
        }),
      });

      if (response.ok) {
        setCurrentStep("pending");
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentStep === "verify" && renderEmailVerificationStep({
          handleEmailVerification,
          isLoading
        })}
        {currentStep === "profile" && renderProfileCompletionStep({
          formData,
          handleInputChange,
          handleProfileSubmit,
          isLoading
        })}
        {currentStep === "pending" && renderAccountPendingStep({})}
        {currentStep === "complete" && renderCompleteStep({
          onGoToDashboard: handleGoToDashboard
        })}
      </div>
    </div>
  );
}
