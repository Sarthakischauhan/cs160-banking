"use client";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent } 
from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function emailVerification(){
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
   const router = useRouter()
   useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await fetch("/api/auth/me")
            if (!result){
                throw new Error("Failed to fetch access token");
            }
            const session = await result.json()
            if (!session){
                throw new Error("No session data")
            }
            if (session?.email_verified){
                router.push("/dashboard")
            }
        } catch (error) {
            console.log("Error in fetching data:", error)
        }
    }
    const intervalId = setInterval(fetchData, 2000)
    return () => {
        clearInterval(intervalId)
    }
   }, [router])

   const handleResendVerification = async () => {
     setIsLoading(true)
     setMessage(null)
     
     try {
       const response = await fetch("/api/auth/email-verification", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
       })

       const data = await response.json()

       if (response.ok) {
         setMessage({
           type: 'success',
           text: 'Verification email sent successfully! Please check your inbox.'
         })
       } else {
         setMessage({
           type: 'error',
           text: data.error === 'failed_to_send_verification_email' 
             ? 'Failed to send verification email. Please try again later.'
             : 'An error occurred. Please try again.'
         })
       }
     } catch (error) {
       console.error('Error sending verification email:', error)
       setMessage({
         type: 'error',
         text: 'Network error. Please check your connection and try again.'
       })
     } finally {
       setIsLoading(false)
     }
   }

   return(
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
        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Didn't receive the email? Check your spam folder or request a new verification email.
          </p>
          <Button 
            onClick={handleResendVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>
      </CardContent>
    </Card>

   )
}